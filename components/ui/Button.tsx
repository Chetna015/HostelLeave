'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = ({ children, isLoading = false, className = '', disabled, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400 ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
