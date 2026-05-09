import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { adminProfile: true },
    });

    if (!user || user.role !== 'ADMIN' || !user.adminProfile || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        accessToken,
        refreshToken,
        admin: {
          fullName: user.adminProfile.fullName,
          email: user.adminProfile.email,
          hostelName: user.adminProfile.hostelName,
          employeeId: user.adminProfile.employeeId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation failed', errors: error.errors }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
