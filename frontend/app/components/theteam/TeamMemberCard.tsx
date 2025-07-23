import { Mail, Linkedin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { StaticImageData } from 'next/image';

interface TeamMemberCardProps {
  name: string;
  position: string;
  department?: string;
  image: StaticImageData;
  email: string;
  linkedin?: string;
  level: 'board' | 'lead' | 'member';
}

export const TeamMemberCard = ({
  name,
  position,
  department,
  image,
  email,
  linkedin,
  level,
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

  const getImageSize = () => {
    return level === 'board' ? 'w-32 h-32' : 'w-24 h-24';
  };

  return (
    <div
      className={`
      ${getCardStyles()}
      p-6 rounded-lg transition-all duration-300 ease-smooth group cursor-pointer
      ${level === 'board' ? 'hover:border-primary/30' : 'hover:border-primary/20'}
    `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={`${getImageSize()} rounded-full overflow-hidden ring-4 ring-white shadow-subtle`}
        >
          <img
            src={image.src}
            alt={`${name} headshot`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
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
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => (window.location.href = `mailto:${email}`)}
          >
            <Mail className="w-4 h-4" />
          </Button>
          {linkedin && (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => window.open(linkedin, '_blank')}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
