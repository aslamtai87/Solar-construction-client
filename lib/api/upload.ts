import api from "./api";
import { API_ENDPOINTS } from "./endPoints";

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

/**
 * Upload a single file to the storage bucket
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with the file URL
 */
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<{ url: string }>(
      API_ENDPOINTS.UPLOAD_FILE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.(percentCompleted);
          }
        },
      }
    );

    return response.data.url;
  } catch (error: any) {
    console.error('File upload error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to upload file'
    );
  }
};

/**
 * Upload multiple files in parallel
 * @param files - Array of files to upload
 * @param onProgress - Optional callback for overall progress updates
 * @returns Promise with array of file URLs
 */
export const uploadFiles = async (
  files: File[],
  onProgress?: (fileProgress: UploadProgress[]) => void
): Promise<string[]> => {
  const progressMap: Map<string, UploadProgress> = new Map();

  // Initialize progress for all files
  files.forEach((file) => {
    progressMap.set(file.name, {
      file,
      progress: 0,
      status: 'pending',
    });
  });

  // Notify initial state
  onProgress?.(Array.from(progressMap.values()));

  const uploadPromises = files.map(async (file) => {
    try {
      // Update to uploading
      progressMap.set(file.name, {
        ...progressMap.get(file.name)!,
        status: 'uploading',
      });
      onProgress?.(Array.from(progressMap.values()));

      const url = await uploadFile(file, (progress) => {
        progressMap.set(file.name, {
          ...progressMap.get(file.name)!,
          progress,
        });
        onProgress?.(Array.from(progressMap.values()));
      });

      // Update to success
      progressMap.set(file.name, {
        ...progressMap.get(file.name)!,
        status: 'success',
        progress: 100,
        url,
      });
      onProgress?.(Array.from(progressMap.values()));

      return url;
    } catch (error: any) {
      // Update to error
      progressMap.set(file.name, {
        ...progressMap.get(file.name)!,
        status: 'error',
        error: error.message,
      });
      onProgress?.(Array.from(progressMap.values()));

      throw error;
    }
  });

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    // Return successfully uploaded URLs, even if some failed
    const successfulUploads = Array.from(progressMap.values())
      .filter((p) => p.status === 'success' && p.url)
      .map((p) => p.url!);
    
    if (successfulUploads.length === 0) {
      throw error;
    }
    
    return successfulUploads;
  }
};

/**
 * Delete a file from the storage bucket
 * @param url - The URL of the file to delete
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.DELETE_FILE, {
      data: { url },
    });
  } catch (error: any) {
    console.error('File deletion error:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to delete file'
    );
  }
};
