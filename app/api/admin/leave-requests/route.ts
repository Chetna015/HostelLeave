import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');
  const search = searchParams.get('search') ?? '';
  const parentStatus = searchParams.get('parentStatus') ?? 'ALL';
  const wardenStatus = searchParams.get('wardenStatus') ?? 'ALL';
  const status = searchParams.get('status') ?? 'ALL';
  const fromDate = searchParams.get('fromDate');
  const toDate = searchParams.get('toDate');

  const where: any = { deleted: false };
  if (status !== 'ALL') {
    where.status = status;
  }
  if (parentStatus !== 'ALL') {
    where.parentStatus = parentStatus;
  }
  if (wardenStatus !== 'ALL') {
    where.wardenStatus = wardenStatus;
  }
  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) where.createdAt.gte = new Date(fromDate);
    if (toDate) where.createdAt.lte = new Date(toDate);
  }
  if (search) {
    where.student = {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  const [total, requests] = await prisma.$transaction([
    prisma.leaveRequest.count({ where }),
    prisma.leaveRequest.findMany({
      where,
      include: { student: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    requests: requests.map((request) => ({
      id: request.id,
      studentName: request.student.fullName,
      rollNumber: request.student.rollNumber,
      course: request.student.course,
      leaveType: request.leaveType,
      fromDate: request.departureDate,
      toDate: request.returnDate,
      parentStatus: request.parentStatus,
      wardenStatus: request.wardenStatus,
      currentStatus: request.status,
      createdAt: request.createdAt,
      parentOtpVerifiedAt: request.parentOtpVerifiedAt,
      parentVerifiedAt: request.parentVerifiedAt,
      parentSelfieUrl: request.parentSelfieUrl,
      parentSignatureUrl: request.parentSignatureUrl,
    })),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
