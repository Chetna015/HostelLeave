const profile = {
  name: 'Aarav Sharma',
  rollNumber: '23CS101',
  course: 'B.Tech CSE',
  roomNumber: 'B-204',
  parentName: 'Mr. Sharma',
  parentContact: '+91 98765 43210',
};

export const ProfileCard = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Student Profile</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{profile.name}</h2>
        </div>
        <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
          {profile.rollNumber}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          ['Course', profile.course],
          ['Room Number', profile.roomNumber],
          ['Parent', profile.parentName],
          ['Parent Contact', profile.parentContact],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
