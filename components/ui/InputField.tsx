'use client';

import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          ref={ref}
          {...props}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
