import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

interface Perk {
  title: string;
  description: string;
  minimumInvestment: number;
}

interface TermsPerksProps {
  perks: Perk[];
  setPerks: (perks: Perk[]) => void;
}

const TermsPerks = ({ perks, setPerks }: TermsPerksProps) => {
  const [newPerk, setNewPerk] = useState<Perk>({
    title: '',
    description: '',
    minimumInvestment: 0,
  });

  const handleAddPerk = () => {
    if (newPerk.title) {
      setPerks([...perks, newPerk]);
      setNewPerk({ title: '', description: '', minimumInvestment: 0 });
    }
  };

  const handleRemovePerk = (index: number) => {
    const updatedPerks = [...perks];
    updatedPerks?.splice(index, 1);
    setPerks(updatedPerks);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Investor Perks</h3>
        <div className="space-y-4">
          {perks?.map((perk, index) => (
            <div key={index} className="border p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{perk.title}</h4>
                  <p className="text-sm text-gray-600">
                    Minimum: ${perk.minimumInvestment}
                  </p>
                  {perk.description && (
                    <p className="mt-1 text-sm">{perk.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePerk(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <div className="space-y-3">
            <Input
              placeholder="Perk Title"
              value={newPerk.title}
              onChange={(e) =>
                setNewPerk({ ...newPerk, title: e.target.value })
              }
            />
            <Input
              placeholder="Minimum Investment"
              type="number"
              value={newPerk.minimumInvestment}
              onChange={(e) =>
                setNewPerk({
                  ...newPerk,
                  minimumInvestment: Number(e.target.value),
                })
              }
            />
            <Input
              placeholder="Description (optional)"
              value={newPerk.description}
              onChange={(e) =>
                setNewPerk({ ...newPerk, description: e.target.value })
              }
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddPerk}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Perk
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsPerks;
