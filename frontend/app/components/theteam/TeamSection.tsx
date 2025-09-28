// TeamSection.tsx
import React from 'react';
import { TeamMemberCard } from './TeamMemberCard';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  email: string;
  linkedin?: string;
  level: 'board' | 'lead' | 'member';
}

interface TeamSectionProps {
  title: string;
  subtitle?: string;
  members: TeamMember[];
  level: 'board' | 'department';
}

export const TeamSection = ({
  title,
  subtitle,
  members,
  level,
}: TeamSectionProps) => {
  const getGridCols = () => {
    if (level === 'board') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2
          className={`font-bold text-foreground mb-4 ${level === 'board' ? 'text-4xl' : 'text-3xl'}`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className={`grid ${getGridCols()} gap-6 max-w-7xl mx-auto`}>
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            name={member.name}
            position={member.position}
            image={member.image}
            email={member.email}
            linkedin={member.linkedin}
            level={member.level}
          />
        ))}
      </div>
    </section>
  );
};
