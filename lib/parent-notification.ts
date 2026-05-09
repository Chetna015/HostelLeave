type ParentContact = {
  email: string;
  mobileNumber: string;
};

type ParentNotificationInput = {
  contact: ParentContact;
  link: string;
  otp?: string;
  leaveRequestId: string;
};

type ParentNotificationResult = {
  delivered: boolean;
  channel: 'email' | 'console';
  provider?: 'brevo';
  destination?: string;
};

async function sendEmailWithBrevo(contact: ParentContact, subject: string, message: string, htmlMessage?: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    return null;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: senderEmail,
        name: process.env.BREVO_SENDER_NAME ?? 'Hostel Leave Management',
      },
      to: [{ email: contact.email }],
      subject,
      textContent: message,
      htmlContent: htmlMessage ?? message.replace(/\n/g, '<br />'),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo email failed: ${errorText}`);
  }

  return { provider: 'brevo' as const, destination: contact.email };
}

export async function sendParentNotification({ contact, link, otp, leaveRequestId }: ParentNotificationInput): Promise<ParentNotificationResult> {
  const subject = `Hostel leave verification for ${leaveRequestId}`;
  const message = `Verify the leave request here: ${link}${otp ? `\nOTP: ${otp}` : ''}`;
  const htmlMessage = `
    Verify the leave request here: <a href="${link}">${link}</a><br/>
    ${otp ? `<p>OTP: <strong>${otp}</strong></p>` : ''}
    <p>If the link does not open automatically, copy and paste the full approval URL into your browser.</p>
  `;

  const brevoResult = await sendEmailWithBrevo(contact, subject, message, htmlMessage);
  if (brevoResult) {
    return { delivered: true, channel: 'email', ...brevoResult };
  }

  console.warn('[parent-verification] brevo notification fallback', {
    email: contact.email,
    link,
    otp,
    leaveRequestId,
    reason: 'Brevo is not configured or the email request failed to send.',
  });

  return { delivered: false, channel: 'console' };
}
