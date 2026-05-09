'use client';

import { AdminDashboardLayout } from '@/components/dashboard/admin/AdminDashboardLayout';
import { LeaveRequestTable } from '@/components/dashboard/admin/LeaveRequestTable';

export default function ParentApprovedPage() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Warden view</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Parent Approved</h1>
          <p className="mt-2 text-sm text-slate-500">Requests that can be finalized by the warden are shown here.</p>
        </div>
        <LeaveRequestTable />
      </div>
    </AdminDashboardLayout>
  );
}
