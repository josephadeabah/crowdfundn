import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { FaTimes } from 'react-icons/fa';
import InfoTooltip from '@/app/components/tooltip/tooltip';

const CONTRACT_OPTIONS = [
  {
    id: 'safe',
    label: 'Future Equity (SAFE)',
    tooltip: `Best for high-growth startups in SF\n\nA Simple Agreement for Future Equity (SAFE) is common in Silicon Valley among startups that expect to raise venture capital. It delays the valuation of your company until the next equity financing.\n\n<a href="/learn/safe-agreements" target="_blank" class="text-blue-400 hover:underline">Learn more about SAFE agreements</a>`,
  },
  {
    id: 'convertible-note',
    label: 'Convertible Note',
    tooltip: `Best for startups in conservative areas\n\nA convertible note is more common outside of Silicon Valley or NYC among startups that intend to raise venture capital. Like a SAFE, it delays the valuation of your company until the next equity financing. Unlike a SAFE, a convertible note is debt (until it converts to equity at the next financing).\n\n<a href="/learn/convertible-notes" target="_blank" class="text-blue-400 hover:underline">Learn more about Convertible Notes</a>`,
  },
  {
    id: 'revenue-share',
    label: 'Revenue Share',
    tooltip: `Best for mainstreet companies\n\nRevenue Shares are best for cash-generating businesses that don't plan to get acquired for millions of dollars. It offers investors a percent of your revenues - each quarter - until they earn a multiple of their money back. If you have no revenue, nothing is owed. Once you pay back the multiple of their investment, nothing is owed.\n\n<a href="/learn/revenue-sharing" target="_blank" class="text-blue-400 hover:underline">Learn more about Revenue Sharing</a>`,
  },
  {
    id: 'equity-revenue',
    label: 'Future Equity + Revenue Share',
    tooltip: `Good deal for investors\n\nIf you'd like to offer a good deal to your investors, combine a Simple Agreement for Future Equity (SAFE) with a Revenue Share. The revenue share offers investors 10% of your revenues - each quarter - until they earn 2X their investment back. The SAFE can eventually give your earliest investors equity in your company, if you raise a priced round from a venture capitalist or other major investor.\n\n<a href="/learn/equity-revenue" target="_blank" class="text-blue-400 hover:underline">Learn more about this hybrid approach</a>`,
  },
  {
    id: 'simple-loan',
    label: 'Simple Loan',
    tooltip: `Best for grandma\n\nA 10% interest 5 year loan is the simplest investment agreement. It's like your car payment. If you borrow $20,000, you'll pay back $424.94 a month for 5 years. You'll start paying 6 months after you receive the money. In most cases, a revenue share is more exciting to investors because of higher potential returns. It's also often preferred by companies, as it can be less risky if revenues are less than you expect.\n\n<a href="/learn/simple-loans" target="_blank" class="text-blue-400 hover:underline">Learn more about Simple Loans</a>`,
  },
  {
    id: 'preferred-stock',
    label: 'Preferred Stock',
    tooltip: `Best for those with good lawyers\n\nBantu Hive doesn't have an out-of-the-box stock subscription agreement. However, we can work with any documents that your lawyer has drafted up. They also can customize templates like the Series Seed documents.\n\n<a href="/learn/preferred-stock" target="_blank" class="text-blue-400 hover:underline">Learn more about Preferred Stock</a>`,
  },
  {
    id: 'other',
    label: "Other/I don't know yet",
    tooltip: `That's okay!\n\nYou can always select your contract and set your terms later. If none of the above contracts look right for you, you can set up a custom contract.\n\n<a href="/contact" target="_blank" class="text-blue-400 hover:underline">Contact us for custom agreements</a>`,
  },
];

const TOOLTIP_CONTENT = `
📄 Contracts Documents for Investors:
• Form C or equivalent
• Any Required Agreement document necessary for the investment
• We'll show these to investors to have and keep a copy of these documents for their records
`;

interface TermsContractProps {
  contractType: string;
  setContractType: (value: string) => void;
  onFilesUpload: (files: File[]) => void;
  documentType?: string;
}

const TermsContract = ({
  contractType,
  setContractType,
  onFilesUpload,
  documentType = 'contract_documents',
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
              <InfoTooltip
                id={`${option.id}-tooltip`}
                content={option.tooltip}
                className="ml-2"
              />
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
      </CardContent>
    </Card>
  );
};

export default TermsContract;
