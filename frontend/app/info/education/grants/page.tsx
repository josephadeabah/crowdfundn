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
  Banknote,
  Building2,
  Lightbulb,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const Grant = () => {
  const grants = [
    {
      title: 'Startup Seed Grant',
      amount: 'GHS 25,000 - GHS 100,000',
      type: 'Seed Funding',
      duration: '12 months',
      stage: 'Early Stage',
      description:
        'Non-dilutive funding for early-stage startups with innovative solutions',
      requirements: [
        'Minimum Viable Product',
        'Market validation',
        'Clear business model',
      ],
      focus: ['Technology', 'Healthcare', 'Agriculture', 'Education'],
    },
    {
      title: 'Community Impact Grant',
      amount: 'GHS 15,000 - GHS 50,000',
      type: 'Social Impact',
      duration: '6 months',
      stage: 'Any Stage',
      description:
        'Funding for projects that create positive social or environmental impact',
      requirements: [
        'Community endorsement',
        'Impact measurement plan',
        'Sustainability strategy',
      ],
      focus: [
        'Social Enterprise',
        'Environment',
        'Community Development',
        'Healthcare',
      ],
    },
    {
      title: 'Women Entrepreneur Grant',
      amount: 'GHS 20,000 - GHS 75,000',
      type: 'Gender Focused',
      duration: '18 months',
      stage: 'Growth Stage',
      description:
        'Supporting women-led businesses to scale and create employment opportunities',
      requirements: [
        'Female founder/co-founder',
        'Business registration',
        'Growth plan',
      ],
      focus: [
        'All Industries',
        'Female Leadership',
        'Job Creation',
        'Economic Empowerment',
      ],
    },
    {
      title: 'Innovation Research Grant',
      amount: 'GHS 30,000 - GHS 150,000',
      type: 'R&D Funding',
      duration: '24 months',
      stage: 'Research Stage',
      description:
        'Supporting research and development of innovative technologies and solutions',
      requirements: [
        'Research proposal',
        'Technical feasibility',
        'Commercialization plan',
      ],
      focus: ['AI/ML', 'Biotech', 'Clean Energy', 'Fintech'],
    },
  ];

  const applicationSteps = [
    {
      step: 1,
      title: 'Eligibility Check',
      description:
        'Review grant criteria and ensure your project meets the requirements',
      icon: CheckCircle,
    },
    {
      step: 2,
      title: 'Prepare Documentation',
      description:
        'Gather all required documents including business plan and financials',
      icon: Building2,
    },
    {
      step: 3,
      title: 'Submit Application',
      description:
        'Complete the online application form with all supporting materials',
      icon: Lightbulb,
    },
    {
      step: 4,
      title: 'Review & Interview',
      description:
        'Our team reviews your application and may conduct an interview',
      icon: Users,
    },
    {
      step: 5,
      title: 'Decision & Disbursement',
      description:
        'Receive funding decision and begin milestone-based disbursement',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Banknote className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Business Grants
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Non-dilutive funding opportunities to accelerate your business
              growth and innovation across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Apply for Grant
              </Button>
              <Button size="lg" variant="outline">
                View Eligibility
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
              <div className="text-3xl font-bold text-primary mb-2">
                GHS 5M+
              </div>
              <div className="text-muted-foreground">Grants Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Businesses Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1,500+</div>
              <div className="text-muted-foreground">Jobs Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15</div>
              <div className="text-muted-foreground">Countries Reached</div>
            </div>
          </div>
        </div>
      </section>

      {/* Grant Types Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Available Grant Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our various grant programs designed to support businesses
              at different stages of growth.
            </p>
          </div>

          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Grants</TabsTrigger>
              <TabsTrigger value="seed">Seed Stage</TabsTrigger>
              <TabsTrigger value="growth">Growth Stage</TabsTrigger>
              <TabsTrigger value="research">R&D</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {grants.map((grant, index) => (
                  <Card
                    key={index}
                    className="border-border hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-4">
                        <CardTitle className="text-xl">{grant.title}</CardTitle>
                        <Badge variant="outline">{grant.type}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {grant.amount}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Duration: {grant.duration}</span>
                        <span>Stage: {grant.stage}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {grant.description}
                        </p>

                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <ul className="space-y-1">
                            {grant.requirements.map((req, reqIndex) => (
                              <li
                                key={reqIndex}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <CheckCircle className="h-4 w-4 text-primary" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Focus Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {grant.focus.map((area, areaIndex) => (
                              <Badge key={areaIndex} variant="secondary">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button className="w-full">Apply Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="seed" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {grants
                  .filter(
                    (grant) =>
                      grant.stage.includes('Early') ||
                      grant.stage.includes('Any'),
                  )
                  .map((grant, index) => (
                    <Card
                      key={index}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{grant.title}</CardTitle>
                        <div className="text-2xl font-bold text-primary">
                          {grant.amount}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {grant.description}
                        </p>
                        <Button className="w-full">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="growth" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {grants
                  .filter(
                    (grant) =>
                      grant.stage.includes('Growth') ||
                      grant.stage.includes('Any'),
                  )
                  .map((grant, index) => (
                    <Card
                      key={index}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{grant.title}</CardTitle>
                        <div className="text-2xl font-bold text-primary">
                          {grant.amount}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {grant.description}
                        </p>
                        <Button className="w-full">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="research" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {grants
                  .filter((grant) => grant.stage.includes('Research'))
                  .map((grant, index) => (
                    <Card
                      key={index}
                      className="border-border hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{grant.title}</CardTitle>
                        <div className="text-2xl font-bold text-primary">
                          {grant.amount}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {grant.description}
                        </p>
                        <Button className="w-full">Apply Now</Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Application Process
              </h2>
              <p className="text-muted-foreground">
                Our streamlined process ensures quick and fair evaluation of all
                grant applications
              </p>
            </div>

            <div className="space-y-8">
              {applicationSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">
                        Step {step.step}: {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Important Grant Information
                    </h3>
                    <ul className="space-y-2 text-amber-700">
                      <li>
                        • All grants are non-dilutive and do not require equity
                        exchange
                      </li>
                      <li>
                        • Funding is disbursed based on milestone achievement
                      </li>
                      <li>
                        • Regular reporting and compliance checks are required
                      </li>
                      <li>
                        • Grant recipients receive ongoing mentorship and
                        support
                      </li>
                      <li>• Applications are reviewed on a rolling basis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Apply for our grant programs and get the funding you need to take
              your business to the next level.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Grant Application
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Grant;
