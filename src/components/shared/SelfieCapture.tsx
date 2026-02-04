"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  X,
  User,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui";

export interface SelfieCaptureProps {
  onCapture: (file: File) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  withIdCard?: boolean; // If true, show guide for holding ID card
}

type CaptureStep = 'select' | 'camera' | 'upload' | 'preview';

export function SelfieCapture({
  onCapture,
  error: externalError,
  disabled = false,
  className = "",
  withIdCard = true,
}: SelfieCaptureProps) {
  const [step, setStep] = useState<CaptureStep>('select');
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = useCallback(async () => {
    setError(null);
    setStep('camera');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch {
      setError("ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้งานกล้อง");
      setStep('select');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraReady(false);
  }, [cameraStream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontally for selfie mode
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedFile(file);
        setPreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
        setStep('preview');
      }
    }, 'image/jpeg', 0.9);
  }, [isCameraReady, stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("ไฟล์ใหญ่เกินไป (สูงสุด 10MB)");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setCapturedFile(file);
      setStep('preview');
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleConfirm = () => {
    if (capturedFile) {
      onCapture(capturedFile);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    setCapturedFile(null);
    setStep('select');
  };

  const handleCancel = () => {
    stopCamera();
    setPreview(null);
    setCapturedFile(null);
    setError(null);
    setStep('select');
  };

  const displayError = externalError || error;

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Step: Select Method */}
      {step === 'select' && (
        <div className="border-2 border-dashed border-brand-border rounded-xl p-8">
          <div className="flex flex-col items-center text-center">
            {/* Guide Icon */}
            <div className="relative w-24 h-24 mb-4">
              <div className="w-full h-full rounded-full border-4 border-brand-primary/30 flex items-center justify-center">
                <User className="w-12 h-12 text-brand-primary/50" />
              </div>
              {withIdCard && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand-primary/50" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
              {withIdCard ? "ถ่าย Selfie พร้อมบัตรประชาชน" : "ถ่าย Selfie"}
            </h3>
            
            <p className="text-sm text-brand-text-light mb-6 max-w-xs">
              {withIdCard 
                ? "ถือบัตรประชาชนข้างใบหน้าของคุณ แสดงให้เห็นทั้งใบหน้าและบัตรชัดเจน"
                : "ถ่ายภาพใบหน้าของคุณให้ชัดเจน"
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={startCamera}
                disabled={disabled}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                เปิดกล้อง
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                อัปโหลดรูป
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step: Camera View */}
      {step === 'camera' && (
        <div className="relative rounded-xl overflow-hidden bg-black">
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-[3/4] sm:aspect-video object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror for selfie
          />
          
          {/* Guide Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Face guide */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 sm:w-56 sm:h-72">
              <svg viewBox="0 0 200 280" className="w-full h-full">
                {/* Face oval */}
                <ellipse
                  cx="100"
                  cy="120"
                  rx="70"
                  ry="90"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray="10 5"
                  opacity="0.7"
                />
                {/* ID Card position indicator */}
                {withIdCard && (
                  <rect
                    x="20"
                    y="200"
                    width="80"
                    height="50"
                    rx="5"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    opacity="0.7"
                  />
                )}
              </svg>
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white px-4">
              <p className="text-sm bg-black/50 rounded-full px-4 py-2">
                {withIdCard 
                  ? "วางใบหน้าในวงรี และถือบัตรใต้ใบหน้า"
                  : "วางใบหน้าของคุณในวงรี"
                }
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-white bg-black/50 hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </Button>
            <Button
              onClick={capturePhoto}
              disabled={!isCameraReady}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-brand-primary"
            >
              <Camera className="w-8 h-8" />
            </Button>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && preview && (
        <div className="space-y-4">
          {/* Preview Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={preview} 
              alt="Selfie preview" 
              className="w-full aspect-[3/4] sm:aspect-video object-cover"
            />
            
            {/* Overlay Check */}
            <div className="absolute top-4 right-4">
              <div className="w-10 h-10 rounded-full bg-brand-success flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRetake}
              className="flex-1 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              ถ่ายใหม่
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              className="flex-1 gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              ใช้รูปนี้
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {displayError && (
        <div className="mt-4 flex items-center gap-2 text-brand-error">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{displayError}</span>
        </div>
      )}

      {/* Tips */}
      {(step === 'select' || step === 'camera') && (
        <div className="mt-4 p-4 rounded-lg bg-brand-bg">
          <h4 className="text-sm font-medium text-brand-text-dark mb-2">เคล็ดลับการถ่ายรูป</h4>
          <ul className="text-xs text-brand-text-light space-y-1">
            <li>• ถ่ายในที่มีแสงสว่างเพียงพอ</li>
            <li>• หันหน้าตรงไปที่กล้อง</li>
            <li>• ไม่สวมหมวก แว่นกันแดด หรือหน้ากาก</li>
            {withIdCard && (
              <>
                <li>• ถือบัตรให้ขนานกับกล้อง ไม่ให้เอียง</li>
                <li>• ให้เห็นข้อมูลบนบัตรชัดเจน</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SelfieCapture;
