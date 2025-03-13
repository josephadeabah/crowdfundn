import React from 'react';
import { cn } from '@/app/lib/utils';
import { Card, CardContent } from '@/app/components/ui/card';
import { Check } from 'lucide-react';
import {
  CampaignTemplate,
  campaignTemplates,
} from '@/app/lib/campaign-templates';

interface TemplateSelectorProps {
  selectedTemplate: CampaignTemplate | null;
  onSelectTemplate: (template: CampaignTemplate) => void;
  className?: string;
}

const TemplateSelector = ({
  selectedTemplate,
  onSelectTemplate,
  className,
}: TemplateSelectorProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaignTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              'cursor-pointer border transition-all duration-300 hover:shadow-md',
              selectedTemplate?.id === template.id
                ? 'border-emerald-900 bg-emerald-50 ring-1 ring-emerald-700' // Fixed Tailwind classes
                : 'hover:border-emerald-300', // Fixed Tailwind classes
            )}
            onClick={() => {
              console.log('Selected Template:', template); // Debugging
              onSelectTemplate(template);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-medium text-base">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="w-5 h-5 bg-emerald-900 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />{' '}
                    {/* Fixed text color */}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
