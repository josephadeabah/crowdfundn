import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';

interface CompanyInfo {
  name: string;
  description: string;
  headquarters: string;
  website: string;
}

interface PitchBasicsProps {
  companyInfo: CompanyInfo;
  onCompanyInfoChange: (info: CompanyInfo) => void;
}

const PitchBasics = ({
  companyInfo,
  onCompanyInfoChange,
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
              Company Tagline/Description (max 100 chars)
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchBasics;
