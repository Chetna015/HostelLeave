import { StatusBadge } from '@/components/ui/StatusBadge';

const leaves = [
  { id: 'LV-1042', type: 'Medical', date: '2026-04-27', status: 'APPROVED' as const },
  { id: 'LV-1081', type: 'Home Visit', date: '2026-04-29', status: 'PENDING_PARENT' as const },
  { id: 'LV-1095', type: 'Family Function', date: '2026-05-01', status: 'REJECTED' as const },
];

export const LeaveHistory = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Activity</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Leave History</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Latest 3</span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Request ID</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{leave.id}</td>
                <td className="px-4 py-3 text-slate-600">{leave.type}</td>
                <td className="px-4 py-3 text-slate-600">{leave.date}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={leave.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
