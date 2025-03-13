import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { ChevronRight } from 'lucide-react';

const CampaignTips = () => {
  return (
    <Card className="glass-card">
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-4">Campaign Tips</h3>
        <ul className="space-y-3">
          <li className="flex gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm">
              Use high-quality images to showcase your project
            </span>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm">
              Clearly explain the problem your project solves
            </span>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm">
              Share your story and why you're passionate about it
            </span>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm">
              Include a timeline of how you'll use the funds
            </span>
          </li>
          <li className="flex gap-2">
            <ChevronRight className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm">
              Mention rewards or incentives for supporters
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default CampaignTips;
