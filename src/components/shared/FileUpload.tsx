"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload, X, File, Image as ImageIcon, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  onRemove?: (index: number) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  preview?: boolean;
  previewUrl?: string; // For existing file preview
}

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5,
  multiple = false,
  onUpload,
  onRemove,
  error,
  hint,
  disabled = false,
  className = "",
  label,
  required = false,
  preview = true,
  previewUrl,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `ไฟล์ใหญ่เกินไป (สูงสุด ${maxSize}MB)`;
    }

    // Check file type
    if (accept !== "*") {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", ""));
        }
        return file.type === type || file.name.endsWith(type.replace(".", ""));
      });
      if (!isAccepted) {
        return "ประเภทไฟล์ไม่รองรับ";
      }
    }

    return null;
  }, [accept, maxSize]);

  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!preview || !file.type.startsWith("image/")) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, [preview]);

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || disabled) return;

    setLocalError(null);
    const newFiles: UploadedFile[] = [];
    const validFiles: File[] = [];

    for (let i = 0; i < (multiple ? fileList.length : 1); i++) {
      const file = fileList[i];
      const error = validateFile(file);
      
      if (error) {
        setLocalError(error);
        continue;
      }

      const filePreview = await createPreview(file);
      newFiles.push({
        file,
        preview: filePreview,
        status: 'success',
      });
      validFiles.push(file);
    }

    if (newFiles.length > 0) {
      if (multiple) {
        setFiles((prev) => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles);
      }
      onUpload(validFiles);
    }
  }, [disabled, multiple, validateFile, createPreview, onUpload]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow re-uploading same file
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    onRemove?.(index);
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (file.type === "application/pdf") return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const displayError = error || localError;
  const hasFiles = files.length > 0 || previewUrl;

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-brand-text-dark mb-2">
          {label}
          {required && <span className="text-brand-error ml-1">*</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6
          transition-all duration-200 cursor-pointer
          ${isDragging ? "border-brand-primary bg-brand-primary/5" : "border-brand-border"}
          ${displayError ? "border-brand-error bg-brand-error/5" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-brand-primary hover:bg-brand-bg"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {/* Preview or Upload Icon */}
        {!hasFiles ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-brand-primary" />
            </div>
            <p className="text-sm font-medium text-brand-text-dark mb-1">
              คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง
            </p>
            <p className="text-xs text-brand-text-light">
              {accept === "image/*" ? "รองรับ PNG, JPG, GIF" : accept}
              {` (สูงสุด ${maxSize}MB)`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-success/10 flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-brand-success" />
            </div>
            <p className="text-sm font-medium text-brand-text-dark mb-1">
              อัปโหลดแล้ว {files.length} ไฟล์
            </p>
            <p className="text-xs text-brand-text-light">
              คลิกเพื่อเปลี่ยนไฟล์
            </p>
          </div>
        )}
      </div>

      {/* Hint */}
      {hint && !displayError && (
        <p className="mt-2 text-xs text-brand-text-light">{hint}</p>
      )}

      {/* Error */}
      {displayError && (
        <div className="mt-2 flex items-center gap-1 text-brand-error">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs">{displayError}</span>
        </div>
      )}

      {/* File Previews */}
      {(files.length > 0 || previewUrl) && (
        <div className="mt-4 space-y-2">
          {/* Existing preview */}
          {previewUrl && files.length === 0 && (
            <div className="relative rounded-lg overflow-hidden border border-brand-border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-40 object-cover"
              />
            </div>
          )}

          {/* Uploaded files */}
          {files.map((uploadedFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-brand-border bg-brand-surface"
            >
              {/* Preview or Icon */}
              {uploadedFile.preview ? (
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-brand-bg flex items-center justify-center flex-shrink-0">
                  {getFileIcon(uploadedFile.file)}
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-text-dark truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-brand-text-light">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
              </div>

              {/* Status/Remove */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="flex-shrink-0 text-brand-text-light hover:text-brand-error"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple image preview upload
export function ImageUpload({
  onUpload,
  previewUrl,
  error,
  disabled,
  className = "",
  size = "md",
  shape = "rounded",
}: {
  onUpload: (file: File) => void;
  previewUrl?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "circle";
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onUpload(file);

    if (inputRef.current) inputRef.current.value = "";
  };

  const displayPreview = preview || previewUrl;

  return (
    <div className={className}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          ${sizeClasses[size]}
          ${shape === "circle" ? "rounded-full" : "rounded-lg"}
          border-2 border-dashed
          flex items-center justify-center
          cursor-pointer overflow-hidden
          transition-all duration-200
          ${error ? "border-brand-error" : "border-brand-border hover:border-brand-primary"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        {displayPreview ? (
          <img
            src={displayPreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-brand-text-light">
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">อัปโหลด</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-brand-error">{error}</p>
      )}
    </div>
  );
}

export default FileUpload;
