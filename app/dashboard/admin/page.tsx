'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, CheckCircle2, Clock3, FileWarning, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AdminDashboardLayout } from '@/components/dashboard/admin/AdminDashboardLayout';
import { LeaveRequestTable } from '@/components/dashboard/admin/LeaveRequestTable';
import { Card } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, students: 0 });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const loadSummary = async () => {
      try {
        const response = await axios.get('/api/admin/summary', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setSummary(response.data.summary);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Failed to load dashboard summary'
          : 'Failed to load dashboard summary';
        toast.error(message);
      }
    };

    loadSummary();

    const interval = window.setInterval(loadSummary, 15000);

    return () => window.clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Requests', value: String(summary.total), icon: BarChart3 },
    { label: 'Approved', value: String(summary.approved), icon: CheckCircle2 },
    { label: 'Pending', value: String(summary.pending), icon: Clock3 },
    { label: 'Rejected', value: String(summary.rejected), icon: FileWarning },
    { label: 'Students', value: String(summary.students), icon: LayoutDashboard },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Administration</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Warden Dashboard</h1>
              <p className="mt-2 text-sm text-slate-500">Monitor leave applications, student records, and approval trends.</p>
            </div>

            <button
              onClick={() => router.push('/dashboard/admin/requests')}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View pending requests
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.label}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <Icon className="h-5 w-5 text-slate-400" />
                </div>
              </Card>
            );
          })}
        </div>

        <LeaveRequestTable />
      </div>
    </AdminDashboardLayout>
  );
}
