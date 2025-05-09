import { useState, useCallback, useRef } from 'react';
import { csvStringToJson } from '@/data/csvToJson';

interface UploadFormProps<T extends Record<string, any>> {
  /**
   * Callback function that receives the parsed and validated data
   */
  onDataUploaded: (data: T[]) => void;
  /**
   * Optional validation function to validate the data
   * Return true if valid, false or throw error if invalid
   */
  validateData?: (data: T[]) => boolean;
  /**
   * Optional error callback for validation errors
   */
  onError?: (error: Error) => void;
  /**
   * Optional loading state callback
   */
  onLoadingChange?: (isLoading: boolean) => void;
  /**
   * Optional accepted file types
   * @default ['.csv', '.json']
   */
  acceptedFileTypes?: string[];
  /**
   * Optional maximum file size in bytes
   * @default 5MB
   */
  maxFileSize?: number;
  /**
   * Optional ref to access the form methods
   */
  formRef?: React.RefObject<{ reset: () => void } | null>;
}

export function UploadForm<T extends Record<string, any>>({
  onDataUploaded,
  validateData,
  onError,
  onLoadingChange,
  acceptedFileTypes = ['.csv', '.json'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  formRef,
}: UploadFormProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose reset method through ref
  if (formRef) {
    formRef.current = {
      reset: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setError(null);
      }
    };
  }

  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null);
      onLoadingChange?.(true);

      // Check file size
      if (file.size > maxFileSize) {
        throw new Error(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
      }

      // Read file content
      const content = await file.text();
      let data: T[];

      // Parse based on file type
      if (file.name.endsWith('.csv')) {
        data = csvStringToJson<T>(content);
      } else if (file.name.endsWith('.json')) {
        try {
          data = JSON.parse(content);
          if (!Array.isArray(data)) {
            throw new Error('JSON file must contain an array of objects');
          }
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      } else {
        throw new Error('Unsupported file type');
      }

      // Validate data if validator provided
      if (validateData && !validateData(data)) {
        throw new Error('Data validation failed');
      }

      // Call success callback
      onDataUploaded(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error.message);
      onError?.(error);
    } finally {
      onLoadingChange?.(false);
    }
  }, [onDataUploaded, validateData, onError, onLoadingChange, maxFileSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          ref={fileInputRef}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-gray-600">
            Drag and drop your file here, or{' '}
            <span className="text-blue-500 hover:text-blue-600">browse</span>
          </span>
          <span className="text-sm text-gray-500 mt-1">
            Supported formats: {acceptedFileTypes.join(', ')}
          </span>
        </label>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
