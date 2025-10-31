"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";
import { FieldError } from "react-hook-form";
import { uploadFiles, UploadProgress } from "@/lib/api/upload";
import { Loader2, X, FileIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value?: string[]; // Array of URLs
  onChange?: (urls: string[] | undefined) => void;
  error?: FieldError;
  maxFiles?: number;
  maxSize?: number;
}

interface FileItem {
  url: string;
  name: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

const FileUpload = ({
  value = [],
  onChange,
  error,
  maxFiles = 3,
  maxSize = 100 * 1024, // 100KB default
}: FileUploadProps) => {
  const [dropErrors, setDropErrors] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, FileItem>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = async (files: File[]) => {
    // Clear any previous drop errors on successful drop
    setDropErrors(null);
    
    if (files.length === 0) return;

    // Check if adding these files would exceed maxFiles
    const totalFiles = (value?.length || 0) + files.length;
    if (totalFiles > maxFiles) {
      setDropErrors(`Maximum ${maxFiles} files allowed. You tried to upload ${files.length} more.`);
      return;
    }

    setIsUploading(true);

    try {
      // Track upload progress
      const newUploadingFiles = new Map(uploadingFiles);
      files.forEach((file) => {
        newUploadingFiles.set(file.name, {
          url: '',
          name: file.name,
          status: 'uploading',
          progress: 0,
        });
      });
      setUploadingFiles(newUploadingFiles);

      // Upload files and get URLs
      const urls = await uploadFiles(files, (progressList: UploadProgress[]) => {
        const updatedFiles = new Map(uploadingFiles);
        progressList.forEach((p) => {
          updatedFiles.set(p.file.name, {
            url: p.url || '',
            name: p.file.name,
            status: p.status === 'success' ? 'success' : p.status === 'error' ? 'error' : 'uploading',
            progress: p.progress,
            error: p.error,
          });
        });
        setUploadingFiles(updatedFiles);
      });
      const updatedUrls = [...(value || []), ...urls];
      onChange?.(updatedUrls.length > 0 ? updatedUrls : undefined);
      setTimeout(() => {
        setUploadingFiles(new Map());
      }, 1500);
      
    } catch (error: any) {
      setDropErrors(error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleError = (error: { message: string }) => {
    setDropErrors(error.message);
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedUrls = value?.filter((url) => url !== urlToRemove);
    onChange?.(updatedUrls && updatedUrls.length > 0 ? updatedUrls : undefined);
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop() || 'file';
      return decodeURIComponent(fileName);
    } catch {
      return url.split('/').pop() || 'file';
    }
  };

  return (
    <div className="space-y-4">
      <Dropzone
        maxFiles={maxFiles - (value?.length || 0)}
        onDrop={handleDrop}
        maxSize={maxSize}
        onError={handleError}
        disabled={isUploading || (value?.length || 0) >= maxFiles}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      {/* Show react-hook-form validation errors */}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      
      {/* Show dropzone-specific errors (file size, count, etc.) */}
      {dropErrors && <p className="text-sm text-red-500">{dropErrors}</p>}

      {/* Uploading files progress */}
      {uploadingFiles.size > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploading files...</p>
          {Array.from(uploadingFiles.values()).map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
            >
              <FileIcon className="h-5 w-5 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {item.name}
                </p>
                {item.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.progress || 0}%
                    </p>
                  </div>
                )}
                {item.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                )}
              </div>
              {item.status === 'uploading' && (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
              )}
              {item.status === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              )}
              {item.status === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded files list */}
      {value && value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded files ({value.length}/{maxFiles})
          </p>
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <FileIcon className="h-5 w-5 text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {getFileNameFromUrl(url)}
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline truncate block"
                >
                  View file
                </a>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(url)}
                className="shrink-0 h-8 w-8 p-0"
                disabled={isUploading}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {(value?.length || 0) >= maxFiles && (
        <p className="text-sm text-amber-600">
          Maximum number of files reached. Remove a file to upload more.
        </p>
      )}
    </div>
  );
};

export default FileUpload;
