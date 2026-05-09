'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

type LeaveRequestDetail = {
  id: string;
  leaveType: string;
  reason: string;
  destinationAddress: string;
  departureDate: string;
  returnDate: string;
  departureTime: string;
  emergencyContact: string;
  transportMode: string;
  status: string;
  parentStatus: string;
  wardenStatus: string;
  student: {
    fullName: string;
    rollNumber: string;
    course: string;
    hostelRoomNumber: string;
  };
  approvals: Array<{
    status: string;
    approverRole: string;
    signature: string | null;
  }>;
};

export default function LeavePassPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadState, setDownloadState] = useState<'idle' | 'loading'>('idle');

  useEffect(() => {
    const token = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');

    if (!token) {
      router.push('/login');
      return;
    }

    const loadLeaveRequest = async () => {
      try {
        const response = await axios.get<{ leaveRequest: LeaveRequestDetail }>(`/api/student/leave-requests/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveRequest(response.data.leaveRequest);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Failed to load leave pass'
          : 'Failed to load leave pass';
        toast.error(message);
        router.push('/dashboard/student');
      } finally {
        setLoading(false);
      }
    };

    loadLeaveRequest();
  }, [params.id, router]);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    setDownloadState('loading');
    window.location.href = `/api/leave/pass/generate?leaveRequestId=${params.id}`;
    setTimeout(() => {
      setDownloadState('idle');
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Digital pass</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Loading pass...</h1>
        </div>
      </div>
    );
  }

  if (!leaveRequest) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Digital pass</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Hostel Leave Pass</h1>
              <p className="mt-2 text-sm text-slate-500">Verification ID: {params.id}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <QRCodeCanvas value={leaveRequest.id} size={128} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Student Details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Name:</span> {leaveRequest.student.fullName}</p>
                <p><span className="font-semibold text-slate-900">Roll Number:</span> {leaveRequest.student.rollNumber}</p>
                <p><span className="font-semibold text-slate-900">Course:</span> {leaveRequest.student.course}</p>
                <p><span className="font-semibold text-slate-900">Room:</span> {leaveRequest.student.hostelRoomNumber}</p>
                <p><span className="font-semibold text-slate-900">Leave Type:</span> {leaveRequest.leaveType}</p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Travel Details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Destination:</span> {leaveRequest.destinationAddress}</p>
                <p><span className="font-semibold text-slate-900">Departure:</span> {new Date(leaveRequest.departureDate).toLocaleDateString()} at {leaveRequest.departureTime}</p>
                <p><span className="font-semibold text-slate-900">Return:</span> {new Date(leaveRequest.returnDate).toLocaleDateString()}</p>
                <p><span className="font-semibold text-slate-900">Transport:</span> {leaveRequest.transportMode}</p>
                <p><span className="font-semibold text-slate-900">Current Status:</span> <StatusBadge status={leaveRequest.status} /></p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5">
            <h2 className="text-lg font-bold text-slate-900">Approval Status</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Parent</p>
                <div className="mt-2"><StatusBadge status={leaveRequest.parentStatus} /></div>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Warden</p>
                <div className="mt-2"><StatusBadge status={leaveRequest.wardenStatus} /></div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Parent Signature</p>
              <div className="mt-3 h-24 rounded-2xl bg-slate-100" />
            </div>
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Admin Signature</p>
              <div className="mt-3 h-24 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleDownload} isLoading={downloadState === 'loading'} className="sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} className="sm:w-auto bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>
    </div>
  );
}
