'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/admin/login', data);
      const { accessToken, admin } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('hostelLeaveStudentProfile', JSON.stringify({
        name: admin.fullName,
        rollNumber: admin.employeeId,
        course: admin.hostelName,
        roomNumber: admin.employeeId,
      }));
      toast.success('Warden login successful');
      router.push('/dashboard/admin');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Admin login failed'
        : 'Admin login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            Warden access
          </div>
          <h1 className="mt-6 text-4xl font-bold">Admin Login</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Sign in to review leave applications, approve requests, and generate digital passes.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Warden Sign In</h2>
          <p className="mt-2 text-sm text-slate-500">Use the credentials created during warden registration.</p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <InputField label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 text-slate-500">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button type="submit" isLoading={isLoading}>{isLoading ? 'Signing In...' : 'Sign in to Dashboard'}</Button>

            <p className="text-center text-sm text-slate-500">
              Need an account?{' '}
              <Link href="/admin/register" className="font-medium text-sky-600 hover:text-sky-700">Register warden</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
