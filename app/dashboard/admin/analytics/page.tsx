'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AdminDashboardLayout } from '@/components/dashboard/admin/AdminDashboardLayout';
import { Card } from '@/components/ui/Card';

export default function AnalyticsPage() {
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
          ? error.response?.data?.message ?? 'Failed to load analytics'
          : 'Failed to load analytics';
        toast.error(message);
      }
    };

    loadSummary();
  }, []);

  const approvalRate = summary.total ? Math.round((summary.approved / summary.total) * 100) : 0;
  const metrics = [
    { label: 'Approval rate', value: `${approvalRate}%`, description: 'Approved requests / total requests' },
    { label: 'Pending requests', value: String(summary.pending), description: 'Requests still awaiting action' },
    { label: 'Active students', value: String(summary.students), description: 'Students with stored profiles' },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Insights</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Analytics</h1>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{metric.value}</p>
              <p className="mt-2 text-sm text-slate-500">{metric.description}</p>
            </Card>
          ))}
        </div>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trends</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Leave activity overview</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['Total', summary.total],
              ['Approved', summary.approved],
              ['Pending', summary.pending],
              ['Rejected', summary.rejected],
            ].map(([day, value], index) => (
              <div key={day} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">{day}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
                <div className="mt-4 rounded-2xl bg-gradient-to-t from-sky-500/25 to-sky-500/80" style={{ height: `${40 + index * 18}px` }} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Users2 className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Population</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Department distribution</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Total Requests', summary.total],
              ['Approved', summary.approved],
              ['Pending', summary.pending],
              ['Rejected', summary.rejected],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
                {label}: {value}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
