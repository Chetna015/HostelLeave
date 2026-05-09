import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { Approval, Prisma } from '@prisma/client';
import { buildVerificationLink, generateOtp, generateVerificationToken, hashValue, maskPhoneNumber } from '@/lib/verification';
import { sendParentNotification } from '@/lib/parent-notification';
import { uploadVerificationMedia } from '@/lib/media-upload';

const requestSchema = z.object({
  action: z.enum(['SEND_OTP', 'VERIFY_OTP', 'COMPLETE']),
  leaveRequestId: z.string().min(1),
  token: z.string().min(1),
  otp: z.string().min(4).optional(),
  selfieDataUrl: z.string().optional(),
  signatureDataUrl: z.string().optional(),
  deviceInfo: z.string().optional(),
});

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || null;
  }

  return request.headers.get('x-real-ip') ?? null;
}

async function loadLeaveRequest(leaveRequestId: string, token: string) {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { id: leaveRequestId },
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
          approver: true,
          signature: true,
        },
      },
    },
  });

  if (!leaveRequest) {
    return { error: NextResponse.json({ message: 'Leave request not found' }, { status: 404 }) };
  }

  const tokenHash = hashValue(token);
  if (!leaveRequest.parentVerificationTokenHash || leaveRequest.parentVerificationTokenHash !== tokenHash) {
    return { error: NextResponse.json({ message: 'Invalid verification token' }, { status: 401 }) };
  }

  if (leaveRequest.parentVerificationTokenExpiresAt && leaveRequest.parentVerificationTokenExpiresAt.getTime() < Date.now()) {
    return { error: NextResponse.json({ message: 'Verification token expired' }, { status: 410 }) };
  }

  return { leaveRequest };
}

function getParentContact(leaveRequest: any) {
  const parentProfile = leaveRequest.student.user.parentProfile;

  if (!parentProfile) {
    throw new Error('Parent profile not found');
  }

  return parentProfile;
}

