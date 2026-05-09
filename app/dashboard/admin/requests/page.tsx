'use client';

import { AdminDashboardLayout } from '@/components/dashboard/admin/AdminDashboardLayout';
import { LeaveRequestTable } from '@/components/dashboard/admin/LeaveRequestTable';

export default function LeaveRequestsPage() {
  return (
    <AdminDashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Leave Requests</h1>
      <LeaveRequestTable />
    </AdminDashboardLayout>
  );
}
