// app/components/theteam/TeamMemberCard.tsx
import { Mail, Linkedin, ArrowUpRight } from 'lucide-react';

interface TeamMemberCardProps {
  name: string;
  position: string;
  department?: string;
  image: string;
  email: string;
  linkedin?: string;
  level: 'board' | 'lead' | 'member';
  description?: string;
  expertise?: string[];
  onLearnMore?: () => void;
}

export const TeamMemberCard = ({
  name,
  position,
  department,
  image,
  email,
  linkedin,
  level,
  description,
  expertise,
  onLearnMore,
}: TeamMemberCardProps) => {
  const getCardStyles = () => {
    switch (level) {
      case 'board':
        return 'bg-white border-2 border-green-200 shadow-lg hover:shadow-xl transform hover:scale-105';
      case 'lead':
        return 'bg-white border border-gray-200 shadow-md hover:shadow-lg transform hover:scale-102';
      default:
        return 'bg-white border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-102';
    }
  };

  const truncateDescription = (desc: string, maxLength: number = 100) => {
    if (!desc) return '';
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + '...';
  };

  const handleCardClick = () => {
    if (onLearnMore) {
      onLearnMore();
    }
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={`
        ${getCardStyles()}
        p-6 rounded-lg transition-all duration-300 ease-in-out group cursor-pointer
        ${level === 'board' ? 'hover:border-green-300' : 'hover:border-gray-300'}
        flex flex-col h-full
      `}
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-center text-center space-y-4 flex-1">
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
          <img
            src={image}
            alt={`${name} headshot`}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {/* Learn More Overlay */}
          {description && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <ArrowUpRight className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Learn More</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center w-full">
          <h3
            className={`font-semibold text-gray-900 ${level === 'board' ? 'text-xl' : 'text-lg'}`}
          >
            {name}
          </h3>
          <p
            className={`text-green-600 font-medium ${level === 'board' ? 'text-base' : 'text-sm'}`}
          >
            {position}
          </p>
          {department && <p className="text-gray-500 text-sm">{department}</p>}

          {/* Description Preview */}
          {description && (
            <div className="mt-2">
              <p className="text-gray-600 text-sm text-left leading-relaxed">
                {truncateDescription(description)}
              </p>
              {expertise && expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {expertise.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      +{expertise.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            className="border border-gray-300 hover:border-green-500 hover:bg-green-500 hover:text-white p-2 rounded-lg transition-colors duration-200"
            onClick={(e) =>
              handleButtonClick(
                e,
                () => (window.location.href = `mailto:${email}`),
              )
            }
          >
            <Mail className="w-4 h-4" />
          </button>
          {linkedin && (
            <button
              className="border border-gray-300 hover:border-green-500 hover:bg-green-500 hover:text-white p-2 rounded-lg transition-colors duration-200"
              onClick={(e) =>
                handleButtonClick(e, () => window.open(linkedin, '_blank'))
              }
            >
              <Linkedin className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
