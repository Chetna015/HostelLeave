'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Filter, Eye, Download, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from '@/components/ui/Card';

export type LeaveRequestRow = {
  id: string;
  studentName: string;
  rollNumber: string;
  course: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  parentStatus: string;
  wardenStatus: string;
  currentStatus: string;
  parentOtpVerifiedAt?: string | null;
  parentVerifiedAt?: string | null;
  parentSelfieUrl?: string | null;
  parentSignatureUrl?: string | null;
};

type ApiResponse = {
  requests: LeaveRequestRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type LeaveRequestTableProps = {
  compact?: boolean;
};

const PAGE_SIZE = 8;
const parentStatusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;
const leaveStatusOptions = ['ALL', 'DRAFT', 'PENDING_PARENT', 'PARENT_APPROVED', 'APPROVED', 'REJECTED'] as const;

type ParentStatus = (typeof parentStatusOptions)[number];
type LeaveStatus = (typeof leaveStatusOptions)[number];

export const LeaveRequestTable = ({ compact = false }: LeaveRequestTableProps) => {
  const [items, setItems] = useState<LeaveRequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [parentStatus, setParentStatus] = useState<ParentStatus>('ALL');
  const [leaveStatus, setLeaveStatus] = useState<LeaveStatus>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selected, setSelected] = useState<LeaveRequestRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(PAGE_SIZE));
    if (search.trim()) params.set('search', search.trim());
    if (parentStatus !== 'ALL') params.set('parentStatus', parentStatus);
    if (leaveStatus !== 'ALL') params.set('status', leaveStatus);
    if (fromDate) params.set('fromDate', fromDate);
    if (toDate) params.set('toDate', toDate);
    return params.toString();
  }, [page, search, parentStatus, leaveStatus, fromDate, toDate]);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<ApiResponse>(`/api/admin/leave-requests?${queryString}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setItems(response.data.requests);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Failed to load leave requests'
          : 'Failed to load leave requests';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();

    const interval = window.setInterval(loadRequests, 15000);

    return () => window.clearInterval(interval);
  }, [queryString]);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setActionLoading(id + action);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `/api/admin/leave-requests/${id}`,
        { action },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      toast.success(action === 'APPROVE' ? 'Leave approved' : 'Leave rejected');
      setPage(1);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Unable to update leave request'
        : 'Unable to update leave request';
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      {!compact && (
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Filter className="h-5 w-5 text-slate-500" />
              Filters
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="relative xl:col-span-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Search by student name or roll number"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <select value={parentStatus} onChange={(event) => { setParentStatus(event.target.value as ParentStatus); setPage(1); }} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none">
                {parentStatusOptions.map((option) => <option key={option} value={option}>{option === 'ALL' ? 'All Parent Status' : option}</option>)}
              </select>

              <select value={leaveStatus} onChange={(event) => { setLeaveStatus(event.target.value as LeaveStatus); setPage(1); }} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none">
                {leaveStatusOptions.map((option) => <option key={option} value={option}>{option === 'ALL' ? 'All Leave Status' : option.replace(/_/g, ' ')}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3 xl:col-span-5">
                <input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPage(1); }} className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" />
                <input type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPage(1); }} className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none" />
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Warden operations</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">All Leave Requests</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {items.length} of {PAGE_SIZE}
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Application ID</th>
                <th className="px-4 py-3 text-left font-medium">Student Name</th>
                <th className="px-4 py-3 text-left font-medium">Roll Number</th>
                <th className="px-4 py-3 text-left font-medium">Course</th>
                <th className="px-4 py-3 text-left font-medium">Leave Type</th>
                <th className="px-4 py-3 text-left font-medium">From Date</th>
                <th className="px-4 py-3 text-left font-medium">To Date</th>
                <th className="px-4 py-3 text-left font-medium">Parent Status</th>
                <th className="px-4 py-3 text-left font-medium">Warden Status</th>
                <th className="px-4 py-3 text-left font-medium">Current Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={11}>Loading leave requests...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={11}>No leave requests found.</td>
                </tr>
              ) : items.map((item) => {
                const canWardenAct = item.parentStatus === 'APPROVED';
                return (
                  <tr key={item.id} className={selected?.id === item.id ? 'bg-sky-50/40' : ''}>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.id}</td>
                    <td className="px-4 py-3 text-slate-600">{item.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.rollNumber}</td>
                    <td className="px-4 py-3 text-slate-600">{item.course}</td>
                    <td className="px-4 py-3 text-slate-600">{item.leaveType}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(item.fromDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(item.toDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <StatusBadge status={item.parentStatus} />
                        <div className="text-xs text-slate-500">OTP: {item.parentOtpVerifiedAt ? 'Verified' : 'Pending'}</div>
                        <div className="text-xs text-slate-500">Selfie: {item.parentSelfieUrl ? 'Captured' : 'Pending'}</div>
                        <div className="text-xs text-slate-500">Signature: {item.parentSignatureUrl ? 'Captured' : 'Pending'}</div>
                        <div className="text-xs text-slate-500">At: {item.parentVerifiedAt ? new Date(item.parentVerifiedAt).toLocaleString() : 'Pending'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={item.wardenStatus} /></td>
                    <td className="px-4 py-3"><StatusBadge status={item.currentStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setSelected(item)} className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                        <button
                          disabled={!canWardenAct || actionLoading === item.id + 'APPROVE'}
                          onClick={() => handleAction(item.id, 'APPROVE')}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                          title={canWardenAct ? 'Approve leave' : 'Waiting for Parent'}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          disabled={actionLoading === item.id + 'REJECT'}
                          onClick={() => handleAction(item.id, 'REJECT')}
                          className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                        <button className="inline-flex items-center gap-1 rounded-xl bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-200">
                          <Download className="h-3.5 w-3.5" /> Download Pass
                        </button>
                      </div>
                      {!canWardenAct && <p className="mt-2 text-xs text-amber-600">Waiting for Parent</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-600">
          <p>Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {selected && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Request details</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{selected.studentName}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">Close</button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Application ID', selected.id],
              ['Roll Number', selected.rollNumber],
              ['Course', selected.course],
              ['Leave Type', selected.leaveType],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
