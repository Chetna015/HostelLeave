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

function formatRelativeTime(createdAt: Date) {
  const diffMs = Date.now() - createdAt.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function getNotificationTitle(message: string) {
  if (message.toLowerCase().includes('approved')) {
    return 'Leave approved';
  }

  if (message.toLowerCase().includes('rejected')) {
    return 'Leave rejected';
  }

  return 'Notification';
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true },
  });

  if (!user || user.role !== 'STUDENT' || !user.studentProfile) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const studentProfile = user.studentProfile;

  const [totalApplications, pendingApprovals, approvedLeaves, rejectedLeaves, recentLeaves, notifications] = await Promise.all([
    prisma.leaveRequest.count({
      where: { deleted: false, studentId: studentProfile.id },
    }),
    prisma.leaveRequest.count({
      where: { deleted: false, studentId: studentProfile.id, status: 'PENDING_PARENT' },
    }),
    prisma.leaveRequest.count({
      where: { deleted: false, studentId: studentProfile.id, status: 'APPROVED' },
    }),
    prisma.leaveRequest.count({
      where: { deleted: false, studentId: studentProfile.id, status: 'REJECTED' },
    }),
    prisma.leaveRequest.findMany({
      where: { deleted: false, studentId: studentProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.notification.findMany({
      where: { deleted: false, userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    student: {
      name: studentProfile.fullName,
      rollNumber: studentProfile.rollNumber,
      course: studentProfile.course,
      roomNumber: studentProfile.hostelRoomNumber,
    },
    stats: {
      totalApplications,
      pendingApprovals,
      approvedLeaves,
      rejectedLeaves,
    },
    history: recentLeaves.map((request) => ({
      id: request.id,
      type: request.leaveType,
      date: request.departureDate.toISOString(),
      status: request.status,
    })),
    notifications: notifications.map((notification) => ({
      title: getNotificationTitle(notification.message),
      message: notification.message,
      time: formatRelativeTime(notification.createdAt),
    })),
  });
}