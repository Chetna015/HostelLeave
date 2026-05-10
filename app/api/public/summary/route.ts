import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      prisma.leaveRequest.count({ where: { deleted: false } }),
      prisma.leaveRequest.count({ where: { deleted: false, status: 'APPROVED' } }),
      prisma.leaveRequest.count({ where: { deleted: false, status: 'PENDING_PARENT' } }),
      prisma.leaveRequest.count({ where: { deleted: false, status: 'REJECTED' } }),
    ]);

    return NextResponse.json({ summary: { total, approved, pending, rejected } });
  } catch (error) {
    console.error('Public summary fetch failed', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
