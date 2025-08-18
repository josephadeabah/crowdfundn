import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Users,
  Target,
  Award,
  Heart,
  TrendingUp,
  MessageCircle,
  Calendar,
  Clock,
  Star,
} from 'lucide-react';

const Mentorship = () => {
  const mentorshipPrograms = [
    {
      id: 1,
      title: '1-on-1 Strategic Mentorship',
      duration: '6 months',
      format: 'Individual',
      commitment: '2 hours/month',
      price: 'GHS 2,000',
      maxMentees: 5,
      currentMentees: 3,
      category: 'Business Strategy',
      description:
        'Personalized mentorship focused on strategic business development and growth planning.',
      includes: [
        'Monthly 2-hour sessions',
        'Unlimited email support',
        'Business plan review',
        'Goal setting & tracking',
        'Network introductions',
        'Resource sharing',
      ],
      mentor: {
        name: 'Dr. Kwame Asante',
        title: 'Serial Entrepreneur',
        experience: '15+ years',
        companies: 3,
        exitValue: 'GHS 50M+',
        expertise: ['Scaling', 'Fundraising', 'Market Entry', 'Team Building'],
        bio: 'Built and exited three successful African startups, now dedicating time to mentoring the next generation.',
      },
      outcomes: [
        'Clear business strategy',
        'Growth roadmap',
        'Investor readiness',
        'Leadership development',
      ],
    },
    {
      id: 2,
      title: 'Peer Circle Mentorship',
      duration: '3 months',
      format: 'Group (6-8 entrepreneurs)',
      commitment: '3 hours/month',
      price: 'GHS 800',
      maxMentees: 8,
      currentMentees: 6,
      category: 'Peer Learning',
      description:
        'Group mentorship program where entrepreneurs learn from each other under expert guidance.',
      includes: [
        'Monthly group sessions',
        'Peer accountability partners',
        'Group challenges',
        'Resource sharing',
        'Expert facilitation',
        'Alumni network access',
      ],
      mentor: {
        name: 'Sarah Okonkwo',
        title: 'Growth & Marketing Expert',
        experience: '10+ years',
        companies: 2,
        exitValue: 'GHS 25M+',
        expertise: ['Marketing', 'Growth Hacking', 'Team Building', 'Culture'],
        bio: 'Former marketing director at top African tech companies, specializing in user acquisition and retention.',
      },
      outcomes: [
        'Peer network',
        'Accountability system',
        'Shared learning',
        'Problem-solving skills',
      ],
    },
    {
      id: 3,
      title: 'Industry-Specific Mentorship',
      duration: '4 months',
      format: 'Small Group (3-4 entrepreneurs)',
      commitment: '2.5 hours/month',
      price: 'GHS 1,200',
      maxMentees: 4,
      currentMentees: 2,
      category: 'FinTech',
      description:
        'Specialized mentorship for entrepreneurs in specific industries like FinTech, AgriTech, HealthTech.',
      includes: [
        'Industry-focused sessions',
        'Regulatory guidance',
        'Technical mentorship',
        'Investor introductions',
        'Partnership opportunities',
        'Market insights',
      ],
      mentor: {
        name: 'Alex Tumusiime',
        title: 'FinTech Pioneer',
        experience: '12+ years',
        companies: 4,
        exitValue: 'GHS 75M+',
        expertise: ['FinTech', 'Payments', 'Regulation', 'Product Development'],
        bio: 'Co-founded leading African payment platforms, expert in financial technology and regulatory compliance.',
      },
      outcomes: [
        'Industry expertise',
        'Regulatory compliance',
        'Technical knowledge',
        'Industry connections',
      ],
    },
    {
      id: 4,
      title: 'Women Entrepreneur Mentorship',
      duration: '6 months',
      format: 'Individual + Group',
      commitment: '3 hours/month',
      price: 'GHS 1,500',
      maxMentees: 6,
      currentMentees: 4,
      category: 'Women-Focused',
      description:
        'Mentorship program specifically designed for women entrepreneurs, addressing unique challenges and opportunities.',
      includes: [
        'Individual monthly sessions',
        "Women's circle meetings",
        'Work-life balance coaching',
        'Confidence building',
        'Network building',
        'Leadership development',
      ],
      mentor: {
        name: 'Grace Nakimera',
        title: "Women's Business Leader",
        experience: '13+ years',
        companies: 2,
        exitValue: 'GHS 40M+',
        expertise: [
          'Leadership',
          'Team Building',
          'Work-life Balance',
          'Fundraising',
        ],
        bio: 'Successful female entrepreneur and advocate for women in business across Africa.',
      },
      outcomes: [
        'Leadership confidence',
        'Work-life integration',
        "Women's network",
        'Business growth',
      ],
    },
    {
      id: 5,
      title: 'Young Entrepreneur Fast Track',
      duration: '3 months',
      format: 'Group (8-10 young entrepreneurs)',
      commitment: '4 hours/month',
      price: 'GHS 600',
      maxMentees: 10,
      currentMentees: 7,
      category: 'Youth-Focused',
      description:
        'Intensive mentorship program for entrepreneurs under 30, focusing on rapid skill development and network building.',
      includes: [
        'Weekly group sessions',
        'Skill development workshops',
        'Pitch competitions',
        'Networking events',
        'Peer mentoring',
        'Resource library access',
      ],
      mentor: {
        name: 'Chidi Okonkwo',
        title: 'Young Entrepreneur Advocate',
        experience: '8+ years',
        companies: 3,
        exitValue: 'GHS 20M+',
        expertise: [
          'Youth Development',
          'Technology',
          'Innovation',
          'Networking',
        ],
        bio: 'Started first company at 19, passionate about empowering the next generation of African entrepreneurs.',
      },
      outcomes: [
        'Accelerated learning',
        'Youth network',
        'Confidence building',
        'Quick wins',
      ],
    },
    {
      id: 6,
      title: 'Social Impact Mentorship',
      duration: '5 months',
      format: 'Individual',
      commitment: '2.5 hours/month',
      price: 'GHS 1,800',
      maxMentees: 4,
      currentMentees: 2,
      category: 'Impact-Focused',
      description:
        'Mentorship for entrepreneurs building businesses with strong social or environmental impact missions.',
      includes: [
        'Impact strategy development',
        'Measurement framework',
        'Stakeholder engagement',
        'Grant writing support',
        'Impact investor network',
        'Sustainability planning',
      ],
      mentor: {
        name: 'Dr. Fatima Hassan',
        title: 'Impact Investment Expert',
        experience: '11+ years',
        companies: 2,
        exitValue: 'GHS 30M+',
        expertise: [
          'Impact Measurement',
          'Sustainability',
          'Social Enterprise',
          'Grant Writing',
        ],
        bio: 'Leading expert in impact investing and sustainable business practices across Africa.',
      },
      outcomes: [
        'Impact strategy',
        'Measurement system',
        'Stakeholder network',
        'Funding readiness',
      ],
    },
  ];

  const testimonials = [
    {
      name: 'Amina Kone',
      company: 'EcoFarms Ltd',
      program: '1-on-1 Strategic Mentorship',
      quote:
        "Dr. Asante's mentorship was transformational. His guidance helped us scale from 2 to 15 employees and secure our Series A funding.",
      result: 'Raised GHS 5M in Series A',
      image: '👩🏾‍💼',
    },
    {
      name: 'David Mensah',
      company: 'PayFlow Solutions',
      program: 'Industry-Specific Mentorship',
      quote:
        "Alex's expertise in FinTech regulation saved us months of trial and error. We launched 6 months ahead of schedule.",
      result: 'Launched MVP successfully',
      image: '👨🏿‍💻',
    },
    {
      name: 'Joyce Wanjiku',
      company: 'HealthConnect Kenya',
      program: 'Women Entrepreneur Mentorship',
      quote:
        'Grace helped me balance growing my business while being a mother. Her support was invaluable during our expansion phase.',
      result: 'Expanded to 3 countries',
      image: '👩🏾‍⚕️',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Business Strategy':
        return 'bg-blue-100 text-blue-800';
      case 'Peer Learning':
        return 'bg-green-100 text-green-800';
      case 'FinTech':
        return 'bg-purple-100 text-purple-800';
      case 'Women-Focused':
        return 'bg-pink-100 text-pink-800';
      case 'Youth-Focused':
        return 'bg-orange-100 text-orange-800';
      case 'Impact-Focused':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Heart className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Mentorship Programs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with experienced entrepreneurs and industry experts who
              will guide you through your entrepreneurial journey with
              personalized support and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Find a Mentor
              </Button>
              <Button size="lg" variant="outline">
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Mentorship Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">30+</div>
              <div className="text-muted-foreground">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">92%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                GHS 25M+
              </div>
              <div className="text-muted-foreground">Mentee Funding Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Programs */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Mentorship Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our diverse mentorship programs designed to meet you
              where you are in your entrepreneurial journey.
            </p>
          </div>

          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
              <TabsTrigger value="industry">Industry-Specific</TabsTrigger>
              <TabsTrigger value="demographic">Demographic-Focused</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentorshipPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="border-border hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={getCategoryColor(program.category)}>
                          {program.category}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {program.price}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {program.currentMentees}/{program.maxMentees} spots
                            filled
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {program.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">
                        {program.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{program.format}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{program.commitment}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span>{program.mentor.name}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Mentor Profile</h4>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">
                                  {program.mentor.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {program.mentor.title}
                                </p>
                              </div>
                              <div className="text-right text-xs">
                                <p>{program.mentor.experience}</p>
                                <p>{program.mentor.companies} companies</p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {program.mentor.bio}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Program Includes
                          </h4>
                          <div className="grid grid-cols-1 gap-1">
                            {program.includes.slice(0, 4).map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 text-sm text-muted-foreground"
                              >
                                <MessageCircle className="h-3 w-3 text-primary" />
                                {item}
                              </div>
                            ))}
                          </div>
                          {program.includes.length > 4 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              +{program.includes.length - 4} more benefits
                            </p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Expected Outcomes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {program.outcomes.map((outcome, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {outcome}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1">Apply Now</Button>
                          <Button variant="outline">Learn More</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Filter tabs */}
            <TabsContent value="individual" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentorshipPrograms
                  .filter((p) => p.format.includes('Individual'))
                  .map((program) => (
                    <Card
                      key={program.id}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {program.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-lg font-bold text-primary">
                            {program.price}
                          </div>
                          <Button className="w-full">Apply Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="group" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentorshipPrograms
                  .filter((p) => p.format.includes('Group'))
                  .map((program) => (
                    <Card
                      key={program.id}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {program.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-lg font-bold text-primary">
                            {program.price}
                          </div>
                          <Button className="w-full">Apply Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="industry" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentorshipPrograms
                  .filter((p) =>
                    ['FinTech', 'Impact-Focused'].includes(p.category),
                  )
                  .map((program) => (
                    <Card
                      key={program.id}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {program.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-lg font-bold text-primary">
                            {program.price}
                          </div>
                          <Button className="w-full">Apply Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="demographic" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentorshipPrograms
                  .filter((p) =>
                    ['Women-Focused', 'Youth-Focused'].includes(p.category),
                  )
                  .map((program) => (
                    <Card
                      key={program.id}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {program.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {program.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-lg font-bold text-primary">
                            {program.price}
                          </div>
                          <Button className="w-full">Apply Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Success Stories
              </h2>
              <p className="text-muted-foreground">
                See how our mentorship programs have transformed businesses
                across Africa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{testimonial.image}</div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.company}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {testimonial.program}
                      </Badge>
                    </div>
                    <blockquote className="text-sm text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-primary">
                        {testimonial.result}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How Mentorship Works
              </h2>
              <p className="text-muted-foreground">
                Simple steps to get matched with the right mentor for your
                journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Complete your application and tell us about your business
                  goals
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Match</h3>
                <p className="text-sm text-muted-foreground">
                  We match you with a mentor based on your industry and needs
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                <p className="text-sm text-muted-foreground">
                  Start your mentorship with regular sessions and ongoing
                  support
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Grow</h3>
                <p className="text-sm text-muted-foreground">
                  Achieve your business goals with expert guidance and support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready for Mentorship?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join our mentorship community and accelerate your entrepreneurial
              journey with expert guidance and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Apply for Mentorship
              </Button>
              <Button size="lg" variant="outline">
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;
