import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Club } from '../../clubTypes';

interface MobileHeaderProps {
  clubs: Club[];
  currentClub: Club;
  mobileMenuOpen: boolean;
  onClubChange: (club: Club) => void;
  onOpenClubDetails: () => void;
  onCreateClub: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  clubs,
  currentClub,
  mobileMenuOpen,
  onClubChange,
  onOpenClubDetails,
  onCreateClub,
  setMobileMenuOpen,
}) => {
  // Persist selected club slug whenever it changes
  useEffect(() => {
    if (currentClub?.slug) {
      localStorage.setItem('selectedClubSlug', currentClub.slug);
    }
  }, [currentClub]);

  const handleClubChange = (value: string) => {
    const club = clubs.find((c) => c.slug === value);
    if (club) {
      onClubChange(club);
      localStorage.setItem('selectedClubSlug', value); // Save on selection
      setMobileMenuOpen(false);
    }
  };

  const handleClubDetails = () => {
    onOpenClubDetails();
    setMobileMenuOpen(false);
  };

  const handleCreateClub = () => {
    onCreateClub();
    setMobileMenuOpen(false);
  };

  return (
    <div className="lg:hidden mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">My Clubs</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage investments & collaborate
          </p>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white border border-gray-200"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-lg"
        >
          <div className="space-y-3">
            <Select
              value={currentClub?.slug || ''}
              onValueChange={handleClubChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a club">
                  {currentClub?.name || 'Select a club'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clubs.map((club) => (
                  <SelectItem key={club.slug} value={club.slug}>
                    {club.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleClubDetails}
              className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm"
            >
              Club Details
            </button>
            <button
              onClick={handleCreateClub}
              className="w-full px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-sm"
            >
              Create New Club
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
