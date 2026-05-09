'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellRing, Download, FilePlus2, History, LogOut, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/ui/Sidebar';
import { Navbar } from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NotificationCard } from '@/components/ui/NotificationCard';

type StudentProfile = {
  name: string;
  rollNumber: string;
  course: string;
  roomNumber: string;
};

type DashboardStats = {
  totalApplications: number;
  pendingApprovals: number;
  approvedLeaves: number;
  rejectedLeaves: number;
};

type LeaveHistoryItem = {
  id: string;
  type: string;
  date: string;
  status: string;
};

type NotificationItem = {
  title: string;
  message: string;
  time: string;
};

type DashboardResponse = {
  student: StudentProfile;
  stats: DashboardStats;
  history: LeaveHistoryItem[];
  notifications: NotificationItem[];
};

const defaultStudent: StudentProfile = {
  name: 'Student',
  rollNumber: '---',
  course: '---',
  roomNumber: '---',
};

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile>(defaultStudent);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApprovals: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });
  const [history, setHistory] = useState<LeaveHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken') ?? sessionStorage.getItem('accessToken');

    if (!token) {
      router.push('/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await axios.get<DashboardResponse>('/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(response.data.student);
        setStats(response.data.stats);
        setHistory(response.data.history);
        setNotifications(response.data.notifications);
      } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        if (status === 401 || status === 403) {
          toast.error('Please sign in again to continue');
          router.push('/login');
          return;
        }

        const message = axios.isAxiosError(error)
          ? error.response?.data?.message ?? 'Failed to load dashboard data'
          : 'Failed to load dashboard data';
        toast.error(message);
      }
    };

    loadDashboard();
  }, [router]);

  const dashboardStats = [
    { label: 'Total Applications', value: String(stats.totalApplications) },
    { label: 'Pending Approvals', value: String(stats.pendingApprovals) },
    { label: 'Approved Leaves', value: String(stats.approvedLeaves) },
    { label: 'Rejected Leaves', value: String(stats.rejectedLeaves) },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar role="STUDENT" />

      <div className="flex-1">
        <Navbar studentId={student.rollNumber} />

        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-bold">Welcome, {student.name}</h1>
                <p className="mt-2 text-sm text-slate-300">{student.course} · Room {student.roomNumber} · Roll {student.rollNumber}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push('/dashboard/student/apply-leave')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Apply Leave
                </button>
                <button
                  onClick={() => {
                    const approvedLeave = history.find((item) => item.status === 'APPROVED');
                    if (approvedLeave) {
                      router.push(`/leave-pass/${approvedLeave.id}`);
                    } else {
                      toast.error('No approved leave found. Please ensure your leave has been approved first.');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                  Download Pass
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <Card key={stat.label}>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">Student information</h2>
                  </div>
                  <StatusBadge status="APPROVED" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ['Name', student.name],
                    ['Roll Number', student.rollNumber],
                    ['Course', student.course],
                    ['Room Number', student.roomNumber],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">History</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">Leave history</h2>
                  </div>
                  <History className="h-5 w-5 text-slate-400" />
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Request</th>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 font-medium text-slate-900">{item.id}</td>
                          <td className="px-4 py-3 text-slate-600">{item.type}</td>
                          <td className="px-4 py-3 text-slate-600">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-4 py-3">
                            {item.status === 'APPROVED' ? (
                              <button
                                onClick={() => router.push(`/leave-pass/${item.id}`)}
                                className="inline-flex items-center gap-1 rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-200"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">Approval pipeline</h2>
                  </div>
                  <LayoutDashboard className="h-5 w-5 text-slate-400" />
                </div>

                <div className="mt-6 space-y-4">
                  {['Submitted', 'Parent verification', 'Admin decision', 'Digital pass'].map((step, index) => (
                    <div key={step} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-sky-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{step}</p>
                        <p className="mt-1 text-xs text-slate-500">Stage {index + 1} in the leave workflow</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Alerts</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">Notifications</h2>
                  </div>
                  <BellRing className="h-5 w-5 text-slate-400" />
                </div>

                <div className="mt-6 space-y-4">
                  {notifications.map((notification) => (
                    <NotificationCard key={notification.title} {...notification} />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
