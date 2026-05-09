import Link from 'next/link';
import { BarChart3, LayoutDashboard, ListChecks, Users, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/admin/requests', label: 'All Leave Requests', icon: ListChecks },
  { href: '/dashboard/admin/pending-parent', label: 'Pending Parent Approval', icon: ListChecks },
  { href: '/dashboard/admin/parent-approved', label: 'Parent Approved', icon: ListChecks },
  { href: '/dashboard/admin/warden-approved', label: 'Approved by Warden', icon: ListChecks },
  { href: '/dashboard/admin/rejected', label: 'Rejected', icon: ListChecks },
  { href: '/dashboard/admin/users', label: 'Students', icon: Users },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-slate-900 text-white lg:min-h-screen lg:w-72 lg:border-b-0">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin Portal</p>
          <h2 className="mt-2 text-2xl font-bold">Warden Dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">Approval and monitoring workspace</p>
        </div>

        <nav className="px-4 py-4">
          <div className="grid gap-2 lg:block">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 px-4 pb-4">
            <Link href="/admin/login" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-white/10 hover:text-white">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};
