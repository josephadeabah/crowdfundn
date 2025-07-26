const Careers = () => {
  const openPositions = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Accra, Ghana',
      type: 'Full-time',
      experience: '3-5 years',
      description:
        'Join our engineering team to build scalable crowdfunding platform features using React, Node.js, and cloud technologies.',
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        '3+ years experience with React and Node.js',
        'Experience with cloud platforms (AWS/Azure)',
        'Knowledge of financial systems and security best practices',
      ],
    },
    {
      title: 'Compliance Officer',
      department: 'Legal & Compliance',
      location: 'Accra, Ghana',
      type: 'Full-time',
      experience: '5-7 years',
      description:
        'Ensure BantuHive maintains the highest standards of regulatory compliance with SEC Ghana and other financial regulations.',
      requirements: [
        "Bachelor's degree in Law, Finance, or related field",
        '5+ years experience in financial services compliance',
        'Knowledge of SEC Ghana regulations and securities law',
        'Professional certification (e.g., CAMS, CISA) preferred',
      ],
    },
    {
      title: 'Investment Analyst',
      department: 'Investment Operations',
      location: 'Accra, Ghana / Remote',
      type: 'Full-time',
      experience: '2-4 years',
      description:
        'Analyze investment opportunities, conduct due diligence, and support investor decision-making on our platform.',
      requirements: [
        "Bachelor's degree in Finance, Economics, or Business",
        '2+ years experience in investment analysis or financial modeling',
        'Strong analytical and quantitative skills',
        'CFA designation or progression preferred',
      ],
    },
    {
      title: 'Community Manager',
      department: 'Marketing & Growth',
      location: 'Accra, Ghana',
      type: 'Full-time',
      experience: '2-3 years',
      description:
        'Build and engage our community of entrepreneurs, investors, and supporters across Ghana and the diaspora.',
      requirements: [
        "Bachelor's degree in Marketing, Communications, or related field",
        '2+ years experience in community management or social media',
        'Excellent written and verbal communication skills in English',
        'Knowledge of local languages (Twi, Ga, Ewe) is a plus',
      ],
    },
  ];

  const benefits = [
    'Competitive salary and equity participation',
    'Comprehensive health insurance',
    'Professional development budget',
    'Flexible working arrangements',
    'Annual learning and conference allowance',
    'Transportation allowance',
    'Free lunch and snacks',
    'Modern office space in East Legon',
  ];

  const values = [
    {
      title: 'Innovation',
      description:
        'We embrace new ideas and technologies to solve real problems for our community.',
    },
    {
      title: 'Transparency',
      description:
        'We operate with openness and honesty in all our interactions and business practices.',
    },
    {
      title: 'Impact',
      description:
        "We measure success by the positive change we create in Ghana's entrepreneurship ecosystem.",
    },
    {
      title: 'Collaboration',
      description:
        'We work together, leveraging diverse perspectives to achieve common goals.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary text-center">
            Join Our Team
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Help us democratize access to capital and build the future of
            crowdfunding in Ghana. Join a team that's passionate about
            empowering entrepreneurs and investors.
          </p>

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-8 text-green-600 text-center">
                Why Work at BantuHive?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-lg border text-center"
                  >
                    <h3 className="font-semibold mb-3 text-trust">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 text-green-600">
                Open Positions
              </h2>
              <div className="space-y-6">
                {openPositions.map((position, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border">
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-xl font-semibold text-foreground">
                            {position.title}
                          </h3>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            {position.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span>📍 {position.location}</span>
                          <span>🏢 {position.department}</span>
                          <span>⏱️ {position.experience}</span>
                        </div>

                        <p className="text-muted-foreground mb-4">
                          {position.description}
                        </p>

                        <div>
                          <h4 className="font-medium mb-2 text-trust">
                            Requirements:
                          </h4>
                          <ul className="space-y-1">
                            {position.requirements.map((req, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-muted-foreground flex items-start"
                              >
                                <span className="text-primary mr-2">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="mb-4">
                          <div className="bg-muted p-4 rounded-lg mb-4">
                            <h4 className="font-medium mb-2">
                              Application Process
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>1. Submit application</div>
                              <div>2. Initial screening</div>
                              <div>3. Technical/case interview</div>
                              <div>4. Final interview</div>
                              <div>5. Reference check</div>
                            </div>
                          </div>
                        </div>

                        <button className="bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 text-green-600 text-center">
                Benefits & Perks
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-card p-4 rounded-lg border text-center"
                  >
                    <p className="text-sm text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Life at BantuHive
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3 text-trust">Our Culture</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We're building more than just a platform – we're creating a
                    movement. Our team is diverse, passionate, and committed to
                    making a real difference in Ghana's economy.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Regular team building activities</li>
                    <li>• Monthly all-hands meetings</li>
                    <li>• Quarterly company retreats</li>
                    <li>• Innovation time (20% for personal projects)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-growth">
                    Growth Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We invest in our people's growth and provide clear career
                    progression paths. Every team member has opportunities to
                    learn, lead, and make an impact.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Mentorship programs</li>
                    <li>• Cross-functional project opportunities</li>
                    <li>• Conference and training sponsorship</li>
                    <li>• Internal mobility and promotion</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 text-green-600 text-center">
                Internship & Graduate Programs
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-trust">
                    Summer Internship Program
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    3-month paid internships for university students across
                    engineering, business, and finance disciplines. Gain
                    real-world experience in fintech and crowdfunding.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• June - August program</li>
                    <li>• Competitive stipend</li>
                    <li>• Mentorship and training</li>
                    <li>• Potential for full-time offers</li>
                  </ul>
                  <button className="bg-trust text-white px-4 py-2 rounded-lg text-sm">
                    Apply for Internship
                  </button>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-growth">
                    Graduate Trainee Program
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    12-month rotational program for recent graduates to gain
                    exposure across different departments and build expertise in
                    financial services.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• 4 x 3-month rotations</li>
                    <li>• Structured learning curriculum</li>
                    <li>• Senior leadership mentoring</li>
                    <li>• Guaranteed permanent role</li>
                  </ul>
                  <button className="bg-growth text-white px-4 py-2 rounded-lg text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-muted p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Don't See Your Role?
              </h2>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-muted-foreground mb-6">
                  We're always looking for talented individuals who share our
                  vision. If you're passionate about fintech and want to make an
                  impact, we'd love to hear from you.
                </p>
                <div className="space-y-4">
                  <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mr-4">
                    Send Us Your Resume
                  </button>
                  <button className="bg-secondary text-green-600-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
                    Join Our Talent Community
                  </button>
                </div>
                <div className="mt-6 text-sm text-muted-foreground">
                  <p>
                    <strong>HR Team:</strong> careers@bantuhive.com
                  </p>
                  <p>
                    <strong>Office:</strong> East Legon, Accra, Ghana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
