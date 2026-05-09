'use client';

import { Bell, UserCircle } from 'lucide-react';

export const Navbar = ({ studentId }: { studentId?: string }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          {studentId && (
            <span className="text-sm font-medium text-gray-600">
              Student ID: {studentId}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 text-gray-500" />
          <UserCircle className="w-8 h-8 text-gray-500" />
        </div>
      </div>
    </header>
  );
};
