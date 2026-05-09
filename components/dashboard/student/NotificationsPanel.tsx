const notifications = [
  { title: 'Leave approved', message: 'Your request LV-1042 has been approved by admin.', time: '2h ago' },
  { title: 'Parent verification pending', message: 'Ask your parent to complete OTP verification.', time: '5h ago' },
  { title: 'Pass generated', message: 'A digital pass is ready for your last approval.', time: 'Yesterday' },
];

export const NotificationsPanel = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Updates</p>
      <h2 className="mt-2 text-xl font-bold text-slate-900">Notifications</h2>

      <div className="mt-6 space-y-4">
        {notifications.map((notification) => (
          <div key={notification.title} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
              </div>
              <span className="text-xs text-slate-400">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
