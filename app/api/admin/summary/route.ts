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

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const [total, approved, pending, rejected, students] = await Promise.all([
    prisma.leaveRequest.count({ where: { deleted: false } }),
    prisma.leaveRequest.count({ where: { deleted: false, status: 'APPROVED' } }),
    prisma.leaveRequest.count({ where: { deleted: false, status: 'PENDING_PARENT' } }),
    prisma.leaveRequest.count({ where: { deleted: false, status: 'REJECTED' } }),
    prisma.studentProfile.count({ where: { deleted: false } }),
  ]);

  return NextResponse.json({
    summary: {
      total,
      approved,
      pending,
      rejected,
      students,
    },
  });
}
