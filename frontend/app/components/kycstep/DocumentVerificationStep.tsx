'use client';
import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/app/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Upload, FileText, X, Plus } from 'lucide-react';

interface DocumentVerificationStepProps {
  onDocumentUpload: (documentType: string, file: File) => void;
  userType: 'issuer' | 'investor' | 'both' | 'mentor';
  isNonProfit?: boolean;
}

// Document types configuration
const DOCUMENT_TYPES = {
  // Common documents for all user types
  common: [
    { value: 'id_front', label: 'ID Front Side' },
    { value: 'id_back', label: 'ID Back Side' },
    { value: 'proof_of_address', label: 'Proof of Address' },
    { value: 'selfie_with_id', label: 'Selfie with ID' },
  ],
  // Additional documents for issuers/businesses
  issuer: [
    { value: 'business_registration', label: 'Business Registration' },
    { value: 'tax_clearance', label: 'Tax Clearance Certificate' },
    { value: 'financial_statements', label: 'Financial Statements' },
  ],
  // Additional documents for investors
  investor: [{ value: 'id_document', label: 'ID Document' }],
  // Documents for mentors
  mentor: [{ value: 'id_document', label: 'ID Document' }],
};

export const DocumentVerificationStep: React.FC<
  DocumentVerificationStepProps
> = ({ onDocumentUpload, userType, isNonProfit = false }) => {
  const form = useFormContext();
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>(
    {},
  );
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<string>('id_front');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get available document types based on user type (same as before)
  const getAvailableDocumentTypes = () => {
    const baseTypes = [...DOCUMENT_TYPES.common];

    if (userType === 'issuer' || userType === 'both') {
      if (!isNonProfit) {
        baseTypes.push(...DOCUMENT_TYPES.issuer);
      }
    }

    if (userType === 'investor' || userType === 'both') {
      baseTypes.push(...DOCUMENT_TYPES.investor);
    }

    if (userType === 'mentor') {
      baseTypes.push(...DOCUMENT_TYPES.mentor);
    }

    return baseTypes;
  };

  const availableDocumentTypes = getAvailableDocumentTypes();

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [documentType]: file }));
    onDocumentUpload(documentType, file);
    form.setValue(`document_${documentType}`, file, { shouldValidate: true });
  };

  const removeUploadedFile = (documentType: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[documentType];
      return newFiles;
    });
    form.setValue(`document_${documentType}`, null, { shouldValidate: true });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="idType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="national_id">National ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="drivers_license">
                  Driver's License
                </SelectItem>
                <SelectItem value="voter_id">Voter ID</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="idNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter your ID number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-6">
        <FormLabel>Upload Documents</FormLabel>

        {/* Document Upload Interface */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <FormLabel>Document Type</FormLabel>
              <Select
                value={selectedDocumentType}
                onValueChange={setSelectedDocumentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocumentTypes.map((docType) => (
                    <SelectItem key={docType.value} value={docType.value}>
                      {docType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(selectedDocumentType, file);
                  }
                }}
                className="hidden"
                ref={fileInputRef}
              />
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileInput}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Uploaded Files List */}
          <div className="space-y-2">
            {Object.entries(uploadedFiles).map(([docType, file]) => {
              const docLabel =
                availableDocumentTypes.find((d) => d.value === docType)
                  ?.label || docType;
              return (
                <div
                  key={docType}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium capitalize">
                        {docLabel.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-gray-500">{file.name}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadedFile(docType)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Requirements Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            Document Requirements
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Maximum file size: 10MB per document</li>
            <li>• Accepted formats: PDF, JPEG, PNG</li>
            <li>• Ensure documents are clear and readable</li>
            <li>• All documents must be valid and not expired</li>
            <li>• You can upload all required document types listed above</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
