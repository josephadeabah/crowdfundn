import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { FaTimes } from 'react-icons/fa';
import InfoTooltip from '@/app/components/tooltip/tooltip';

const CONTRACT_OPTIONS = [
  { id: 'safe', label: 'Future Equity (SAFE)' },
  { id: 'convertible-note', label: 'Convertible Note' },
  { id: 'revenue-share', label: 'Revenue Share' },
  { id: 'equity-revenue', label: 'Future Equity + Revenue Share' },
  { id: 'simple-loan', label: 'Simple Loan' },
  { id: 'preferred-stock', label: 'Preferred Stock' },
  { id: 'other', label: "Other/I don't know yet" },
];

const TOOLTIP_CONTENT = `
📄 Contracts Documents for Investors:
• Form C or equivalent
• Any Required Agreement document neccessary for the investment
• We'll show these to investors to have and keep a copy of these documents for their records
`;

interface TermsContractProps {
  contractType: string;
  setContractType: (value: string) => void;
  onFilesUpload: (files: File[]) => void;
}

const TermsContract = ({
  contractType,
  setContractType,
  onFilesUpload,
}: TermsContractProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
        <h3 className="font-semibold mb-3">
          Choose an investment contract structure
        </h3>
        <RadioGroup
          value={contractType}
          onValueChange={setContractType}
          className="space-y-3"
        >
          {CONTRACT_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6">
          <div className="flex items-center">
            <Label className="block text-sm font-medium mb-1">
              Required Documents
            </Label>
            <InfoTooltip
              id="documents-tooltip"
              content={TOOLTIP_CONTENT}
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
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
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
      </CardContent>
    </Card>
  );
};

export default TermsContract;
