import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  CalendarDays,
  GraduationCap,
  Users,
  Trophy,
  Clock,
  CheckCircle,
} from 'lucide-react';

const Scholarship = () => {
  const scholarships = [
    {
      title: 'Young Entrepreneur Scholarship',
      amount: 'GHS 50,000',
      deadline: 'March 15, 2024',
      eligibility: '18-25 years, Ghanaian citizen',
      category: 'Entrepreneurship',
      status: 'Open',
      requirements: [
        'Business plan submission',
        'Academic transcripts',
        '2 reference letters',
      ],
    },
    {
      title: 'Women in Business Grant',
      amount: 'GHS 30,000',
      deadline: 'April 30, 2024',
      eligibility: 'Female entrepreneurs',
      category: 'Gender Equity',
      status: 'Open',
      requirements: [
        'Proof of business registration',
        'Financial projections',
        'Impact statement',
      ],
    },
    {
      title: 'Tech Innovation Scholarship',
      amount: 'GHS 75,000',
      deadline: 'May 20, 2024',
      eligibility: 'STEM graduates',
      category: 'Technology',
      status: 'Open',
      requirements: [
        'Portfolio submission',
        'Technical assessment',
        'Interview',
      ],
    },
    {
      title: 'Rural Development Fund',
      amount: 'GHS 40,000',
      deadline: 'June 10, 2024',
      eligibility: 'Rural community projects',
      category: 'Community Impact',
      status: 'Closing Soon',
      requirements: [
        'Community endorsement',
        'Project proposal',
        'Budget breakdown',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Educational Scholarships
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering the next generation of African entrepreneurs through
              education and mentorship opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Apply for Scholarship
              </Button>
              <Button size="lg" variant="outline">
                View Requirements
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Scholarships Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                GHS 2M+
              </div>
              <div className="text-muted-foreground">
                Total Funding Distributed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Partner Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Scholarships */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Available Scholarships
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our current scholarship opportunities designed to support
              African entrepreneurs at every stage of their journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {scholarships.map((scholarship, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-xl">
                      {scholarship.title}
                    </CardTitle>
                    <Badge
                      variant={
                        scholarship.status === 'Open'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {scholarship.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {scholarship.amount}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {scholarship.deadline}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Eligibility</h4>
                      <p className="text-muted-foreground">
                        {scholarship.eligibility}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {scholarship.requirements.map((req, reqIndex) => (
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

                    <div className="pt-4">
                      <Button className="w-full">Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                Follow these simple steps to apply for our scholarships
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Submit Application
                </h3>
                <p className="text-muted-foreground">
                  Complete the online application form with all required
                  documents
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Review Process</h3>
                <p className="text-muted-foreground">
                  Our team reviews applications and conducts interviews
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Award & Support</h3>
                <p className="text-muted-foreground">
                  Successful candidates receive funding and ongoing mentorship
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
              Ready to Apply?
            </h2>
            <p className="text-muted-foreground mb-8">
              Take the first step towards your entrepreneurial journey with our
              scholarship programs.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Application
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarship;
