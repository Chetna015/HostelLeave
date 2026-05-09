'use client';

import { AdminDashboardLayout } from '@/components/dashboard/admin/AdminDashboardLayout';
import { LeaveRequestTable } from '../../../../components/dashboard/admin/LeaveRequestTable';

export default function WardenApprovedPage() {
  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Warden view</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Approved by Warden</h1>
          <p className="mt-2 text-sm text-slate-500">Finalized leave requests are listed here.</p>
        </div>
        <LeaveRequestTable />
      </div>
    </AdminDashboardLayout>
  );
}
