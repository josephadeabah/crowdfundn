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
  documentType?: string;
}

const TermsContract = ({
  contractType,
  setContractType,
  documentType = 'contract_documents',
}: TermsContractProps) => {
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
      </CardContent>
    </Card>
  );
};

export default TermsContract;
