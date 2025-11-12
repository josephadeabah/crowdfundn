'use client';
import React, { useEffect } from 'react';
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

export const ClubHeader: React.FC<ClubHeaderProps> = ({
  clubs,
  currentClub,
  onClubChange,
  onOpenClubDetails,
}) => {
  // Load saved club from localStorage on mount
  useEffect(() => {
    const savedClubSlug = localStorage.getItem('selectedClubSlug');
    if (savedClubSlug && clubs.length > 0) {
      const savedClub = clubs.find((c) => c.slug === savedClubSlug);
      if (savedClub && savedClub.slug !== currentClub.slug) {
        onClubChange(savedClub);
      }
    }
  }, [clubs]); // runs whenever clubs list changes

  // Handle club change and persist selection
  const handleClubChange = (value: string) => {
    const club = clubs.find((c) => c.slug === value);
    if (club) {
      onClubChange(club);
      localStorage.setItem('selectedClubSlug', club.slug);
    }
  };

  return (
    <div className="hidden lg:flex items-center justify-between mb-6 lg:mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Investment Clubs</h1>
        <p className="text-gray-600 mt-1 lg:mt-2 text-sm lg:text-base">
          Manage your club investments and collaborate with members
        </p>
      </div>

      <div className="flex items-center gap-3 lg:gap-4">
        <Select
          value={currentClub?.slug}
          onValueChange={handleClubChange}
        >
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
