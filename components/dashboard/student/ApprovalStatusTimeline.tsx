const timeline = [
  { title: 'Submitted', description: 'Application created by student', time: '10:15 AM' },
  { title: 'Parent Verified', description: 'OTP and signature complete', time: '11:40 AM' },
  { title: 'Admin Approved', description: 'Final pass generated', time: '12:10 PM' },
];

export const ApprovalStatusTimeline = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Process</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Approval Status</h2>
      </div>

      <div className="mt-6 space-y-5">
        {timeline.map((item, index) => (
          <div key={item.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-sky-500" />
              {index < timeline.length - 1 && <div className="h-full w-px bg-slate-200" />}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              <p className="mt-1 text-xs text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
