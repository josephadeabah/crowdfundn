'use client';
import { TeamSection } from '@/app/components/theteam/TeamSection';

const Teams = () => {
  const ceoHeadshot = '/avatar-default.png';
  const ctoHeadshot = '/avatar-default.png';
  const cfoHeadshot = '/avatar-default.png';
  const cooHeadshot = '/avatar-default.png';
  const marketingLead = '/avatar-default.png';
  const legalDirector = '/avatar-default.png';
  const legalCounsel = '/avatar-default.png';
  const boardMembers = [
    {
      id: '1',
      name: 'John Harrison',
      position: 'Chairman of the Board',
      image: ceoHeadshot,
      email: 'john.harrison@company.com',
      linkedin: 'https://linkedin.com/in/johnharrison',
      level: 'board' as const,
    },
    {
      id: '2',
      name: 'Margaret Thompson',
      position: 'Independent Director',
      image: legalDirector,
      email: 'margaret.thompson@company.com',
      linkedin: 'https://linkedin.com/in/margaretthompson',
      level: 'board' as const,
    },
    {
      id: '3',
      name: 'Robert Chang',
      position: 'Board Member',
      image: cfoHeadshot,
      email: 'robert.chang@company.com',
      linkedin: 'https://linkedin.com/in/robertchang',
      level: 'board' as const,
    },
  ];

  const executiveLeadership = [
    {
      id: '4',
      name: 'Michael Chen',
      position: 'Chief Executive Officer',
      image: ceoHeadshot,
      email: 'michael.chen@company.com',
      linkedin: 'https://linkedin.com/in/michaelchen',
      level: 'lead' as const,
    },
    {
      id: '5',
      name: 'Jessica Martinez',
      position: 'Chief Operating Officer',
      image: cooHeadshot,
      email: 'jessica.martinez@company.com',
      linkedin: 'https://linkedin.com/in/jessicamartinez',
      level: 'lead' as const,
    },
    {
      id: '6',
      name: 'Sarah Rodriguez',
      position: 'Chief Technology Officer',
      image: ctoHeadshot,
      email: 'sarah.rodriguez@company.com',
      linkedin: 'https://linkedin.com/in/sarahrodriguez',
      level: 'lead' as const,
    },
    {
      id: '7',
      name: 'Sarah Rodriguez',
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
      name: 'Emma Watson',
      position: 'Marketing Director',
      image: marketingLead,
      email: 'emma.watson@company.com',
      linkedin: 'https://linkedin.com/in/emmawatson',
      level: 'lead' as const,
    },
    {
      id: '11',
      name: 'Alex Johnson',
      position: 'Digital Marketing Manager',
      image: marketingLead,
      email: 'alex.johnson@company.com',
      level: 'member' as const,
    },
    {
      id: '12',
      name: 'Lisa Park',
      position: 'Content Marketing Specialist',
      image: marketingLead,
      email: 'lisa.park@company.com',
      level: 'member' as const,
    },
    {
      id: '13',
      name: 'James Wilson',
      position: 'Brand Manager',
      image: marketingLead,
      email: 'james.wilson@company.com',
      level: 'member' as const,
    },
  ];

  const engineeringTeam = [
    {
      id: '7',
      name: 'Dr. Maria Garcia',
      position: 'Engineering Director',
      image: ctoHeadshot,
      email: 'maria.garcia@company.com',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      level: 'lead' as const,
    },
    {
      id: '8',
      name: 'Tom Anderson',
      position: 'Senior Software Engineer',
      image: ceoHeadshot,
      email: 'tom.anderson@company.com',
      level: 'member' as const,
    },
    {
      id: '9',
      name: 'Jennifer Lee',
      position: 'Frontend Developer',
      image: marketingLead,
      email: 'jennifer.lee@company.com',
      level: 'member' as const,
    },
    {
      id: '10',
      name: 'Jennifer Lee',
      position: 'Frontend Developer',
      image: marketingLead,
      email: 'jennifer.lee@company.com',
      level: 'member' as const,
    },
  ];

  const legalTeam = [
    {
      id: '14',
      name: 'Catherine Foster',
      position: 'Legal Director',
      image: legalDirector,
      email: 'catherine.foster@company.com',
      linkedin: 'https://linkedin.com/in/catherinefoster',
      level: 'lead' as const,
    },
    {
      id: '15',
      name: 'Mark Stevens',
      position: 'Senior Legal Counsel',
      image: legalCounsel,
      email: 'mark.stevens@company.com',
      level: 'member' as const,
    },
    {
      id: '16',
      name: 'Rachel Kim',
      position: 'Compliance Manager',
      image: legalDirector,
      email: 'rachel.kim@company.com',
      level: 'member' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="bg-bantu-green text-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Our diverse team of talented professionals brings together
              expertise, innovation, and passion to drive our company's success
              and deliver exceptional results for our clients.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6">
        {/* Board of Directors */}
        <TeamSection
          title="Board of Directors"
          subtitle="Visionary leaders shaping our company's strategic direction and future growth"
          members={boardMembers}
          level="board"
        />

        {/* Separator */}
        <div className="border-t border-border/50 my-16"></div>

        {/* Executive Leadership */}
        <TeamSection
          title="Executive Leadership"
          subtitle="Senior executives driving operational excellence and strategic execution"
          members={executiveLeadership}
          level="department"
        />

        {/* Separator */}
        <div className="border-t border-border/50 my-16"></div>

        {/* Engineering Team */}
        <TeamSection
          title="Engineering Team"
          subtitle="Building innovative solutions with cutting-edge technology and best practices"
          members={engineeringTeam}
          level="department"
        />

        {/* Separator */}
        <div className="border-t border-border/50 my-16"></div>

        {/* Marketing Team */}
        <TeamSection
          title="Marketing Team"
          subtitle="Crafting compelling brand stories and driving growth through strategic marketing initiatives"
          members={marketingTeam}
          level="department"
        />

        {/* Separator */}
        <div className="border-t border-border/50 my-16"></div>

        {/* Legal Team */}
        <TeamSection
          title="Legal Team"
          subtitle="Ensuring compliance and providing strategic legal guidance for sustainable growth"
          members={legalTeam}
          level="department"
        />
      </div>

      {/* Footer */}
      <div className="bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Want to Join Our Team?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion
            for innovation and excellence.
          </p>
          <button
            className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-medium hover:shadow-card-hover transition-all duration-300 transform hover:scale-105"
            onClick={() => (window.location.href = '/careers')}
          >
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams;
