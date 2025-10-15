import React from 'react';
import { Mail, Linkedin, GraduationCap, Award, X } from 'lucide-react';
import Modal from '../modal/Modal';

interface TeamMember {
  name: string;
  position: string;
  department?: string;
  image: string;
  email: string;
  linkedin?: string;
  description?: string;
  expertise?: string[];
  education?: string[];
}

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}

export const MemberDetailModal = ({
  isOpen,
  onClose,
  member,
}: MemberDetailModalProps) => {
  if (!member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xxlarge"
      closeOnBackdropClick={true}
    >
      <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] overflow-hidden">
        {/* Close Button - Mobile Only */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-50 bg-white/90 rounded-full p-2 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="md:w-2/5 relative min-h-64 md:min-h-full">
          <img
            src={member.image}
            alt={`${member.name} headshot`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-1">{member.name}</h2>
            <p className="text-white/90 text-base md:text-lg mb-1">{member.position}</p>
            {member.department && (
              <p className="text-white/70 text-sm">{member.department}</p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-4 md:p-6 overflow-y-auto">
          {/* Contact Buttons */}
          <div className="flex space-x-3 mb-6">
            <button
              className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex-1 md:flex-none justify-center"
              onClick={() => (window.location.href = `mailto:${member.email}`)}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            {member.linkedin && (
              <button
                className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex-1 md:flex-none justify-center"
                onClick={() => window.open(member.linkedin, '_blank')}
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </button>
            )}
          </div>

          {/* Description */}
          {member.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                About
              </h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-sm">
                {member.description}
              </p>
            </div>
          )}

          {/* Expertise */}
          {member.expertise && member.expertise.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm break-words max-w-full"
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
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education
              </h3>
              <ul className="space-y-3">
                {member.education.map((edu, index) => (
                  <li 
                    key={index} 
                    className="text-gray-600 text-base md:text-sm leading-relaxed bg-gray-50 p-3 rounded-lg"
                  >
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