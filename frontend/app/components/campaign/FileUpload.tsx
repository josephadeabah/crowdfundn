// components/campaign/FileUpload.tsx
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaFilePdf, FaFileWord, FaTimes } from 'react-icons/fa';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  accept = '.pdf',
}) => {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    onFileChange(null);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf'))
      return <FaFilePdf className="text-red-500" />;
    return <FaFileWord className="text-blue-500" />;
  };

  return (
    <div>
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop a file, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF (Max: 10MB)</p>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            {getFileIcon(file.name)}
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
