// TeamMemberCard.tsx
import { Mail, Linkedin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface TeamMemberCardProps {
  name: string;
  position: string;
  department?: string;
  image: string;
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

  return (
    <div
      className={`
      ${getCardStyles()}
      p-6 rounded-lg transition-all duration-300 ease-smooth group cursor-pointer
      ${level === 'board' ? 'hover:border-primary/30' : 'hover:border-primary/20'}
      flex flex-col h-full
    `}
    >
      <div className="flex flex-col items-center text-center space-y-4 flex-1">
        {/* Rectangular Image Container */}
        <div className="w-full aspect-[3/4] overflow-hidden rounded-lg shadow-subtle group-hover:shadow-card transition-shadow duration-300">
          <img
            src={image}
            alt={`${name} headshot`}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="space-y-2 flex-1 flex flex-col justify-center">
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
