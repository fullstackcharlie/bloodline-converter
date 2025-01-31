import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-medical-accent bg-medical-light' : 'border-gray-300 hover:border-medical-accent'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
      <p className="text-lg font-medium text-gray-700">
        {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here, or click to select'}
      </p>
      <p className="mt-2 text-sm text-gray-500">Only PDF files are accepted</p>
    </div>
  );
};

export default FileUpload;