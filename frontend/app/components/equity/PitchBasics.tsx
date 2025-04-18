import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { FaTimes } from 'react-icons/fa';
import InfoTooltip from '@/app/components/tooltip/tooltip';
import { Label } from '../ui/label';

const PITCH_DOCS_TOOLTIP = `
📄 Pitch Documents for Fundraising:
• Certificate of Incorporation
• Business Registration Documents
• TIN or Tax Certificate
• Company Constitution / Articles of Incorporation
• Director & Shareholder Information
• Pitch Deck / Business Plan
• Bank Account Details
• Proof of Address
• Founder's/CEO's ID Documents
• Any Required Licenses or Permits
• Note => BantuHive will do due diligence on these documents to verify the company's eligibility for fundraising
`;

interface CompanyInfo {
  name: string;
  description: string;
  headquarters: string;
  website: string;
  contract_term?: string;
}

interface PitchBasicsProps {
  companyInfo: CompanyInfo;
  onCompanyInfoChange: (info: CompanyInfo) => void;
  onFilesUpload: (files: File[]) => void;
  documentType?: string;
}

const PitchBasics = ({
  companyInfo,
  onCompanyInfoChange,
  onFilesUpload,
  documentType = 'pitch_documents',
}: PitchBasicsProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onCompanyInfoChange({
      ...companyInfo,
      [field]: value,
    });
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...newFiles]);
        onFilesUpload([...selectedFiles, ...newFiles]);
      }
    },
    [selectedFiles, onFilesUpload],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = [...selectedFiles];
      updatedFiles.splice(index, 1);
      setSelectedFiles(updatedFiles);
      onFilesUpload(updatedFiles);
    },
    [selectedFiles, onFilesUpload],
  );

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Company Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Company Tagline (max 100 chars)
            </label>
            <input
              type="text"
              value={companyInfo.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Brief description of your company"
            />
            <p className="text-xs text-gray-500 mt-1">
              {companyInfo.description.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Headquarters
            </label>
            <input
              type="text"
              value={companyInfo.headquarters}
              onChange={(e) => handleChange('headquarters', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Company headquarters location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Website (optional)
            </label>
            <input
              type="url"
              value={companyInfo.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://example.com"
            />
          </div>

          {companyInfo.contract_term && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Contract Term
              </label>
              <input
                type="text"
                value={companyInfo.contract_term}
                onChange={(e) => handleChange('contract_term', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., 5 years"
              />
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center">
              <Label className="block text-sm font-medium mb-1">
                Company Documents
              </Label>
              <InfoTooltip
                id="pitch-docs-tooltip"
                content={PITCH_DOCS_TOOLTIP}
                className="ml-2"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id={`${documentType}-file-upload`}
              />
              <label
                htmlFor={`${documentType}-file-upload`}
                className="cursor-pointer flex flex-col items-center justify-center py-4"
              >
                <div className="text-sm text-gray-600 mb-2">
                  Drag & drop files here or click to browse
                </div>
                <div className="text-xs text-gray-500">(PDF only accepted)</div>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Selected Files:</h4>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm truncate max-w-xs">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchBasics;
