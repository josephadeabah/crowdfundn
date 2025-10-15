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
      name: 'Aikins Partu',
      position: 'Board Member',
      image: '/aikins_partu.webp',
      email: 'aikins.partu@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/aikins-partu-6abb9316/',
      level: 'board' as const,
      description: `Aikins Partu is a seasoned development finance professional with over a decade of experience in Ghana’s financial sector, specializing in risk management, compliance, and internal control. He is passionate about strengthening financial systems to prevent credit losses and promote sustainable investment practices.

He currently serves as an Investment Officer at Wangara Green Ventures, where he supports the full investment cycle — from sourcing and analyzing opportunities to conducting due diligence, financial modeling, and portfolio management. Prior to this, Aikins held key leadership roles at GroFin, Options Microfinance Ltd, and GCB Bank PLC, where he managed credit administration, regulatory compliance, and risk oversight.

Aikins holds a Master of Science in Development Finance from the University of Ghana, a Certified Data Protection Supervisor accreditation, and professional certifications from the Association of Certified Compliance Professionals in Africa (ACCPA) and the International Association of Accredited Small Business Consultants (AASBC).

At BantuHive, Aikins contributes his deep expertise in finance, governance, and compliance to ensure responsible investment practices and long-term impact for African communities.`,
      expertise: [
        'Risk Management',
        'Compliance',
        'Internal Control',
        'Development Finance',
        'Investment Analysis',
        'Portfolio Management',
        'Credit Administration',
        'Sustainable Finance',
        'Financial Modeling',
        'Due Diligence',
      ],
      education: [
        'Master of Science in Development Finance, University of Ghana',
        'Certified Data Protection Supervisor',
        'Accredited SME Consultant (ASMEC), International Association of Accredited Small Business Consultants (AASBC)',
        'Certified Compliance Professional, Association of Certified Compliance Professionals in Africa (ACCPA)',
        'Ghana Investment and Securities Industry Certificate, Ghana Investment and Securities Institute',
      ],
    },
    {
      id: '2',
      name: 'Stephen Kweku Asante',
      position: 'Board Member',
      image: '/stephen_kweku_asante.jpg',
      email: 'stephen.asante@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/skasante/',
      level: 'board' as const,
      description: `Stephen Kwaku Asante is an accomplished Chartered Accountant with over a decade of progressive experience in financial management, auditing, and corporate governance. He currently serves as the Head of Finance at the Council for Scientific and Industrial Research (CSIR), Ghana, where he oversees financial operations, budgeting, and compliance across multiple divisions.

Stephen has a proven track record in advising executive leadership on fiscal policy, managing institutional funds, and ensuring regulatory and donor compliance. His career spans roles at the Community Water and Sanitation Agency, AKAD Microfinance Ltd, and various institutes within the CSIR, where he honed his expertise in financial reporting, project finance, and internal auditing.

He holds a Master of Business Administration (MBA) in Accounting and Finance from the University of Professional Studies, Accra, and a Financial Modeling & Valuation Analyst (FMVA®) certification from the Corporate Finance Institute (CFI).

Stephen brings strategic financial insight and governance experience to BantuHive’s board, supporting its mission to build a transparent and sustainable crowdfunding ecosystem across Africa.`,
      expertise: [
        'Financial Management',
        'Auditing',
        'Corporate Governance',
        'Budgeting',
        'Financial Reporting',
        'Project Finance',
      ],
      education: [
        'Master of Business Administration (MBA) in Accounting and Finance, University of Professional Studies, Accra',
        'Financial Modeling & Valuation Analyst (FMVA®) certification, Corporate Finance Institute (CFI)',
        'Chartered Accountant',
      ],
    },
    {
      id: '3',
      name: 'Joseph Adeabah',
      position: 'Board Member',
      image: ceoHeadshot,
      email: 'joseph.adeabah@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/joseph-835977a5/',
      level: 'board' as const,
      description: `Visionary leader with a passion for innovation and technology. Joseph brings extensive experience in software development and strategic business planning, driving our company's mission to deliver cutting-edge solutions.`,
      expertise: [
        'Software Architecture',
        'Strategic Planning',
        'Team Leadership',
        'Product Development',
      ],
      education: [
        'BSc Computer Science, University of Energy and Natural Resources',
      ],
    },
    {
      id: '4',
      name: 'Nqoba Manana',
      position: 'Board Member',
      image: nqobaMananaHeadshot,
      email: 'nqoba.manana@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/nqoba-g-manana/',
      level: 'board' as const,
      description: `Experienced operations leader with a track record of optimizing business processes and driving operational excellence. Nqoba specializes in scaling operations and building high-performing teams.`,
      expertise: [
        'Operations Management',
        'Process Optimization',
        'Team Building',
        'Strategic Execution',
      ],
      education: ['MBA Strategy', 'BCom Finance, University of Pretoria'],
    },
  ];

  const executiveLeadership = [
    {
      id: '5',
      name: 'Joseph Adeabah',
      position: 'Chief Executive Officer',
      image: ceoHeadshot,
      email: 'joseph.adeabah@bantuhive.com',
      linkedin: 'https://www.linkedin.com/in/joseph-835977a5/',
      level: 'lead' as const,
      description:
        'As CEO, Joseph provides strategic direction and leadership to drive company growth and innovation. With over 10 years in the tech industry, he is committed to building products that make a meaningful impact.',
      expertise: [
        'Executive Leadership',
        'Product Strategy',
        'Business Development',
        'Innovation Management',
      ],
      education: [
        'BSc Computer Science, University of Energy and Natural Resources',
      ],
    },
    {
      id: '6',
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
      education: ['MBA Strategy', 'BCom Finance, University of Pretoria'],
    },
    {
      id: '7',
      name: 'Member Pending',
      position: 'Chief Risk Officer',
      image: ctoHeadshot,
      email: 'cro@bantuhive.com',
      linkedin: 'https://linkedin.com/in/cro',
      level: 'lead' as const,
    },
    {
      id: '8',
      name: 'Member Pending',
      position: 'Chief Financial Officer',
      image: ctoHeadshot,
      email: 'sarah.rodriguez@company.com',
      linkedin: 'https://linkedin.com/in/sarahrodriguez',
      level: 'lead' as const,
    },
  ];

  const operationsTeam = [
    {
      id: '9',
      name: 'Member Pending',
      position: 'Human Resources Manager',
      image: cooHeadshot,
      email: 'hr@company.com',
      linkedin: 'https://linkedin.com/in/hrmanager',
      level: 'lead' as const,
    },
    {
      id: '10',
      name: 'Member Pending',
      position: 'Administrative Assistant',
      image: cooHeadshot,
      email: 'admin@company.com',
      level: 'member' as const,
    },
    {
      id: '11',
      name: 'Sadat Adams',
      position: 'Public Relations Specialist',
      image: cooHeadshot,
      email: 'sadat.adams@bantuhive.com',
      level: 'member' as const,
    },
    {
      id: '12',
      name: 'Member Pending',
      position: 'Operations Coordinator',
      image: cooHeadshot,
      email: 'om@company.com',
      level: 'member' as const,
    },
  ];

  const marketingTeam = [
    {
      id: '13',
      name: 'Member Pending',
      position: 'Marketing Director',
      image: marketingLead,
      email: 'emma.watson@company.com',
      linkedin: 'https://linkedin.com/in/emmawatson',
      level: 'lead' as const,
    },
    {
      id: '14',
      name: 'Member Pending',
      position: 'Digital Marketing Manager',
      image: marketingLead,
      email: 'alex.johnson@company.com',
      level: 'member' as const,
    },
    {
      id: '15',
      name: 'Member Pending',
      position: 'Content Marketing Specialist',
      image: marketingLead,
      email: 'lisa.park@company.com',
      level: 'member' as const,
    },
    {
      id: '16',
      name: 'Member Pending',
      position: 'Community Manager',
      image: marketingLead,
      email: 'james.wilson@company.com',
      level: 'member' as const,
    },
  ];

  const engineeringTeam = [
    {
      id: '17',
      name: 'Member Pending',
      position: 'Engineering Director',
      image: ctoHeadshot,
      email: 'maria.garcia@company.com',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      level: 'lead' as const,
    },
    {
      id: '18',
      name: 'Member Pending',
      position: 'Senior Software Engineer',
      image: ctoHeadshot,
      email: 'tom.anderson@company.com',
      level: 'member' as const,
    },
    {
      id: '19',
      name: 'Member Pending',
      position: 'Backend Developer',
      image: marketingLead,
      email: 'jennifer.lee@company.com',
      level: 'member' as const,
    },
    {
      id: '20',
      name: 'Member Pending',
      position: 'Frontend Developer',
      image: marketingLead,
      email: 'jennifer.lee@company.com',
      level: 'member' as const,
    },
  ];

  const legalTeam = [
    {
      id: '21',
      name: 'Member Pending',
      position: 'Legal Director',
      image: legalDirector,
      email: 'catherine.foster@company.com',
      linkedin: 'https://linkedin.com/in/catherinefoster',
      level: 'lead' as const,
    },
    {
      id: '22',
      name: 'Member Pending',
      position: 'Senior Administrative Associate',
      image: legalCounsel,
      email: 'mark.stevens@company.com',
      level: 'member' as const,
    },
    {
      id: '23',
      name: 'Member Pending',
      position: 'Compliance Manager',
      image: legalDirector,
      email: 'rachel.kim@company.com',
      level: 'member' as const,
    },
    {
      id: '24',
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
      <div className="bg-green-50 text-gray-800 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Mission Statement */}
            <div className="mb-10">
              <p className="text-2xl font-bold leading-relaxed mb-4">
                We're on a mission to democratize access to funding and provide
                all types of investors with exclusive opportunities to invest in
                exciting early-stage and growth-stage African business
                opportunities that were previously inaccessible.
              </p>
            </div>

            {/* Vision Statement */}
            <div className="mb-10">
              <p className="text-xl font-semibold text-gray-700 leading-relaxed">
                Our Vision is to become a beacon of Africa's economic
                transformation by proving the continent's innovation power and
                enabling an influx of local and global investment into African
                startups.
              </p>
            </div>

            {/* Team Introduction */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <p className="text-lg text-gray-600 italic">
                Our diverse team of talented professionals brings together
                expertise, innovation, and passion to drive Africa's economic
                transformation through accessible funding opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Board of Directors */}
        <TeamSection
          title="Board of Directors"
          subtitle="Visionary leaders shaping our strategic direction and driving Africa's investment revolution"
          members={boardMembers}
          level="board"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Executive Leadership */}
        <TeamSection
          title="Executive Leadership"
          subtitle="Senior executives driving operational excellence and strategic execution across Africa's investment landscape"
          members={executiveLeadership}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>
        {/* Operations Team */}
        <TeamSection
          title="Operations Team"
          subtitle="Ensuring smooth operations and exceptional service delivery across our investment platform"
          members={operationsTeam}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Engineering Team */}
        <TeamSection
          title="Engineering Team"
          subtitle="Building innovative investment solutions with cutting-edge technology and best practices"
          members={engineeringTeam}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Marketing Team */}
        <TeamSection
          title="Marketing Team"
          subtitle="Crafting compelling stories about African innovation and driving growth through strategic marketing"
          members={marketingTeam}
          level="department"
          onMemberClick={handleMemberClick}
        />

        {/* Separator */}
        <div className="border-t border-gray-300 my-16"></div>

        {/* Legal Team */}
        <TeamSection
          title="Legal Team"
          subtitle="Ensuring regulatory compliance and providing strategic legal guidance for sustainable growth across Africa"
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
            We're always looking for talented individuals who share our passion
            for transforming Africa's investment landscape. If you want to be
            part of a dynamic team that's democratizing funding access across
            the continent, check out our current job openings and apply today!
            Or send us your CV at careers@bantuhive.com
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
