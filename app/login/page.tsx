'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface DecodedToken {
  role: 'STUDENT' | 'ADMIN';
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);
      const { accessToken } = response.data;
      if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
      }

      const decodedToken = jwtDecode<DecodedToken>(accessToken);

      toast.success('Login successful!');

      if (decodedToken.role === 'STUDENT') {
        router.push('/dashboard/student');
      } else if (decodedToken.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/student');
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Login failed. Please check your credentials.'
        : 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200/40 lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              Secure campus authentication
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">Welcome back</h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Sign in to access student leave tracking, admin approvals, and the digital pass portal.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ['Role-based routing', 'Students and admins are redirected to the correct dashboard.'],
              ['Session control', 'Choose whether to keep the session across browser restarts.'],
              ['Responsive UI', 'The form scales cleanly from mobile to desktop.'],
              ['Secure tokens', 'JWT tokens are stored locally only after successful sign in.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your registered email and password.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <InputField label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 hover:text-slate-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Remember me
              </label>
              <Link href="#" className="font-medium text-sky-600 hover:text-sky-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" isLoading={isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </Button>

            <p className="text-center text-sm text-slate-500">
              New here?{' '}
              <Link href="/register" className="font-medium text-sky-600 hover:text-sky-700">
                Create an account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
