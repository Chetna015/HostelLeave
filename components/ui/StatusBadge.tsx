import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalizedStatus = status.toUpperCase();
  const statusStyles: Record<string, string> = {
    PENDING_PARENT: 'bg-amber-100 text-amber-800',
    WAITING_FOR_PARENT: 'bg-amber-100 text-amber-800',
    PENDING: 'bg-amber-100 text-amber-800',
    PARENT_APPROVED: 'bg-sky-100 text-sky-800',
    PENDING_ADMIN: 'bg-sky-100 text-sky-800',
    APPROVED_BY_WARDEN: 'bg-indigo-100 text-indigo-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-rose-100 text-rose-800',
    DRAFT: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${statusStyles[normalizedStatus] ?? 'bg-slate-100 text-slate-700'}`}
    >
      {normalizedStatus.replace(/_/g, ' ')}
    </span>
  );
};
