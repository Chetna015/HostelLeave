'use client';

import { useState } from 'react';
import axios from 'axios';

interface OtpVerificationProps {
  leaveRequestId: string;
  token: string;
  onVerified: () => void;
}

export const OtpVerification = ({ leaveRequestId, token, onVerified }: OtpVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sendOtp = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await axios.post('/api/parent/verification', {
        action: 'SEND_OTP',
        leaveRequestId,
        token,
      });
      setMessage('OTP sent to the parent contact on file.');
    } catch (error) {
      setMessage(axios.isAxiosError(error) ? error.response?.data?.message ?? 'Unable to send OTP' : 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await axios.post('/api/parent/verification', {
        action: 'VERIFY_OTP',
        leaveRequestId,
        token,
        otp,
      });
      onVerified();
      setMessage('OTP verified successfully. Continue with selfie and signature.');
    } catch (error) {
      setMessage(axios.isAxiosError(error) ? error.response?.data?.message ?? 'OTP verification failed' : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Verify OTP</h2>
        <p className="mt-2 text-sm text-slate-600">Use the OTP from the parent notification to verify this request. If the code was not received, resend a fresh OTP first.</p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={sendOtp}
          disabled={loading}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Resend OTP
        </button>
      </div>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        placeholder="Enter OTP"
      />
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading}
        className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Verify OTP
      </button>
    </div>
  );
};
