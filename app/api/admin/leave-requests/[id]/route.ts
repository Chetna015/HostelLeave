import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const actionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
});

function getUserIdFromRequest(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const requestData = await prisma.leaveRequest.findUnique({
    where: { id: params.id },
    include: { student: true, approvals: { include: { signature: true, approver: true } } },
  });

  if (!requestData) {
    return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
  }

  return NextResponse.json({ request: requestData });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { adminProfile: true } });
  if (!user || user.role !== 'ADMIN' || !user.adminProfile) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = actionSchema.parse(body);

  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: params.id },
    include: { approvals: true, student: true },
  });
  if (!leaveRequest) {
    return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
  }

  if (leaveRequest.parentStatus !== 'APPROVED') {
    return NextResponse.json({ message: 'Waiting for Parent' }, { status: 409 });
  }

  if (parsed.action === 'APPROVE') {
    const signature = await prisma.signature.create({
      data: { signature: user.adminProfile.signatureImage },
    });

    await prisma.approval.create({
      data: {
        leaveRequestId: params.id,
        approverId: user.id,
        status: 'APPROVED',
        signatureId: signature.id,
      },
    });

    await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        wardenStatus: 'APPROVED',
        status: 'APPROVED',
      },
    });

    await prisma.notification.create({
      data: {
        userId: leaveRequest.student.userId,
        message: `Your leave request ${leaveRequest.id} has been approved by the warden.`,
      },
    });

    return NextResponse.json({ message: 'Leave request approved' });
  }

  await prisma.approval.create({
    data: {
      leaveRequestId: params.id,
      approverId: user.id,
      status: 'REJECTED',
    },
  });

  await prisma.leaveRequest.update({
    where: { id: params.id },
    data: {
      wardenStatus: 'REJECTED',
      status: 'REJECTED',
    },
  });

  await prisma.notification.create({
    data: {
      userId: leaveRequest.student.userId,
      message: `Your leave request ${leaveRequest.id} has been rejected by the warden.`,
    },
  });

  return NextResponse.json({ message: 'Leave request rejected' });
}
