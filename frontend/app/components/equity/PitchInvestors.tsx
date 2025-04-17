import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

interface Investor {
  name: string;
  logo?: string;
  description: string;
}

interface PitchInvestorsProps {
  featuredInvestors: Investor[];
  setFeaturedInvestors: (investors: Investor[]) => void;
}

const PitchInvestors = ({
  featuredInvestors,
  setFeaturedInvestors,
}: PitchInvestorsProps) => {
  const [newInvestor, setNewInvestor] = useState<Investor>({
    name: '',
    description: '',
  });

  const handleAddInvestor = () => {
    if (newInvestor.name) {
      setFeaturedInvestors([...featuredInvestors, newInvestor]);
      setNewInvestor({ name: '', description: '' });
    }
  };

  const handleRemoveInvestor = (index: number) => {
    const updatedInvestors = [...featuredInvestors];
    updatedInvestors?.splice(index, 1);
    setFeaturedInvestors(updatedInvestors);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Featured Investors</h3>
        <div className="space-y-4">
          {Array.isArray(featuredInvestors) && featuredInvestors.length > 0 ? (
            featuredInvestors.map((investor, index) => (
              <div key={index} className="border p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{investor.name}</h4>
                    {investor?.description && (
                      <p className="mt-1 text-sm">{investor.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInvestor(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No featured investors added yet</p>
          )}

          <div className="space-y-3">
            <Input
              placeholder="Investor Name"
              value={newInvestor.name}
              onChange={(e) =>
                setNewInvestor({ ...newInvestor, name: e.target.value })
              }
            />
            <Input
              placeholder="Description (optional)"
              value={newInvestor.description}
              onChange={(e) =>
                setNewInvestor({ ...newInvestor, description: e.target.value })
              }
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddInvestor}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Investor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchInvestors;
