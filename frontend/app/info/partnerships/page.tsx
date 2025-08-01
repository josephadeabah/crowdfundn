const Partners = () => {
  // Partner data arrays
  const financialPartners = [
    {
      title: 'Commercial Banks',
      items: ['Ecobank Ghana', 'UBA Bank Ghana'],
      color: 'text-trust',
    },
    {
      title: 'Mobile Money Operators',
      items: ['Inviting Partners'],
      color: 'text-growth',
    },
    {
      title: 'Payment Processors',
      items: ['PayStack'],
      color: 'text-green-600',
    },
  ];

  const governmentRegulatory = [
    {
      title: 'Regulatory Bodies',
      items: ['Securities and Exchange Commission (SEC Ghana)'],
      color: 'text-trust',
    },
    {
      title: 'Government Agencies',
      items: ['Youth Employment Agency'],
      color: 'text-growth',
    },
  ];

  const technologyPartners = [
    {
      title: 'Cloud Infrastructure',
      items: ['Digital Ocean'],
      color: 'text-trust',
    },
    {
      title: 'Security',
      items: ['Cloudflare'],
      color: 'text-growth',
    },
    {
      title: 'Analytics',
      items: ['Google Analytics', 'Mixpanel', 'Tableau'],
      color: 'text-green-600',
    },
    {
      title: 'Communication',
      items: ['Brevo'],
      color: 'text-growth',
    },
  ];

  const educationalProfessional = [
    {
      title: 'Universities & Research',
      items: ['Centre for Entrepreneurship & SME Development'],
      color: 'text-trust',
    },
    {
      title: 'Professional Services',
      items: ['Inviting Partners'],
      color: 'text-growth',
    },
  ];

  const ecosystemPartners = [
    {
      title: 'Incubators & Accelerators',
      items: ['Inviting Partners'],
      color: 'text-trust',
    },
    {
      title: 'Investment Firms',
      items: ['Inviting Partners'],
      color: 'text-growth',
    },
    {
      title: 'NGOs & Development',
      items: ['Tony Elumelu Foundation'],
      color: 'text-green-600',
    },
  ];

  const mediaPartners = [
    {
      title: 'Traditional Media',
      items: ['Inviting Partners'],
      color: 'text-trust',
    },
    {
      title: 'Digital Media',
      items: ['Inviting Partners'],
      color: 'text-growth',
    },
    {
      title: 'Social Platforms',
      items: ['Facebook', 'Twitter/X', 'LinkedIn', 'WhatsApp Business'],
      color: 'text-green-600',
    },
    {
      title: 'Industry Events',
      items: ['Inviting Partners'],
      color: 'text-growth',
    },
  ];

  const partnershipOpportunities = [
    'Strategic partnerships',
    'Technology integrations',
    'Distribution partnerships',
    'Educational collaborations',
  ];

  // Helper component for rendering partner cards
  type PartnerCardProps = {
    title: string;
    items: string[];
    color: string;
    center?: boolean;
  };

  const PartnerCard: React.FC<PartnerCardProps> = ({
    title,
    items,
    color,
    center = false,
  }) => (
    <div
      className={`bg-card p-6 rounded-lg border ${center ? 'text-center' : ''}`}
    >
      <h3 className={`font-semibold mb-3 ${color}`}>{title}</h3>
      <ul className={`space-y-2 text-sm ${center ? '' : 'list-disc pl-5'}`}>
        {items.map((item, index) => (
          <li key={index}>{center ? item : `${item}`}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary text-center">
            Our Partners
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            BantuHive collaborates with leading institutions, organizations, and
            service providers to create a robust ecosystem for crowdfunding and
            investment in Ghana.
          </p>

          <div className="space-y-12">
            {/* Financial Partners */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">
                Financial Partners
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {financialPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    title={partner.title}
                    items={partner.items}
                    color={partner.color}
                    center={true}
                  />
                ))}
              </div>
            </div>

            {/* Government & Regulatory */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">
                Government & Regulatory
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {governmentRegulatory.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    title={partner.title}
                    items={partner.items}
                    color={partner.color}
                  />
                ))}
              </div>
            </div>

            {/* Technology Partners */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">
                Technology Partners
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {technologyPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    title={partner.title}
                    items={partner.items}
                    color={partner.color}
                    center={true}
                  />
                ))}
              </div>
            </div>

            {/* Educational & Professional */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">
                Educational & Professional
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {educationalProfessional.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    title={partner.title}
                    items={partner.items}
                    color={partner.color}
                  />
                ))}
              </div>
            </div>

            {/* Ecosystem Partners */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">
                Ecosystem Partners
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ecosystemPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    title={partner.title}
                    items={partner.items}
                    color={partner.color}
                  />
                ))}
              </div>
            </div>

            {/* Media & Communication */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">
                Media & Communication
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mediaPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    title={partner.title}
                    items={partner.items}
                    color={partner.color}
                    center={true}
                  />
                ))}
              </div>
            </div>

            {/* Become a Partner */}
            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Become a Partner
              </h2>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-muted-foreground mb-6">
                  Interested in partnering with BantuHive to support Ghana's
                  entrepreneurship ecosystem? We're always looking for strategic
                  partners who share our vision.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Partnership Opportunities:</strong>
                    <ul className="mt-2 space-y-1">
                      {partnershipOpportunities.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Contact Partnership Team:</strong>
                    <p className="mt-2">Email: partnerships@bantuhive.com</p>
                    <p>Phone: +233 (0) 302 123 4567</p>
                    <p>Address: Takoradi, Ghana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
