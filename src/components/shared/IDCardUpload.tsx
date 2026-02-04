"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  CreditCard,
  User,
  Calendar,
  MapPin,
  Hash,
  Edit2
} from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import type { OCRResult } from "@/types";

export interface IDCardData {
  idNumber: string;
  prefix: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  address?: string;
}

export interface IDCardUploadProps {
  onDataConfirmed: (data: IDCardData, imageFile: File) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Mock OCR function - in production, this would call an API
async function mockOCR(file: File): Promise<OCRResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Mock data based on file name or random
  const mockData = {
    idNumber: "1-1234-56789-01-2",
    prefix: "นาย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    birthDate: "1990-05-15",
    address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110",
    issueDate: "2020-01-15",
    expiryDate: "2028-05-14",
  };
  
  // 90% success rate for demo
  if (Math.random() > 0.1) {
    return {
      success: true,
      data: mockData,
      confidence: 85 + Math.random() * 15,
    };
  } else {
    return {
      success: false,
      confidence: 0,
      error: "ไม่สามารถอ่านข้อมูลจากบัตรได้ กรุณาถ่ายภาพใหม่",
    };
  }
}

type UploadStep = 'upload' | 'processing' | 'confirm' | 'editing';

export function IDCardUpload({
  onDataConfirmed,
  error: externalError,
  disabled = false,
  className = "",
}: IDCardUploadProps) {
  const [step, setStep] = useState<UploadStep>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [editedData, setEditedData] = useState<IDCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError("ไฟล์ใหญ่เกินไป (สูงสุด 10MB)");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setImageFile(file);
    setStep('processing');

    // Run OCR
    try {
      const result = await mockOCR(file);
      setOcrResult(result);
      
      if (result.success && result.data) {
        setEditedData({
          idNumber: result.data.idNumber,
          prefix: result.data.prefix,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          birthDate: result.data.birthDate,
          address: result.data.address,
        });
        setStep('confirm');
      } else {
        setError(result.error || "ไม่สามารถอ่านข้อมูลได้");
        setStep('upload');
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการประมวลผล");
      setStep('upload');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleConfirm = () => {
    if (editedData && imageFile) {
      onDataConfirmed(editedData, imageFile);
    }
  };

  const handleEdit = () => {
    setStep('editing');
  };

  const handleSaveEdit = () => {
    setStep('confirm');
  };

  const handleReset = () => {
    setStep('upload');
    setImageFile(null);
    setImagePreview(null);
    setOcrResult(null);
    setEditedData(null);
    setError(null);
  };

  const handleDataChange = (field: keyof IDCardData, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const displayError = externalError || error;

  return (
    <div className={className}>
      {/* Step: Upload */}
      {step === 'upload' && (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-8
            flex flex-col items-center text-center
            transition-all duration-200 cursor-pointer
            ${displayError ? "border-brand-error bg-brand-error/5" : "border-brand-border hover:border-brand-primary hover:bg-brand-primary/5"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />
          
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-brand-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
            อัปโหลดรูปบัตรประชาชน
          </h3>
          
          <p className="text-sm text-brand-text-light mb-4">
            คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              disabled={disabled}
            >
              <Upload className="w-4 h-4 mr-2" />
              เลือกไฟล์
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (inputRef.current) {
                  inputRef.current.capture = "environment";
                  inputRef.current.click();
                }
              }}
              disabled={disabled}
            >
              <Camera className="w-4 h-4 mr-2" />
              ถ่ายรูป
            </Button>
          </div>
          
          <p className="text-xs text-brand-text-light mt-4">
            รองรับ JPG, PNG (สูงสุด 10MB)
          </p>
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <div className="border rounded-xl p-8 flex flex-col items-center text-center">
          {imagePreview && (
            <div className="w-full max-w-xs mb-6 rounded-lg overflow-hidden border">
              <img src={imagePreview} alt="ID Card" className="w-full" />
            </div>
          )}
          
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-4" />
          <p className="text-brand-text-dark font-medium">กำลังอ่านข้อมูลจากบัตร...</p>
          <p className="text-sm text-brand-text-light">กรุณารอสักครู่</p>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && editedData && (
        <div className="space-y-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="rounded-lg overflow-hidden border">
              <img src={imagePreview} alt="ID Card" className="w-full" />
            </div>
          )}
          
          {/* OCR Confidence */}
          {ocrResult && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-brand-success" />
              <span className="text-brand-text-light">
                ความแม่นยำในการอ่าน: {ocrResult.confidence.toFixed(0)}%
              </span>
            </div>
          )}
          
          {/* Data Preview Card */}
          <Card variant="bordered" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-brand-text-dark">ข้อมูลที่อ่านได้</h4>
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-1" />
                แก้ไข
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-brand-text-light mt-0.5" />
                <div>
                  <p className="text-xs text-brand-text-light">เลขบัตรประชาชน</p>
                  <p className="font-medium text-brand-text-dark">{editedData.idNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-brand-text-light mt-0.5" />
                <div>
                  <p className="text-xs text-brand-text-light">ชื่อ-นามสกุล</p>
                  <p className="font-medium text-brand-text-dark">
                    {editedData.prefix}{editedData.firstName} {editedData.lastName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-text-light mt-0.5" />
                <div>
                  <p className="text-xs text-brand-text-light">วันเกิด</p>
                  <p className="font-medium text-brand-text-dark">{editedData.birthDate}</p>
                </div>
              </div>
              
              {editedData.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-text-light mt-0.5" />
                  <div>
                    <p className="text-xs text-brand-text-light">ที่อยู่</p>
                    <p className="font-medium text-brand-text-dark text-sm">{editedData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              อัปโหลดใหม่
            </Button>
            <Button variant="primary" onClick={handleConfirm} className="flex-1">
              ยืนยันข้อมูล
            </Button>
          </div>
        </div>
      )}

      {/* Step: Editing */}
      {step === 'editing' && editedData && (
        <div className="space-y-4">
          <Card variant="bordered" padding="md">
            <h4 className="font-semibold text-brand-text-dark mb-4">แก้ไขข้อมูล</h4>
            
            <div className="space-y-4">
              <Input
                label="เลขบัตรประชาชน"
                value={editedData.idNumber}
                onChange={(e) => handleDataChange('idNumber', e.target.value)}
                placeholder="x-xxxx-xxxxx-xx-x"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="คำนำหน้า"
                  value={editedData.prefix}
                  onChange={(e) => handleDataChange('prefix', e.target.value)}
                  placeholder="นาย/นาง/นางสาว"
                />
                <Input
                  label="ชื่อ"
                  value={editedData.firstName}
                  onChange={(e) => handleDataChange('firstName', e.target.value)}
                />
                <Input
                  label="นามสกุล"
                  value={editedData.lastName}
                  onChange={(e) => handleDataChange('lastName', e.target.value)}
                />
              </div>
              
              <Input
                label="วันเกิด"
                type="date"
                value={editedData.birthDate}
                onChange={(e) => handleDataChange('birthDate', e.target.value)}
              />
              
              <Input
                label="ที่อยู่ (ไม่บังคับ)"
                value={editedData.address || ''}
                onChange={(e) => handleDataChange('address', e.target.value)}
              />
            </div>
          </Card>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('confirm')} className="flex-1">
              ยกเลิก
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} className="flex-1">
              บันทึก
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {displayError && step === 'upload' && (
        <div className="mt-4 flex items-center gap-2 text-brand-error">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{displayError}</span>
        </div>
      )}
    </div>
  );
}

export default IDCardUpload;
