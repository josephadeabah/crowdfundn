// TeamMemberCard.tsx - Updated version
import { Mail, Linkedin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

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
        return 'bg-gradient-card border-2 border-primary/20 shadow-card-hover transform hover:scale-105';
      case 'lead':
        return 'bg-gradient-card border border-primary/10 shadow-card hover:shadow-card-hover transform hover:scale-102';
      default:
        return 'bg-card border border-border shadow-subtle hover:shadow-card transform hover:scale-102';
    }
  };

  const truncateDescription = (desc: string, maxLength: number = 100) => {
    if (desc.length <= maxLength) return desc;
    return desc.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`
      ${getCardStyles()}
      p-6 rounded-lg transition-all duration-300 ease-smooth group cursor-pointer
      ${level === 'board' ? 'hover:border-primary/30' : 'hover:border-primary/20'}
      flex flex-col h-full
    `}
      onClick={onLearnMore}
    >
      <div className="flex flex-col items-center text-center space-y-4 flex-1">
        {/* Rectangular Image Container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-subtle group-hover:shadow-card transition-shadow duration-300">
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
            className={`font-semibold text-foreground ${level === 'board' ? 'text-xl' : 'text-lg'}`}
          >
            {name}
          </h3>
          <p
            className={`text-primary font-medium ${level === 'board' ? 'text-base' : 'text-sm'}`}
          >
            {position}
          </p>
          {department && (
            <p className="text-muted-foreground text-sm">{department}</p>
          )}

          {/* Description Preview */}
          {description && (
            <div className="mt-2">
              <p className="text-muted-foreground text-sm text-left leading-relaxed">
                {truncateDescription(description)}
              </p>
              {expertise && expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {expertise.length > 3 && (
                    <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                      +{expertise.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `mailto:${email}`;
            }}
          >
            <Mail className="w-4 h-4" />
          </Button>
          {linkedin && (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.open(linkedin, '_blank');
              }}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
