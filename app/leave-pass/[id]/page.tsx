'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeavePass } from '@/components/pdf/LeavePass';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PDFDownloadLinkAny = PDFDownloadLink as unknown as React.ComponentType<any>;

interface LeavePassData {
  leaveRequest: any;
}

export default function LeavePassPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeavePassData | null>(null);

  useEffect(() => {
    const fetchLeavePass = async () => {
      try {
        const response = await axios.get<LeavePassData>(`/api/leave-pass/${params.id}`);
        setData(response.data);
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Failed to load leave pass'
          : 'Failed to load leave pass';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeavePass();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <p className="text-sm text-slate-600">Loading leave pass...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Button
            type="button"
            className="inline-flex items-center gap-2 bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          <Card>
            <div className="flex items-center gap-3">
              <div className="text-rose-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Unable to load leave pass</p>
                <p className="text-sm text-slate-600">{error}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const leaveRequest = data.leaveRequest;
  const student = leaveRequest.student;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Leave Management</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Leave Pass</h1>
            <p className="mt-2 text-sm text-slate-600">Your leave has been approved. Download the pass to show at the security gate.</p>
          </div>
          <div className="flex gap-2">
            {data && (
              <PDFDownloadLinkAny
                document={<LeavePass leaveRequest={leaveRequest} />}
                fileName={`LeavePass_${student.rollNumber}_${leaveRequest.id}.pdf`}
              >
                {({ loading: pdfLoading }: any) => (
                  <Button
                    type="button"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={pdfLoading}
                  >
                    <Download className="h-4 w-4" />
                    {pdfLoading ? 'Preparing...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLinkAny>
            )}
          </div>
        </div>

        <Card>
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-200">
              <CheckCircle className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Leave Approved</p>
              <p className="text-sm text-emerald-700">Your leave has been successfully approved. All signatures are complete.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Student Information */}
            <div>
              <h3 className="font-semibold text-slate-900">Student Information</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                  <p className="mt-1 font-medium text-slate-900">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Roll Number</p>
                  <p className="mt-1 font-medium text-slate-900">{student.rollNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Course</p>
                  <p className="mt-1 font-medium text-slate-900">{student.course}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Room Number</p>
                  <p className="mt-1 font-medium text-slate-900">{student.hostelRoomNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Father Name</p>
                  <p className="mt-1 font-medium text-slate-900">{student.fatherName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Emergency Contact</p>
                  <p className="mt-1 font-medium text-slate-900">{leaveRequest.emergencyContact}</p>
                </div>
              </div>
            </div>

            {/* Leave Details */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900">Leave Details</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Leave Type</p>
                  <p className="mt-1 font-medium text-slate-900">{leaveRequest.leaveType}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Reason</p>
                  <p className="mt-1 font-medium text-slate-900">{leaveRequest.reason}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Destination</p>
                  <p className="mt-1 font-medium text-slate-900">{leaveRequest.destinationAddress}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Departure Date</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {new Date(leaveRequest.departureDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Return Date</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {new Date(leaveRequest.returnDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Transport Mode</p>
                  <p className="mt-1 font-medium text-slate-900">{leaveRequest.transportMode}</p>
                </div>
              </div>
            </div>

            {/* Verification Images */}
            {(leaveRequest.parentSelfieUrl || leaveRequest.parentSignatureUrl) && (
              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-slate-900">Verification Media</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {leaveRequest.parentSelfieUrl && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Parent Selfie</p>
                      <img
                        src={leaveRequest.parentSelfieUrl}
                        alt="Parent selfie"
                        className="h-64 w-full rounded-lg object-cover border border-slate-200"
                      />
                    </div>
                  )}
                  {leaveRequest.parentSignatureUrl && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Parent Signature</p>
                      <img
                        src={leaveRequest.parentSignatureUrl}
                        alt="Parent signature"
                        className="h-64 w-full rounded-lg object-cover border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Approval Status */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900">Approval Status</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">
                  <div>
                    <p className="font-medium text-emerald-900">Parent Approval</p>
                    <p className="text-xs text-emerald-700">
                      {new Date(leaveRequest.parentVerifiedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className="inline-block rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                    APPROVED
                  </span>
                </div>
                {leaveRequest.approvals?.some((a: any) => a.status === 'APPROVED' && (a.approver.role === 'WARDEN' || a.approver.role === 'ADMIN')) && (
                  <div className="rounded-lg bg-emerald-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-emerald-900">Warden/Admin Approval</p>
                        <p className="text-xs text-emerald-700">
                          {leaveRequest.approvals
                            ?.find((a: any) => a.status === 'APPROVED' && (a.approver.role === 'WARDEN' || a.approver.role === 'ADMIN'))
                            ?.approver?.adminProfile?.fullName || 'Pending'}
                        </p>
                      </div>
                      <span className="inline-block rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                        APPROVED
                      </span>
                    </div>
                    {leaveRequest.approvals?.find((a: any) => a.status === 'APPROVED' && (a.approver.role === 'WARDEN' || a.approver.role === 'ADMIN'))?.signature?.signature && (
                      <div className="mt-4 border-t border-emerald-200 pt-4">
                        <p className="text-xs font-semibold uppercase text-emerald-900">Digital Signature</p>
                        <img
                          src={leaveRequest.approvals.find((a: any) => a.status === 'APPROVED' && (a.approver.role === 'WARDEN' || a.approver.role === 'ADMIN'))?.signature?.signature}
                          alt="Warden signature"
                          className="mt-3 h-20 object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Button
          type="button"
          className="w-full bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100"
          onClick={() => router.push('/dashboard/student')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
