import { NextRequest } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import QRCode from 'qrcode';
import { LeavePassDocument } from '@/components/pdf/LeavePassDocument';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const leaveRequestId = request.nextUrl.searchParams.get('leaveRequestId');

  if (!leaveRequestId) {
    return Response.json({ message: 'Invalid leave request ID' }, { status: 400 });
  }

  try {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
      include: {
        student: true,
        approvals: {
          include: {
            signature: true,
          },
        },
      },
    });

    if (!leaveRequest) {
      return Response.json({ message: 'Leave request not found' }, { status: 404 });
    }

    const qrCodeDataUrl = await QRCode.toDataURL(leaveRequest.id);
    const pdfStream = await renderToStream(
      React.createElement(LeavePassDocument, { leaveRequest, qrCodeDataUrl }) as any
    );

    return new Response(pdfStream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="leave-pass-${leaveRequestId}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
