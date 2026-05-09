'use client';

import { AdminDashboardLayout } from '@/components/dashboard/admin/AdminDashboardLayout';
import { UserTable } from '@/components/dashboard/admin/UserTable';

export default function UsersPage() {
  return (
    <AdminDashboardLayout>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserTable />
    </AdminDashboardLayout>
  );
}
