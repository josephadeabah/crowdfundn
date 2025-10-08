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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaignTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              'cursor-pointer border-2 transition-all duration-300 hover:shadow-lg group overflow-hidden',
              selectedTemplate?.id === template.id
                ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg' // Orange border
                : 'border-gray-200 hover:border-orange-300', // Gray border, orange hover
            )}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={template.previewImage}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-5 w-5 text-white" /> {/* White checkmark */}
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-semibold text-lg text-white drop-shadow-md">
                  {template.name}
                </h3>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 line-clamp-2"> {/* Gray text */}
                {template.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;