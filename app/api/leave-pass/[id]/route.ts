import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: {
            user: {
              include: {
                parentProfile: true,
              },
            },
          },
        },
        approvals: {
          include: {
            approver: {
              include: {
                adminProfile: true,
              },
            },
            signature: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!leaveRequest) {
      return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
    }

    // Only allow access if the leave is approved
    if (leaveRequest.parentStatus !== 'APPROVED') {
      return NextResponse.json({ message: 'Leave request is not yet approved by parent' }, { status: 403 });
    }

    return NextResponse.json({ leaveRequest });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
