'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarCheck2,
  ShieldCheck,
  Sparkles,
  Users,
  ShieldUser,
  LogIn,
  UserPlus,
  FileText,
  Link2,
  Download,
  House,
  Check,
} from 'lucide-react';

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

const workflowSteps = [
  { label: 'Register', icon: UserPlus },
  { label: 'Login', icon: LogIn },
  { label: 'Apply Leave', icon: FileText },
  { label: 'Approval Link Sent', icon: Link2 },
  { label: 'Parent Verification', icon: ShieldCheck },
  { label: 'Warden Approval', icon: ShieldUser },
  { label: 'Download Leave Pass', icon: Download },
  { label: 'Back Home', icon: House },
];

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const last = workflowSteps.length - 1;
    const delay = activeStep === last ? 2000 : 900;
    const t = window.setTimeout(() => setActiveStep((s) => (s === last ? 0 : s + 1)), delay);
    return () => clearTimeout(t);
  }, [activeStep]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white/90 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-1.5">
              <Image
                src="/csjmu-logo.png"
                alt="CSJMU logo"
                width={56}
                height={56}
                className="h-12 w-12 sm:h-14 sm:w-14"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-slate-900 sm:text-lg lg:text-xl">
                Chhatrapati Shahu Ji Maharaj University, Kanpur
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600 sm:text-xs">
                Uttar Pradesh State University
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <Link href="/register" className="transition hover:text-slate-900">Register</Link>
            <Link href="/login" className="transition hover:text-slate-900">Student Login</Link>
            <Link href="/parent" className="transition hover:text-slate-900">Parent Portal</Link>
            <Link href="/admin/login" className="transition hover:text-slate-900">Admin Login</Link>
            <a href="#about" className="transition hover:text-slate-900">About</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Digital Hostel Leave Management System
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                Apply leave online. Parent verification. Admin approval. One secure portal for the full hostel leave lifecycle.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-4 text-sm font-semibold text-white shadow transition hover:bg-sky-400"
              >
                Student Registration
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Student Login
              </Link>

              <Link
                href="/parent"
                className="inline-flex items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 px-6 py-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Parent Portal
              </Link>

              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-fuchsia-100 bg-fuchsia-50 px-6 py-4 text-sm font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100"
              >
                <ShieldUser className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Live status</p>
                    <p className="text-2xl font-semibold text-slate-900">Campus Leave Flow</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Operational</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Applications', '128'],
                    ['Pending', '12'],
                    ['Approved', '94'],
                    ['Rejected', '22'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm text-slate-600">{label}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-700">
                  Digitally verify requests, manage approvals, and generate passes without leaving the portal.
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12">
          <div className="rounded-3xl border border-red-600 bg-gradient-to-b from-white to-slate-50 p-6 text-slate-900 shadow-sm">
            <div className="w-full">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const completed = index < activeStep;
                  const isActive = index === activeStep;

                  return (
                    <div key={step.label}>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.18, ease: 'easeOut' }}
                      >
                        <motion.div
                          animate={
                            isActive
                              ? {
                                  scale: [1, 1.02, 1],
                                  boxShadow: ['0 0 0 rgba(99,102,241,0)', '0 0 18px rgba(99,102,241,0.12)', '0 0 0 rgba(99,102,241,0)'],
                                }
                              : { scale: 1 }
                          }
                          transition={isActive ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                          className={`relative flex min-h-32 flex-col items-center justify-center rounded-2xl border p-3 text-center transition-colors sm:min-h-36 lg:min-h-40 ${
                            completed ? 'border-rose-300/20 bg-rose-50' : isActive ? 'border-amber-400/40 bg-amber-50' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div
                            className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                              completed
                                ? 'border-rose-300/40 bg-rose-100 text-rose-600'
                                : isActive
                                ? 'border-amber-400/40 bg-amber-100 text-amber-700'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <p className="text-[11px] font-semibold leading-4 text-slate-800 sm:text-xs">{step.label}</p>

                          <div className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-700">
                            {completed ? <Check className="h-3 w-3 text-rose-500" /> : index + 1}
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Features</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Built for a production campus workflow</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Clean navigation, secure identity flow, and a mobile-first layout make this portal suitable for students and admins.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200/40 hover:bg-sky-50"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Hostel Leave Management System</p>
          <p>Secure digital leave approvals for university campuses.</p>
        </div>
      </footer>
    </div>
  );
}
