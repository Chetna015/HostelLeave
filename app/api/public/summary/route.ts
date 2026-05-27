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

    return NextResponse.json({ total, approved, pending, rejected }, { status: 200 });
  } catch (err) {
    console.error('Public summary error:', err);
    return NextResponse.json({ message: 'Unable to load summary' }, { status: 500 });
  }
}
