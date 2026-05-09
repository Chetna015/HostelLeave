'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Eye, EyeOff, FileUp, Loader2, ShieldCheck } from 'lucide-react';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  fatherName: z.string().min(2, 'Father name is required'),
  course: z.string().min(1, 'Course is required'),
  branch: z.string().min(1, 'Branch is required'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  hostelRoomNumber: z.string().min(1, 'Hostel room number is required'),
  studentMobileNumber: z.string().min(10, 'Student mobile is required'),
  parentMobileNumber: z.string().min(10, 'Parent mobile is required'),
  parentEmail: z.string().email('Parent email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const previewLabel = useMemo(() => {
    if (!selectedFile) {
      return 'No file selected yet';
    }

    return `${selectedFile.name} · ${(selectedFile.size / 1024).toFixed(1)} KB`;
  }, [selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(typeof reader.result === 'string' ? reader.result : null);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      await axios.post('/api/auth/register', data);
      localStorage.setItem(
        'hostelLeaveStudentProfile',
        JSON.stringify({
          name: data.fullName,
          rollNumber: data.rollNumber,
          course: data.course,
          branch: data.branch,
          roomNumber: data.hostelRoomNumber,
          parentName: data.fatherName,
          parentContact: data.parentMobileNumber,
          studentMobileNumber: data.studentMobileNumber,
          parentEmail: data.parentEmail,
        })
      );
      toast.success('Registration successful. Please log in.');
      router.push('/login');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? 'Registration failed'
        : 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-200/40 lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              Secure student onboarding
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">Create your hostel leave account</h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Register once and keep your leave workflow connected across student, parent, and admin views.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ['Validated form', 'Prevent invalid submissions before they reach the server.'],
              ['Responsive layout', 'Designed to work on laptops, tablets, and mobile phones.'],
              ['File preview', 'See your ID card selection immediately before submitting.'],
              ['Instant redirect', 'Login is only one click away after a successful signup.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-100">
            ID card upload is previewed on the frontend. The current backend accepts JSON registration payloads.
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Student Registration</h2>
            <p className="mt-2 text-sm text-slate-500">Fill in the details below to create your account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-2">
              <InputField label="Full Name" placeholder="Enter full name" {...register('fullName')} error={errors.fullName?.message} />
              <InputField label="Father Name" placeholder="Enter father name" {...register('fatherName')} error={errors.fatherName?.message} />
              <InputField label="Course" placeholder="B.Tech / B.Sc / MBA" {...register('course')} error={errors.course?.message} />
              <InputField label="Branch" placeholder="Computer Science" {...register('branch')} error={errors.branch?.message} />
              <InputField label="Roll Number" placeholder="Roll number" {...register('rollNumber')} error={errors.rollNumber?.message} />
              <InputField label="Hostel Room Number" placeholder="Room number" {...register('hostelRoomNumber')} error={errors.hostelRoomNumber?.message} />
              <InputField label="Student Mobile" placeholder="10 digit number" {...register('studentMobileNumber')} error={errors.studentMobileNumber?.message} />
              <InputField label="Parent Mobile" placeholder="10 digit number" {...register('parentMobileNumber')} error={errors.parentMobileNumber?.message} />
            </div>

            <InputField label="Parent Email" type="email" placeholder="parent@example.com" {...register('parentEmail')} error={errors.parentEmail?.message} />

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
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

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileUp className="h-4 w-4" />
                Upload ID Card
              </div>
              <FileUpload onFileSelect={handleFileSelect} />
              <p className="mt-3 text-xs text-slate-500">{previewLabel}</p>
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Selected ID card preview"
                  className="mt-4 h-40 w-full rounded-2xl object-cover"
                />
              )}
            </div>

            <Button type="submit" isLoading={isLoading}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-sky-600 hover:text-sky-700">
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}