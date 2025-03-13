import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Eye } from 'lucide-react';
import { Separator } from '../ui/seperator';

interface CampaignSidebarProps {
  title: string;
  category: string;
  goalAmount: string;
  currencyCode: string;
  startDate?: Date;
  endDate?: Date;
  content: string;
  onViewFullPreview: () => void;
  currencies: Array<{ code: string; symbol: string }>;
}

const CampaignSidebar = ({
  title,
  category,
  goalAmount,
  currencyCode,
  startDate,
  endDate,
  content,
  onViewFullPreview,
  currencies,
}: CampaignSidebarProps) => {
  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find((c) => c.code === code);
    return currency ? currency.symbol : '$';
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-4">Campaign Details</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Title:</span>
            <span className="text-sm font-medium truncate max-w-[70%]">
              {title || 'Not set'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Category:</span>
            <span className="text-sm font-medium">{category || 'Not set'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Goal:</span>
            <span className="text-sm font-medium">
              {goalAmount
                ? `${getCurrencySymbol(currencyCode)}${goalAmount}`
                : 'Not set'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Duration:</span>
            <span className="text-sm font-medium">
              {startDate && endDate
                ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                : 'Not set'}
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        <h3 className="font-semibold text-lg mb-4">Preview</h3>
        <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200 overflow-hidden">
          {content ? (
            <div className="w-full h-full overflow-auto p-4">
              <div
                className="prose prose-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    content.substring(0, 500) +
                    (content.length > 500 ? '...' : ''),
                }}
              />
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-emerald-800 font-medium">
                Your campaign preview
              </p>
              <p className="text-emerald-600 text-sm mt-1">
                Add content to see a preview
              </p>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={onViewFullPreview}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Full Preview
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignSidebar;
