// DocumentVerificationStep.tsx
'use client';
import React, { useState } from 'react';
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
import { Upload, FileText } from 'lucide-react';

interface DocumentVerificationStepProps {
  onDocumentUpload: (documentType: string, file: File) => void;
}

export const DocumentVerificationStep: React.FC<
  DocumentVerificationStepProps
> = ({ onDocumentUpload }) => {
  const form = useFormContext();
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>(
    {},
  );

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [documentType]: file }));
    onDocumentUpload(documentType, file);
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

      <div className="space-y-4">
        <FormLabel>Upload Documents</FormLabel>

        {/* ID Document Upload */}
        <div className="space-y-2">
          <FormLabel>ID Document</FormLabel>
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload('id_document', file);
                }
              }}
              className="hidden"
              id="id-document"
            />
            <label htmlFor="id-document">
              <Button type="button" variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload ID
                </span>
              </Button>
            </label>
            {uploadedFiles['id_document'] && (
              <div className="flex items-center text-sm text-green-600">
                <FileText className="mr-2 h-4 w-4" />
                {uploadedFiles['id_document'].name}
              </div>
            )}
          </div>
        </div>

        {/* Proof of Address Upload */}
        <div className="space-y-2">
          <FormLabel>Proof of Address</FormLabel>
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload('proof_of_address', file);
                }
              }}
              className="hidden"
              id="proof-of-address"
            />
            <label htmlFor="proof-of-address">
              <Button type="button" variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Proof
                </span>
              </Button>
            </label>
            {uploadedFiles['proof_of_address'] && (
              <div className="flex items-center text-sm text-green-600">
                <FileText className="mr-2 h-4 w-4" />
                {uploadedFiles['proof_of_address'].name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
