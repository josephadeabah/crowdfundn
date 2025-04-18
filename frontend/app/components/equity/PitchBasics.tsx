import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { FaTimes } from 'react-icons/fa';
import InfoTooltip from '@/app/components/tooltip/tooltip';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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
  companyInfo?: CompanyInfo;
  onCompanyInfoChange?: (info: CompanyInfo) => void;
  onFilesUpload?: (files: File[]) => void;
  documentType?: string;
}

const PitchBasics = ({
  companyInfo = {
    name: '',
    description: '',
    headquarters: '',
    website: '',
    contract_term: '',
  },
  onCompanyInfoChange = () => {},
}: PitchBasicsProps) => {
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onCompanyInfoChange({
      ...companyInfo,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Company Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              type="text"
              value={companyInfo?.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div>
            <Label htmlFor="company-description">
              Company Tagline (max 100 chars)
            </Label>
            <Input
              id="company-description"
              type="text"
              value={companyInfo.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={100}
              placeholder="Brief description of your company"
            />
            <p className="text-xs text-gray-500 mt-1">
              {companyInfo.description.length}/100 characters
            </p>
          </div>

          <div>
            <Label htmlFor="headquarters">Headquarters</Label>
            <Input
              id="headquarters"
              type="text"
              value={companyInfo.headquarters}
              onChange={(e) => handleChange('headquarters', e.target.value)}
              placeholder="Company headquarters location"
            />
          </div>

          <div>
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              type="url"
              value={companyInfo.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchBasics;
