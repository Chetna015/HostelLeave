'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function ParentPortalPage() {
  const router = useRouter();
  const [leaveRequestId, setLeaveRequestId] = useState('');
  const [token, setToken] = useState('');

  const openApprovalLink = () => {
    const trimmedLeaveRequestId = leaveRequestId.trim();
    const trimmedToken = token.trim();

    if (!trimmedLeaveRequestId || !trimmedToken) {
      return;
    }

    router.push(`/approve/leave/${trimmedLeaveRequestId}?token=${encodeURIComponent(trimmedToken)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.28),_transparent_32%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]" />

      <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <ShieldCheck className="h-4 w-4" />
              Parent verification portal
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                Open the parent approval page from one place.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Use the verification link from the notification, or paste the request ID and OTP token here to continue the leave approval flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['OTP verification', 'Validate the request using the code sent to the parent contact.'],
                ['Selfie capture', 'Complete the liveness check before signing the request.'],
                ['Digital signature', 'Submit the parent signature to finish verification.'],
                ['Secure routing', 'All requests open the approval flow with token protection.'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Student login
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20"
              >
                Admin login
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Parent entry point</p>
                <h2 className="text-2xl font-bold text-white">Open approval link</h2>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Leave request ID</label>
                <input
                  value={leaveRequestId}
                  onChange={(event) => setLeaveRequestId(event.target.value)}
                  placeholder="cmovrfjw7000fyvnroo4yn0pm"
                  className="block w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Verification token</label>
                <input
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="Paste the token from the approval link URL"
                  className="block w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                />
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Use the token that appears in the approval link URL query string, not the 6-digit OTP code.
                </p>
              </div>

              <button
                type="button"
                onClick={openApprovalLink}
                disabled={!leaveRequestId.trim() || !token.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Open parent approval
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm leading-6 text-sky-100">
                If you already received the notification link, you can open it directly. This page is a frontend shortcut for parents who need a visible entry point.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}