'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
}

export const WebcamCapture = ({ onCapture }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setCameraError('Camera access is required to continue this verification.');
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/png'));
  };

  const handleFallbackUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onCapture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Parent selfie</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">Capture live camera verification</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cameraReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {cameraReady ? 'Camera ready' : 'Starting camera'}
        </span>
      </div>

      <p className="text-sm text-slate-600">Look at the camera, blink or turn your head, then capture the selfie to complete the liveness check.</p>

      {cameraError ? (
        <div className="space-y-3 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
          <div>{cameraError}</div>
          <div className="text-slate-700">
            Upload a selfie image to continue when camera access is unavailable.
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFallbackUpload}
            className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-2xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white"
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-slate-950">
          <video ref={videoRef} className="h-72 w-full object-cover" playsInline muted />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={capture}
          className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={Boolean(cameraError)}
        >
          Capture Selfie
        </button>
      </div>
    </div>
  );
};