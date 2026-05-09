import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const adminRegistrationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobileNumber: z.string().min(10),
  employeeId: z.string().min(2),
  hostelName: z.string().min(2),
  password: z.string().min(8),
  signatureImage: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = adminRegistrationSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account already exists with this email' },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.adminProfile.findFirst({
      where: {
        OR: [{ email: parsedData.email }, { employeeId: parsedData.employeeId }],
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin account with this email or employee ID already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsedData.email,
        password: hashedPassword,
        role: 'ADMIN',
        adminProfile: {
          create: {
            fullName: parsedData.fullName,
            email: parsedData.email,
            mobileNumber: parsedData.mobileNumber,
            employeeId: parsedData.employeeId,
            hostelName: parsedData.hostelName,
            signatureImage: parsedData.signatureImage,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Admin registered successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { message: 'An admin account already exists with the provided details' },
        { status: 400 }
      );
    }

    console.error('Admin registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
