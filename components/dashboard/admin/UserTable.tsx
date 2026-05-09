'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

export type StudentRow = {
  id: string;
  fullName: string;
  rollNumber: string;
  hostelRoomNumber: string;
  course: string;
  branch: string;
  adminVerified: boolean;
};

export const UserTable = () => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get<{ students: StudentRow[] }>('/api/admin/students', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setStudents(response.data.students);
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Failed to load students'
          : 'Failed to load students';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  return (
    <Card>
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Warden records</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Students</h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Roll</th>
              <th className="px-4 py-3 text-left font-medium">Room</th>
              <th className="px-4 py-3 text-left font-medium">Course</th>
              <th className="px-4 py-3 text-left font-medium">Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading students...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No students found.</td></tr>
            ) : students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{student.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{student.rollNumber}</td>
                <td className="px-4 py-3 text-slate-600">{student.hostelRoomNumber}</td>
                <td className="px-4 py-3 text-slate-600">{student.course} · {student.branch}</td>
                <td className="px-4 py-3"><StatusBadge status={student.adminVerified ? 'APPROVED' : 'PENDING'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
