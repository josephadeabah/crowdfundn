// components/theteam/MemberDetailModal.tsx
import React from 'react';
import { Mail, Linkedin, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Modal from '../modal/Modal';

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    name: string;
    position: string;
    department?: string;
    image: string;
    email: string;
    linkedin?: string;
    description?: string;
    expertise?: string[];
    education?: string[];
  };
}

export const MemberDetailModal = ({
  isOpen,
  onClose,
  member,
}: MemberDetailModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
        {/* Image Section */}
        <div className="md:w-2/5 relative">
          <img
            src={member.image}
            alt={`${member.name} headshot`}
            className="w-full h-64 md:h-full object-cover object-center"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-primary-foreground/90">{member.position}</p>
            {member.department && (
              <p className="text-primary-foreground/70 text-sm">
                {member.department}
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-8 overflow-y-auto">
          {/* Contact Buttons */}
          <div className="flex space-x-3 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => (window.location.href = `mailto:${member.email}`)}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
            {member.linkedin && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => window.open(member.linkedin, '_blank')}
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </Button>
            )}
          </div>

          {/* Description */}
          {member.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                About
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {member.description}
              </p>
            </div>
          )}

          {/* Expertise */}
          {member.expertise && member.expertise.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {member.education && member.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </h3>
              <ul className="space-y-2">
                {member.education.map((edu, index) => (
                  <li key={index} className="text-muted-foreground text-sm">
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
