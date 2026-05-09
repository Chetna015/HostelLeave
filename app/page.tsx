'use client';

import Link from 'next/link';
import { ArrowRight, CalendarCheck2, ShieldCheck, Sparkles, Users, ShieldUser, LogIn } from 'lucide-react';

const features = [
  {
    title: 'Fast Approval',
    description: 'Digital leave routing reduces manual follow-up and keeps approvals moving.',
    icon: CalendarCheck2,
  },
  {
    title: 'Parent Verification',
    description: 'OTP and signature-based verification keeps approvals secure and accountable.',
    icon: ShieldCheck,
  },
  {
    title: 'Real-Time Tracking',
    description: 'Students, parents, and admins can monitor the status of each request.',
    icon: Users,
  },
  {
    title: 'Secure Digital Pass',
    description: 'Approved passes are ready to print, share, and verify on campus.',
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.32),_transparent_35%),linear-gradient(180deg,#0f172a_0%,#020617_100%)]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-wide">Hostel Leave Portal</p>
            <p className="text-xs text-slate-400">Digital hostel workflow for modern campuses</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/register" className="transition hover:text-white">Register</Link>
            <Link href="/login" className="transition hover:text-white">Student Login</Link>
            <Link href="/parent" className="transition hover:text-white">Parent Portal</Link>
            <Link href="/admin/login" className="transition hover:text-white">Admin Login</Link>
            <a href="#about" className="transition hover:text-white">About</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
              <Sparkles className="h-4 w-4" />
              University ERP style leave management
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Digital Hostel Leave Management System
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Apply leave online. Parent verification. Admin approval. One secure portal for the full hostel leave lifecycle.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                Student Registration
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Student Login
              </Link>
              <Link
                href="/parent"
                className="inline-flex items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 px-6 py-4 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/20"
              >
                Parent Portal
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-6 py-4 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/20"
              >
                <ShieldUser className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="rounded-2xl bg-slate-900/90 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Live status</p>
                    <p className="text-2xl font-semibold text-white">Campus Leave Flow</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    Operational
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Applications', '128'],
                    ['Pending', '12'],
                    ['Approved', '94'],
                    ['Rejected', '22'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm leading-6 text-sky-100">
                  Digitally verify requests, manage approvals, and generate passes without leaving the portal.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Features</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Built for a production campus workflow</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Clean navigation, secure identity flow, and a mobile-first layout make this portal suitable for students and admins.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/10"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Hostel Leave Management System</p>
          <p>Secure digital leave approvals for university campuses.</p>
        </div>
      </footer>
    </div>
  );
}
