import BronzeCupIcon from '@/app/components/icons/BronzeCupIcon';
import DiamondCupIcon from '@/app/components/icons/DiamondCupIcon';
import GoldCupIcon from '@/app/components/icons/GoldCupIcon';
import SilverCupIcon from '@/app/components/icons/SilverCupIcon';
import VerifiedBadgeIcon from '@/app/components/icons/VerifiedBadgeIcon';

// Function to determine the cup icon based on score
export const getCupIcon = (level: string): JSX.Element => {
  if (level === 'Diamond') {
    return <DiamondCupIcon className="w-8 h-8" />;
  } else if (level === 'Gold') {
    return <GoldCupIcon className="w-8 h-8" />;
  } else if (level === 'Silver') {
    return <SilverCupIcon className="w-8 h-8" />;
  } else if (level === 'Bronze') {
    return <BronzeCupIcon className="w-8 h-8" />;
  } else {
    return (
      <span className="flex items-center gap-1 text-gray-500 text-sm sm:text-base">
        <span className="text-lg sm:text-xl">😞</span>
        <span className="hidden sm:inline">You can do better!</span>
      </span>
    );
  }
};

export const getVerifiedBadge = (level: string, iconSize?: number): JSX.Element | null => {
  if (level === 'Diamond') {
    return <VerifiedBadgeIcon color="#00FF00" size={iconSize} />; // Green for Diamond
  } else if (level === 'Gold') {
    return <VerifiedBadgeIcon color="#FFD700" size={iconSize} />; // Gold for Gold
  } else if (level === 'Silver') {
    return <VerifiedBadgeIcon color="#CD7F32" size={iconSize} />; // Silver for Silver
  } else if (level === 'Bronze') {
    return <VerifiedBadgeIcon color="#C0C0C0" size={iconSize} />; // Bronze for Bronze
  } else {
    return null; // Don't show anything if no level is provided
  }
};
