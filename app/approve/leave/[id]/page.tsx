'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeaveDetails } from '@/components/approval/LeaveDetails';
import { OtpVerification } from '@/components/approval/OtpVerification';
import { SignaturePad } from '@/components/approval/SignaturePad';
import { WebcamCapture } from '@/components/approval/WebcamCapture';

type ParentLeaveRequest = {
  id: string;
  leaveType: string;
  reason: string;
  destinationAddress: string;
  departureDate: string;
  returnDate: string;
  departureTime: string;
  status: string;
  parentStatus: string;
  wardenStatus: string;
  student: {
    fullName: string;
    rollNumber: string;
    course: string;
    hostelRoomNumber: string;
  };
  parentContactHint?: string | null;
  verification?: {
    otpSentAt?: string | null;
    otpVerifiedAt?: string | null;
    verifiedAt?: string | null;
    selfieCaptured?: boolean;
    signatureCaptured?: boolean;
  };
};

export default function ParentApprovalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [leaveRequest, setLeaveRequest] = useState<ParentLeaveRequest | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [selfieDataUrl, setSelfieDataUrl] = useState('');
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenValue = searchParams.get('token') ?? '';
    setToken(tokenValue);

    if (!tokenValue) {
      setLoading(false);
      setVerificationMessage('Missing verification token. Open the approval link from the parent notification.');
      return;
    }

    const loadLeaveRequest = async () => {
      try {
        const response = await axios.get<{ leaveRequest: ParentLeaveRequest }>('/api/parent/verification', {
          params: { leaveRequestId: params.id, token: tokenValue },
        });

        setLeaveRequest(response.data.leaveRequest);
        setOtpVerified(Boolean(response.data.leaveRequest.verification?.otpVerifiedAt));
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Unable to load verification request'
          : 'Unable to load verification request';
        setVerificationMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaveRequest();
  }, [params.id]);

  const handleOtpVerified = () => {
    setOtpVerified(true);
  };

  const handleSignatureSubmit = async (signature: string) => {
    if (!leaveRequest || !token) {
      return;
    }

    if (!selfieDataUrl) {
      const message = 'Capture the selfie before saving the signature.';
      setVerificationMessage(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    setVerificationMessage(null);

    try {
      const response = await axios.post('/api/parent/verification', {
        action: 'COMPLETE',
        leaveRequestId: params.id,
        token,
        selfieDataUrl,
        signatureDataUrl: signature,
        deviceInfo: navigator.userAgent,
      });

      toast.success(response.data.message ?? 'Parent verification completed');
      setVerificationMessage(response.data.message ?? 'Parent verification completed');
      router.push(`/leave-pass/${params.id}`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Unable to complete verification'
        : 'Unable to complete verification';
      setVerificationMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const parentApproved = leaveRequest?.parentStatus === 'APPROVED';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Parent portal</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Parent Approval</h1>
              <p className="mt-2 text-sm text-slate-500">Verify the leave request with OTP, live selfie capture, and signature completion.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Request ID: {params.id}</div>
          </div>
        </Card>

        {loading ? (
          <Card>
            <p className="text-sm text-slate-600">Loading verification request...</p>
          </Card>
        ) : verificationMessage && !leaveRequest ? (
          <Card>
            <p className="text-sm text-rose-700">{verificationMessage}</p>
          </Card>
        ) : !otpVerified ? (
          <Card>
            <OtpVerification leaveRequestId={params.id} token={token} onVerified={handleOtpVerified} />
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {leaveRequest && <LeaveDetails leaveRequest={leaveRequest} />}

            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Verification checklist
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${otpVerified ? 'text-emerald-500' : 'text-slate-300'}`} />
                    OTP verified
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className={`h-4 w-4 ${selfieDataUrl ? 'text-emerald-500' : 'text-slate-300'}`} />
                    Selfie captured
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${parentApproved ? 'text-emerald-500' : 'text-slate-300'}`} />
                    Parent approval recorded
                  </div>
                </div>

                {verificationMessage && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{verificationMessage}</div>}
              </Card>

              <WebcamCapture onCapture={setSelfieDataUrl} />

              {selfieDataUrl && (
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Selfie preview</p>
                  <img src={selfieDataUrl} alt="Captured parent selfie" className="mt-4 h-64 w-full rounded-3xl object-cover" />
                </div>
              )}

              <SignaturePad onSubmit={handleSignatureSubmit} disabled={submitting || !selfieDataUrl} />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="button" className="w-auto bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100" onClick={() => router.push('/login')}>
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}
