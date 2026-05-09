'use client';

import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSubmit: (signature: string) => void;
  disabled?: boolean;
}

export const SignaturePad = ({ onSubmit, disabled = false }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current) {
      onSubmit(sigCanvas.current.toDataURL());
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Signature</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Draw parent signature</h2>
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl border border-slate-300 bg-slate-50">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ className: 'h-56 w-full' }}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={save}
          disabled={disabled}
          className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};
