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
  const [retryCount, setRetryCount] = useState(0);
  const [checking, setChecking] = useState(true);

  const startCamera = async () => {
    setChecking(true);
    try {
      setCameraError(null);

      if (!('mediaDevices' in navigator) || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera API not supported in this browser.');
        setChecking(false);
        return;
      }

      if (!window.isSecureContext) {
        setCameraError('Insecure context: camera requires HTTPS or localhost.');
        setChecking(false);
        return;
      }

      // quick device check
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((d) => d.kind === 'videoinput');
      if (!hasCamera) {
        setCameraError('No camera found. Please check that your device has a camera connected.');
        setChecking(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
        setRetryCount(0);
      }
    } catch (error: any) {
      const errorName = error?.name || 'Unknown';
      const errorMsg = error?.message || '';

      if (errorName === 'NotAllowedError' || errorMsg.toLowerCase().includes('permission')) {
        setCameraError('Camera permission denied. Please enable camera access in your browser settings and try again.');
      } else if (errorName === 'NotFoundError' || errorMsg.toLowerCase().includes('not found') || errorMsg.toLowerCase().includes('requested device not found')) {
        setCameraError('No camera found. Please check that your device has a camera connected.');
      } else {
        setCameraError('Unable to access camera. Please check permissions and try again.');
      }
      setCameraReady(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      await startCamera();
    };

    if (!cancelled) {
      init();
    }

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [retryCount]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setCameraReady(false);
      } else if (!cameraReady && !cameraError) {
        // attempt to restart when tab becomes visible
        setRetryCount((c) => c + 1);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [cameraReady, cameraError]);

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
            You can upload a selfie image instead to continue verification.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                streamRef.current?.getTracks().forEach((t) => t.stop());
                setCameraError(null);
                setCameraReady(false);
                setRetryCount((c) => c + 1);
              }}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
            >
              Retry Camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border border-slate-900 px-4 py-2 text-slate-900 transition hover:bg-slate-50"
            >
              Choose File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFallbackUpload}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-slate-950">
          <video ref={videoRef} className="h-72 w-full object-cover" playsInline muted />
          {!cameraReady && checking && (
            <div className="absolute inset-0 flex items-center justify-center text-white">Starting camera…</div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={capture}
          className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!cameraReady}
        >
          Capture Selfie
        </button>
      </div>
    </div>
  );
};