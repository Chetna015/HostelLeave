'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock3, FileText, PlaneTakeoff } from 'lucide-react';
import { LeaveForm } from '@/components/leave/LeaveForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const leaveApplicationSchema = z.object({
  leaveType: z.string().min(1, 'Leave type is required'),
  reason: z.string().min(1, 'Reason is required'),
  destinationAddress: z.string().min(1, 'Destination address is required'),
  departureDate: z.string().min(1, 'Departure date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
  transportMode: z.string().min(1, 'Transport mode is required'),
});

export type LeaveApplicationFormData = z.infer<typeof leaveApplicationSchema>;

export default function ApplyLeavePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<LeaveApplicationFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LeaveApplicationFormData>({
    resolver: zodResolver(leaveApplicationSchema),
  });

  const onSubmit = async (data: LeaveApplicationFormData) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');

      await axios.post(
        '/api/leave/apply',
        {
          ...data,
          status: 'PENDING_PARENT',
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      toast.success('Leave application submitted successfully');
      router.push('/dashboard/student');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Failed to submit leave request'
        : 'Failed to submit leave request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => setPreview(getValues());

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <PlaneTakeoff className="h-6 w-6 text-sky-600" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Student request</p>
              <h1 className="text-2xl font-bold text-slate-900">Apply for Leave</h1>
            </div>
          </div>

          <LeaveForm register={register} errors={errors} onSubmit={handleSubmit(onSubmit)} />

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" className="w-auto bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={handlePreview}>
              Preview
            </Button>
            <Button type="button" className="w-auto bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50" onClick={() => router.push('/dashboard/student')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-slate-500" />
              <h2 className="text-lg font-bold text-slate-900">Request Preview</h2>
            </div>

            {preview ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ['Leave Type', preview.leaveType],
                  ['Destination', preview.destinationAddress],
                  ['Departure Date', preview.departureDate],
                  ['Return Date', preview.returnDate],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Preview your request before submitting to the approval chain.</p>
            )}
          </Card>

          <Card>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Track', 'Approval status updates automatically'],
                ['Verify', 'Parent OTP and signature flow'],
                ['Pass', 'Download the final digital pass'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {title}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-slate-500" />
              <h2 className="text-lg font-bold text-slate-900">How it works</h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li>1. Fill in the form and preview the request.</li>
              <li>2. Submit to create a pending parent approval request.</li>
              <li>3. Parent verifies the request and signs digitally.</li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
