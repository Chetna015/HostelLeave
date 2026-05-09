import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const studentRegistrationSchema = z.object({
  fullName: z.string(),
  fatherName: z.string(),
  course: z.string(),
  branch: z.string(),
  rollNumber: z.string(),
  hostelRoomNumber: z.string(),
  studentMobileNumber: z.string(),
  parentMobileNumber: z.string(),
  parentEmail: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = studentRegistrationSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.parentEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account already exists with this parent email' },
        { status: 400 }
      );
    }

    const existingStudent = await prisma.studentProfile.findUnique({
      where: { rollNumber: parsedData.rollNumber },
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: 'Student with this roll number already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsedData.parentEmail,
        password: hashedPassword,
        role: 'STUDENT',
        studentProfile: {
          create: {
            fullName: parsedData.fullName,
            fatherName: parsedData.fatherName,
            course: parsedData.course,
            branch: parsedData.branch,
            rollNumber: parsedData.rollNumber,
            hostelRoomNumber: parsedData.hostelRoomNumber,
            studentMobileNumber: parsedData.studentMobileNumber,
            studentIdCardUrl: '',
          },
        },
        parentProfile: {
          create: {
            parentMobileNumber: parsedData.parentMobileNumber,
            parentEmail: parsedData.parentEmail,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Student registered successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { message: 'A student account already exists with the provided details' },
        { status: 400 }
      );
    }

    console.error('Student registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}