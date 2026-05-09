'use client';

import { Upload } from 'lucide-react';
import React, { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <span>Upload a file</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">{fileName || 'PNG, JPG, GIF up to 10MB'}</p>
      </div>
    </div>
  );
};
