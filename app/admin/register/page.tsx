'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, FileUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';

const adminRegistrationSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email is required'),
    mobileNumber: z.string().min(10, 'Mobile number is required'),
    employeeId: z.string().min(2, 'Employee ID is required'),
    hostelName: z.string().min(2, 'Hostel name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AdminRegistrationFormData = z.infer<typeof adminRegistrationSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegistrationFormData>({
    resolver: zodResolver(adminRegistrationSchema),
  });

  const onSignatureSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      setSignaturePreview(result);
      setSignatureBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: AdminRegistrationFormData) => {
    if (!signatureBase64) {
      toast.error('Please upload your signature image');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/api/admin/register', {
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        employeeId: data.employeeId,
        hostelName: data.hostelName,
        password: data.password,
        signatureImage: signatureBase64,
      });
      toast.success('Warden account created successfully');
      router.push('/admin/login');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Admin registration failed'
        : 'Admin registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-sky-300" />
            Warden onboarding
          </div>
          <h1 className="mt-6 text-4xl font-bold">Create a warden account</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Register the hostel warden or admin profile to manage leave approvals, signatures, and pass generation.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ['Secure login', 'Password hashed with existing auth flow'],
              ['Signature upload', 'Admin signature attached to approvals'],
              ['Employee validation', 'Unique employee ID stored on profile'],
              ['Hostel context', 'Tie the account to a specific hostel'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-xs text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Warden Registration</h2>
            <p className="mt-2 text-sm text-slate-500">Create the admin account used by hostel staff.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <InputField label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
            <InputField label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <InputField label="Mobile Number" {...register('mobileNumber')} error={errors.mobileNumber?.message} />
            <InputField label="Employee ID" {...register('employeeId')} error={errors.employeeId?.message} />
            <InputField label="Hostel Name" {...register('hostelName')} error={errors.hostelName?.message} />

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

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute inset-y-0 right-3 text-slate-500">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileUp className="h-4 w-4" />
                Upload Signature Image
              </div>
              <input type="file" accept="image/*" onChange={onSignatureSelect} className="block w-full text-sm" />
              {signaturePreview && <img src={signaturePreview} alt="Signature preview" className="mt-4 h-28 rounded-2xl border object-contain bg-white" />}
            </div>

            <Button type="submit" isLoading={isLoading}>{isLoading ? 'Creating Account...' : 'Create Warden Account'}</Button>

            <p className="text-center text-sm text-slate-500">
              Already have a warden account?{' '}
              <Link href="/admin/login" className="font-medium text-sky-600 hover:text-sky-700">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
