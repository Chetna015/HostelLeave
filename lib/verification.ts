import crypto from 'crypto';

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashValue(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function buildVerificationLink(origin: string, leaveRequestId: string, token: string) {
  return new URL(`/approve/leave/${leaveRequestId}?token=${token}`, origin).toString();
}

export function maskPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length <= 4) {
    return digits;
  }

  return `${digits.slice(0, 2)}******${digits.slice(-2)}`;
}