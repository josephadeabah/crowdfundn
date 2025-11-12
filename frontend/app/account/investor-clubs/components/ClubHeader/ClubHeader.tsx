import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Club } from '../../clubTypes';

interface ClubHeaderProps {
  clubs: Club[];
  currentClub: Club;
  onClubChange: (club: Club) => void;
  onOpenClubDetails: () => void;
}

// Key for localStorage
const CLUB_STORAGE_KEY = 'selected-club-slug';

export const ClubHeader: React.FC<ClubHeaderProps> = ({
  clubs,
  currentClub,
  onClubChange,
  onOpenClubDetails,
}) => {
  const [initialized, setInitialized] = useState(false);

  // Load saved club from localStorage on component mount
  useEffect(() => {
    const savedClubSlug = localStorage.getItem(CLUB_STORAGE_KEY);

    if (savedClubSlug && clubs.length > 0) {
      const savedClub = clubs.find((club) => club.slug === savedClubSlug);
      if (savedClub && savedClub.slug !== currentClub.slug) {
        onClubChange(savedClub);
      }
    }

    setInitialized(true);
  }, [clubs.length]); // Only run when clubs are loaded

  const handleClubChange = (value: string) => {
    const club = clubs.find((c) => c.slug === value);
    if (club) {
      // Save to localStorage
      localStorage.setItem(CLUB_STORAGE_KEY, club.slug);
      onClubChange(club);
    }
  };

  // Don't render until initialized to avoid flash of wrong selection
  if (!initialized) {
    return (
      <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            My Investment Clubs
          </h1>
          <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
            Manage your club investments and collaborate with members
          </p>
        </div>
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-[180px] lg:w-[200px] h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <button
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm lg:text-base"
            disabled
          >
            Club Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Investment Clubs</h1>
        <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
          Manage your club investments and collaborate with members
        </p>
      </div>
      <div className="flex items-center gap-3 lg:gap-4">
        <Select value={currentClub.slug} onValueChange={handleClubChange}>
          <SelectTrigger className="w-[180px] lg:w-[200px] border-0 focus:ring-0 focus:ring-offset-0 focus:outline-none shadow-none">
            <SelectValue placeholder="Select a club" />
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
          onClick={onOpenClubDetails}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm lg:text-base"
        >
          Club Details
        </button>
      </div>
    </div>
  );
};
