'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, BarChart2, Settings } from 'lucide-react';

const studentLinks = [
  { href: '/dashboard/student', label: 'Dashboard', icon: Home },
  { href: '/dashboard/student/apply-leave', label: 'Apply Leave', icon: FileText },
];

const adminLinks = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: Home },
  { href: '/dashboard/admin/requests', label: 'Approvals', icon: FileText },
  { href: '/dashboard/admin/users', label: 'Students', icon: Users },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart2 },
];

export const Sidebar = ({ role }: { role: 'STUDENT' | 'ADMIN' }) => {
  const pathname = usePathname();
  const links = role === 'STUDENT' ? studentLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600">HostelLeave</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center p-2 rounded-lg transition-colors ${
              pathname === href
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
