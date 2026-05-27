import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!studentProfile) {
    return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
  }

  const leaveRequest = await prisma.leaveRequest.findFirst({
    where: {
      id: params.id,
      studentId: studentProfile.id,
      deleted: false,
    },
    include: {
      student: true,
      approvals: {
        include: {
          approver: true,
          signature: true,
        },
      },
    },
  });

  if (!leaveRequest) {
    return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
  }

  return NextResponse.json({
    leaveRequest: {
      id: leaveRequest.id,
      leaveType: leaveRequest.leaveType,
      reason: leaveRequest.reason,
      destinationAddress: leaveRequest.destinationAddress,
      departureDate: leaveRequest.departureDate.toISOString(),
      returnDate: leaveRequest.returnDate.toISOString(),
      departureTime: leaveRequest.departureTime,
      emergencyContact: leaveRequest.emergencyContact,
      transportMode: leaveRequest.transportMode,
      status: leaveRequest.status,
      parentStatus: leaveRequest.parentStatus,
      wardenStatus: leaveRequest.wardenStatus,
      createdAt: leaveRequest.createdAt.toISOString(),
      student: {
        fullName: leaveRequest.student.fullName,
        rollNumber: leaveRequest.student.rollNumber,
        course: leaveRequest.student.course,
        hostelRoomNumber: leaveRequest.student.hostelRoomNumber,
      },
      approvals: leaveRequest.approvals.map((approval) => ({
        status: approval.status,
        approverRole: approval.approver.role,
        signature: approval.signature?.signature ?? null,
      })),
    },
  });
}