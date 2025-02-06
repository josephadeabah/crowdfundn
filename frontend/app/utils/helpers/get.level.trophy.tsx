import BronzeCupIcon from '@/app/components/icons/BronzeCupIcon';
import DiamondCupIcon from '@/app/components/icons/DiamondCupIcon';
import GoldCupIcon from '@/app/components/icons/GoldCupIcon';
import SilverCupIcon from '@/app/components/icons/SilverCupIcon';

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
    return <span className="w-8 h-8">😞 You can do better!</span>; // Sad emoji as a fallback
  }
};