export async function GET(request: NextRequest) {
  const leaveRequestId = request.nextUrl.searchParams.get('leaveRequestId');
  const token = request.nextUrl.searchParams.get('token');

  if (!leaveRequestId || !token) {
    return NextResponse.json({ message: 'Missing leave request token' }, { status: 400 });
  }

  const loaded = await loadLeaveRequest(leaveRequestId, token);
  if ('error' in loaded) {
    return loaded.error;
  }

  const leaveRequest = loaded.leaveRequest;
  const parentContact = getParentContact(leaveRequest);

  return NextResponse.json({
    leaveRequest: {
      id: leaveRequest.id,
      leaveType: leaveRequest.leaveType,
      reason: leaveRequest.reason,
      destinationAddress: leaveRequest.destinationAddress,
      departureDate: leaveRequest.departureDate.toISOString(),
      returnDate: leaveRequest.returnDate.toISOString(),
      departureTime: leaveRequest.departureTime,
      transportMode: leaveRequest.transportMode,
      status: leaveRequest.status,
      parentStatus: leaveRequest.parentStatus,
      wardenStatus: leaveRequest.wardenStatus,
      student: {
        fullName: leaveRequest.student.fullName,
        rollNumber: leaveRequest.student.rollNumber,
        course: leaveRequest.student.course,
        hostelRoomNumber: leaveRequest.student.hostelRoomNumber,
      },
      parentContactHint: maskPhoneNumber(parentContact.parentMobileNumber),
      verification: {
        otpSentAt: leaveRequest.parentOtpSentAt,
        otpVerifiedAt: leaveRequest.parentOtpVerifiedAt,
        verifiedAt: leaveRequest.parentVerifiedAt,
        selfieCaptured: Boolean(leaveRequest.parentSelfieUrl),
        signatureCaptured: Boolean(leaveRequest.parentSignatureUrl),
      },
      approvals: leaveRequest.approvals.map((approval) => ({
        status: approval.status,
        approverRole: approval.approver.role,
      })),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);
    const loaded = await loadLeaveRequest(parsed.leaveRequestId, parsed.token);

    if ('error' in loaded) {
      return loaded.error;
    }

    const leaveRequest = loaded.leaveRequest;
    const parentProfile = getParentContact(leaveRequest);
    const tokenHash = hashValue(parsed.token);

    if (parsed.action === 'SEND_OTP') {
      const otp = generateOtp();
      await prisma.leaveRequest.update({
        where: { id: leaveRequest.id },
        data: {
          parentOtpHash: hashValue(otp),
          parentOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
          parentOtpSentAt: new Date(),
          parentVerificationTokenHash: tokenHash,
        },
      });

      await sendParentNotification({
        contact: {
          email: parentProfile.parentEmail,
          mobileNumber: parentProfile.parentMobileNumber,
        },
        link: buildVerificationLink(request.nextUrl.origin, leaveRequest.id, parsed.token),
        otp,
        leaveRequestId: leaveRequest.id,
      });

      return NextResponse.json({ message: 'OTP sent successfully', otpSent: true });
    }

    if (parsed.action === 'VERIFY_OTP') {
      if (!parsed.otp) {
        return NextResponse.json({ message: 'OTP is required' }, { status: 400 });
      }

      if (!leaveRequest.parentOtpHash || !leaveRequest.parentOtpExpiresAt) {
        return NextResponse.json({ message: 'OTP not generated yet' }, { status: 400 });
      }

      if (leaveRequest.parentOtpExpiresAt.getTime() < Date.now()) {
        return NextResponse.json({ message: 'OTP expired' }, { status: 410 });
      }

      if (leaveRequest.parentOtpHash !== hashValue(parsed.otp)) {
        return NextResponse.json({ message: 'Invalid OTP' }, { status: 401 });
      }

      await prisma.leaveRequest.update({
        where: { id: leaveRequest.id },
        data: {
          parentOtpVerifiedAt: new Date(),
          parentVerificationTokenHash: tokenHash,
        },
      });

      return NextResponse.json({ message: 'OTP verified successfully', otpVerified: true });
    }

    if (parsed.action === 'COMPLETE') {
      if (!leaveRequest.parentOtpVerifiedAt) {
        return NextResponse.json({ message: 'OTP verification is required first' }, { status: 409 });
      }

      if (!parsed.selfieDataUrl || !parsed.signatureDataUrl) {
        return NextResponse.json({ message: 'Selfie and signature are required' }, { status: 400 });
      }

      const selfieUpload = await uploadVerificationMedia(parsed.selfieDataUrl, 'hostel-leave/parent-selfies');
      const signatureUpload = await uploadVerificationMedia(parsed.signatureDataUrl, 'hostel-leave/parent-signatures');

      const signature = await prisma.signature.create({
        data: {
          signature: signatureUpload.url,
        },
      });

      await prisma.approval.create({
        data: {
          leaveRequestId: leaveRequest.id,
          approverId: parentProfile.userId,
          status: 'APPROVED',
          signatureId: signature.id,
        },
      });

      const deviceInfo = parsed.deviceInfo ?? request.headers.get('user-agent') ?? 'Unknown device';
      const clientIp = getClientIp(request);

      await prisma.leaveRequest.update({
        where: { id: leaveRequest.id },
        data: {
          parentStatus: 'APPROVED',
          status: 'PARENT_APPROVED',
          parentVerifiedAt: new Date(),
          parentSelfieUrl: selfieUpload.url,
          parentSignatureUrl: signatureUpload.url,
          parentDeviceInfo: deviceInfo,
          parentIpAddress: clientIp,
          parentVerificationTokenHash: null,
          parentVerificationTokenExpiresAt: null,
          parentOtpHash: null,
          parentOtpExpiresAt: null,
        },
      });

      const studentUserId = leaveRequest.student.userId;
      await prisma.notification.create({
        data: {
          userId: studentUserId,
          message: `Your leave request ${leaveRequest.id} has been approved by the parent.`,
        },
      });

      const adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN', deleted: false } });
      await Promise.all(adminUsers.map((adminUser) => prisma.notification.create({
        data: {
          userId: adminUser.id,
          message: `Parent approval completed for leave request ${leaveRequest.id}.`,
        },
      })));

      return NextResponse.json({
        message: 'Parent verification completed successfully',
        parentStatus: 'APPROVED',
        selfieUrl: selfieUpload.url,
        signatureUrl: signatureUpload.url,
      });
    }

    return NextResponse.json({ message: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }

    console.error('Parent verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}