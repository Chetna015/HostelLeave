import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { buildVerificationLink, generateOtp, generateVerificationToken, hashValue } from '@/lib/verification';
import { sendParentNotification } from '@/lib/parent-notification';

const leaveApplicationSchema = z.object({
  leaveType: z.string(),
  reason: z.string(),
  destinationAddress: z.string(),
  departureDate: z.string().min(1),
  returnDate: z.string().min(1),
  departureTime: z.string(),
  emergencyContact: z.string(),
  transportMode: z.string(),
  status: z.enum(['DRAFT', 'PENDING_PARENT']),
});

function combineDateAndTime(date: string, time: string) {
  const safeTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : '00:00:00';
  return new Date(`${date}T${safeTime}`);
}

async function getUserIdFromToken(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedData = leaveApplicationSchema.parse(body);

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            parentProfile: true,
          },
        },
      },
    });

    if (!studentProfile) {
      return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
    }

    const verificationToken = generateVerificationToken();
    const verificationTokenHash = hashValue(verificationToken);
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const otp = generateOtp();
    const otpHash = hashValue(otp);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        leaveType: parsedData.leaveType,
        reason: parsedData.reason,
        destinationAddress: parsedData.destinationAddress,
        departureDate: combineDateAndTime(parsedData.departureDate, parsedData.departureTime),
        returnDate: combineDateAndTime(parsedData.returnDate, '23:59'),
        departureTime: parsedData.departureTime,
        emergencyContact: parsedData.emergencyContact,
        transportMode: parsedData.transportMode,
        status: parsedData.status,
        studentId: studentProfile.id,
        parentVerificationTokenHash: verificationTokenHash,
        parentVerificationTokenExpiresAt: verificationTokenExpiresAt,
        parentOtpHash: otpHash,
        parentOtpExpiresAt: otpExpiresAt,
        parentOtpSentAt: new Date(),
      },
    });

    const parentProfile = studentProfile.user.parentProfile;
    let notificationDelivery = null;

    if (parentProfile) {
      notificationDelivery = await sendParentNotification({
        contact: {
          email: parentProfile.parentEmail,
          mobileNumber: parentProfile.parentMobileNumber,
        },
        link: buildVerificationLink(request.nextUrl.origin, leaveRequest.id, verificationToken),
        otp,
        leaveRequestId: leaveRequest.id,
      });
    }

    await prisma.notification.create({
      data: {
        userId,
        message: `Leave request ${leaveRequest.id} submitted and sent for parent verification.`,
      },
    });

    return NextResponse.json(
      {
        message: 'Leave application submitted successfully',
        leaveRequest,
        notificationDelivery,
        ...(process.env.NODE_ENV === 'development'
          ? {
              debugVerificationLink: buildVerificationLink(request.nextUrl.origin, leaveRequest.id, verificationToken),
              debugOtp: otp,
            }
          : {}),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}