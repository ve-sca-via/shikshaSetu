import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera. Please check permissions.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageSrc);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden w-full h-[400px] transition-colors duration-300">
      {error ? (
        <div className="text-slate-900 dark:text-white p-6 text-center space-y-4 transition-colors duration-300">
          <p className="text-rose-600 dark:text-rose-400 font-medium transition-colors duration-300">{error}</p>
          <Button variant="outline" onClick={onCancel} className="text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300">Close Camera</Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
            <Button variant="destructive" size="icon" className="rounded-full h-14 w-14 shadow-lg" onClick={onCancel}>
              <X className="h-6 w-6" />
            </Button>
            <Button size="icon" className="rounded-full h-14 w-14 bg-white text-slate-900 hover:bg-slate-200 shadow-lg transition-colors duration-300" onClick={handleCapture}>
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
