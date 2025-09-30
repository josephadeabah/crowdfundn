'use client';
import { useState } from 'react';
import { TeamSection } from '@/app/components/theteam/TeamSection';
import { MemberDetailModal } from '@/app/components/theteam/MemberDetailModal';

const Teams = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const ceoHeadshot = '/joe_abe_ansah.png';
  const ctoHeadshot = '/avatar-default.png';
  const cfoHeadshot = '/avatar-default.png';
  const nqobaMananaHeadshot = '/Nqoba.JPG';
  const cooHeadshot = '/avatar-default.png';
  const marketingLead = '/avatar-default.png';
  const legalDirector = '/avatar-default.png';
  const legalCounsel = '/avatar-default.png';

  // Update your member data with descriptions, expertise, and education
  const boardMembers = [
    {
      id: '1',
      name: 'Member Pending',
      position: 'Chairman of the Board',
      image: ctoHeadshot,
      email: 'john.harrison@company.com',
      linkedin: 'https://linkedin.com/in/',
      level: 'board' as const,
      description:
        'Seasoned executive with over 20 years of experience in strategic leadership and corporate governance. Previously served as CEO of multiple successful tech startups and brings extensive knowledge in scaling businesses globally.',
      expertise: [
        'Strategic Planning',
        'Corporate Governance',
        'Business Development',
        'Investment Strategy',
      ],
      education: [
        'MBA, Harvard Business School',
        'BSc Computer Science, Stanford University',
      ],
    },
    {
      id: '2',
      name: 'Joseph Adeabah',
      position: 'Secretary of the Board',
      image: ceoHeadshot,
      email: 'joseph.adeabah@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/joseph-835977a5/',
      level: 'board' as const,
      description:
        "Visionary leader with a passion for innovation and technology. Joseph brings extensive experience in software development and strategic business planning, driving our company's mission to deliver cutting-edge solutions.",
      expertise: [
        'Software Architecture',
        'Strategic Planning',
        'Team Leadership',
        'Product Development',
      ],
      education: [
        'MSc Computer Science, MIT',
        'BSc Engineering, University of Ghana',
      ],
    },
    {
      id: '3',
      name: 'Nqoba Manana',
      position: 'Board Member',
      image: nqobaMananaHeadshot,
      email: 'nqoba.manana@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/nqoba-g-manana/',
      level: 'board' as const,
      description:
        'Experienced operations leader with a track record of optimizing business processes and driving operational excellence. Nqoba specializes in scaling operations and building high-performing teams.',
      expertise: [
        'Operations Management',
        'Process Optimization',
        'Team Building',
        'Strategic Execution',
      ],
      education: ['MBA, INSEAD', 'BCom Finance, University of Pretoria'],
    },
  ];

  const executiveLeadership = [
    {
      id: '4',
      name: 'Joseph Adeabah',
      position: 'Chief Executive Officer',
      image: ceoHeadshot,
      email: 'joseph.adeabah@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/joseph-835977a5/',
      level: 'lead' as const,
      description:
        'As CEO, Joseph provides strategic direction and leadership to drive company growth and innovation. With over 15 years in the tech industry, he is committed to building products that make a meaningful impact.',
      expertise: [
        'Executive Leadership',
        'Product Strategy',
        'Business Development',
        'Innovation Management',
      ],
      education: [
        'MSc Computer Science, MIT',
        'Executive Program, Stanford Graduate School of Business',
      ],
    },
    {
      id: '5',
      name: 'Nqoba Manana',
      position: 'Chief Operating Officer',
      image: nqobaMananaHeadshot,
      email: 'nqoba.manana@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/nqoba-g-manana/',
      level: 'lead' as const,
      description:
        'Experienced operations leader with a track record of optimizing business processes and driving operational excellence. Nqoba specializes in scaling operations and building high-performing teams.',
      expertise: [
        'Operations Management',
        'Process Optimization',
        'Team Building',
        'Strategic Execution',
      ],
      education: ['MBA, INSEAD', 'BCom Finance, University of Pretoria'],
    },
    {
      id: '6',
      name: 'Sadat Adams',
      position: 'Partner Relationship Manager',
      image: ctoHeadshot,
      email: 'sadat.adams@bantuhive.com',
      linkedin: 'https://linkedin.com/in/sadatadams',
      level: 'lead' as const,
    },
    {
      id: '7',
      name: 'Member Pending',
      position: 'Chief Financial Officer',
      image: ctoHeadshot,
      email: 'sarah.rodriguez@company.com',
      linkedin: 'https://linkedin.com/in/sarahrodriguez',
      level: 'lead' as const,
    },
  ];

  const marketingTeam = [
    {
      id: '10',
      name: 'Member Pending',
      position: 'Marketing Director',
      image: marketingLead,
      email: 'emma.watson@company.com',
      linkedin: 'https://linkedin.com/in/emmawatson',
      level: 'lead' as const,
    },
    {
      id: '11',
      name: 'Member Pending',
      position: 'Digital Marketing Manager',
      image: marketingLead,
      email: 'alex.johnson@company.com',
      level: 'member' as const,
    },
    {
      id: '12',
      name: 'Member Pending',
      position: 'Content Marketing Specialist',
      image: marketingLead,
      email: 'lisa.park@company.com',
      level: 'member' as const,
    },
    {
      id: '13',
      name: 'Member Pending',
      position: 'Brand Manager',
      image: marketingLead,
      email: 'james.wilson@company.com',
      level: 'member' as const,
    },
  ];

  const engineeringTeam = [
    {
      id: '14',
      name: 'Member Pending',
      position: 'Engineering Director',
      image: ctoHeadshot,
      email: 'maria.garcia@company.com',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      level: 'lead' as const,
    },
    {
      id: '15',
      name: 'Member Pending',
      position: 'Senior Software Engineer',
      image: ctoHeadshot,
      email: 'tom.anderson@company.com',
      level: 'member' as const,
    },
    {
      id: '16',
      name: 'Member Pending',
      position: 'Backend Developer',
      image: marketingLead,
      email: 'jennifer.lee@company.com',
      level: 'member' as const,
    },
    {
      id: '17',
      name: 'Member Pending',
      position: 'Frontend Developer',
      image: marketingLead,
      email: 'jennifer.lee@company.com',
      level: 'member' as const,
    },
  ];

  const legalTeam = [
    {
      id: '18',
      name: 'Member Pending',
      position: 'Legal Director',
      image: legalDirector,
      email: 'catherine.foster@company.com',
      linkedin: 'https://linkedin.com/in/catherinefoster',
      level: 'lead' as const,
    },
    {
      id: '19',
      name: 'Member Pending',
      position: 'Senior Administrative Associate',
      image: legalCounsel,
      email: 'mark.stevens@company.com',
      level: 'member' as const,
    },
    {
      id: '20',
      name: 'Member Pending',
      position: 'Compliance Manager',
      image: legalDirector,
      email: 'rachel.kim@company.com',
      level: 'member' as const,
    },
    {
      id: '21',
      name: 'Member Pending',
      position: 'Investment Associate',
      image: legalDirector,
      email: 'susan.anaman@company.com',
      level: 'member' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Our diverse team of talented professionals brings together
              expertise, innovation, and passion to drive our company&apos;s
              success and deliver exceptional results for you.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Board of Directors */}
        <TeamSection
          title="Board of Directors"
          subtitle="Visionary leaders shaping our company's strategic direction and future growth"
          members={boardMembers}
          level="board"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Executive Leadership */}
        <TeamSection
          title="Executive Leadership"
          subtitle="Senior executives driving operational excellence and strategic execution"
          members={executiveLeadership}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Engineering Team */}
        <TeamSection
          title="Engineering Team"
          subtitle="Building innovative solutions with cutting-edge technology and best practices"
          members={engineeringTeam}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Marketing Team */}
        <TeamSection
          title="Marketing Team"
          subtitle="Crafting compelling brand stories and driving growth through strategic marketing initiatives"
          members={marketingTeam}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Legal Team */}
        <TeamSection
          title="Legal Team"
          subtitle="Ensuring compliance and providing strategic legal guidance for sustainable growth"
          members={legalTeam}
          level="department"
          onMemberClick={handleMemberClick}
        />
      </div>

      {/* Member Detail Modal */}
      <MemberDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        member={selectedMember}
      />

      {/* Footer */}
      <div className="bg-gray-100 py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Want to Join Our Team?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals who share our
            passion for innovation and excellence.
          </p>
          <button
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => (window.location.href = '/info/careers')}
          >
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams;
