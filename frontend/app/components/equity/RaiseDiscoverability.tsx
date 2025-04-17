import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '../checkbox/Checkbox';

interface RaiseDiscoverabilityProps {
  discoverabilitySettings: {
    featured?: boolean;
    promoted?: boolean;
    seoOptimized?: boolean;
  };
  setDiscoverabilitySettings: (settings: any) => void;
}

const RaiseDiscoverability = ({
  discoverabilitySettings,
  setDiscoverabilitySettings,
}: RaiseDiscoverabilityProps) => {
  const handleChange = (key: string, value: boolean) => {
    setDiscoverabilitySettings({
      ...discoverabilitySettings,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Discoverability</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={discoverabilitySettings.featured || false}
              onCheckedChange={(checked: any) =>
                handleChange('featured', Boolean(checked))
              }
            />
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="promoted"
              checked={discoverabilitySettings.promoted || false}
              onCheckedChange={(checked: any) =>
                handleChange('promoted', Boolean(checked))
              }
            />
            <Label htmlFor="promoted">Promoted in search results</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seoOptimized"
              checked={discoverabilitySettings.seoOptimized !== false}
              onCheckedChange={(checked: any) =>
                handleChange('seoOptimized', Boolean(checked))
              }
            />
            <Label htmlFor="seoOptimized">SEO optimized</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RaiseDiscoverability;
