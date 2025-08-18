import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { BookOpen, Users, Award, Clock, Target, CheckCircle, Star, Calendar } from "lucide-react";

const Training = () => {
  const trainingPrograms = [
    {
      id: 1,
      title: "Entrepreneurship Fundamentals",
      duration: "6 weeks",
      format: "Online + In-person",
      level: "Beginner",
      price: "GHS 500",
      maxParticipants: 30,
      currentEnrolled: 18,
      rating: 4.9,
      reviews: 156,
      startDate: "April 15, 2024",
      schedule: "Tuesdays & Thursdays, 6:00 PM - 8:00 PM",
      description: "Comprehensive foundation course covering all aspects of starting and running a successful business in Africa.",
      modules: [
        "Business Ideation & Validation",
        "Market Research & Analysis",
        "Business Model Development",
        "Financial Planning & Budgeting",
        "Legal Structure & Compliance",
        "Marketing & Customer Acquisition"
      ],
      instructor: "Dr. Kwame Asante",
      outcomes: [
        "Complete business plan",
        "Market validation report",
        "Financial projections",
        "Go-to-market strategy"
      ],
      certificate: true,
      category: "Foundation"
    },
    {
      id: 2,
      title: "Digital Marketing Mastery",
      duration: "4 weeks",
      format: "Online",
      level: "Intermediate",
      price: "GHS 400",
      maxParticipants: 50,
      currentEnrolled: 34,
      rating: 4.8,
      reviews: 89,
      startDate: "April 22, 2024",
      schedule: "Mondays & Wednesdays, 7:00 PM - 9:00 PM",
      description: "Master digital marketing strategies specifically designed for African markets and mobile-first audiences.",
      modules: [
        "Social Media Strategy",
        "Content Marketing",
        "Mobile Marketing",
        "Email Marketing",
        "Analytics & Optimization",
        "Paid Advertising"
      ],
      instructor: "Sarah Okonkwo",
      outcomes: [
        "Digital marketing strategy",
        "Social media calendar",
        "Campaign templates",
        "Analytics dashboard"
      ],
      certificate: true,
      category: "Marketing"
    },
    {
      id: 3,
      title: "Financial Management for Startups",
      duration: "5 weeks",
      format: "Hybrid",
      level: "Intermediate",
      price: "GHS 600",
      maxParticipants: 25,
      currentEnrolled: 15,
      rating: 4.9,
      reviews: 73,
      startDate: "May 1, 2024",
      schedule: "Saturdays, 9:00 AM - 1:00 PM",
      description: "Learn essential financial management skills and fundraising strategies for sustainable business growth.",
      modules: [
        "Financial Planning & Forecasting",
        "Cash Flow Management",
        "Investment Strategies",
        "Fundraising Preparation",
        "Financial Reporting",
        "Tax Planning & Compliance"
      ],
      instructor: "Michael Adebayo",
      outcomes: [
        "Financial model template",
        "Investor pitch deck",
        "Cash flow projections",
        "Fundraising strategy"
      ],
      certificate: true,
      category: "Finance"
    },
    {
      id: 4,
      title: "Tech Innovation Bootcamp",
      duration: "8 weeks",
      format: "In-person",
      level: "Advanced",
      price: "GHS 1,200",
      maxParticipants: 20,
      currentEnrolled: 12,
      rating: 4.8,
      reviews: 45,
      startDate: "May 6, 2024",
      schedule: "Weekends, 9:00 AM - 5:00 PM",
      description: "Intensive program for building scalable technology solutions for African markets.",
      modules: [
        "Product Development Lifecycle",
        "Technical Architecture",
        "User Experience Design",
        "MVP Development",
        "Testing & Quality Assurance",
        "Scaling Technology Solutions"
      ],
      instructor: "James Mutua",
      outcomes: [
        "Working MVP",
        "Technical documentation",
        "User testing report",
        "Scaling roadmap"
      ],
      certificate: true,
      category: "Technology"
    },
    {
      id: 5,
      title: "Leadership & Team Building",
      duration: "3 weeks",
      format: "Online",
      level: "Intermediate",
      price: "GHS 300",
      maxParticipants: 40,
      currentEnrolled: 28,
      rating: 4.7,
      reviews: 62,
      startDate: "May 13, 2024",
      schedule: "Fridays, 3:00 PM - 6:00 PM",
      description: "Develop leadership skills and learn how to build and manage high-performing teams.",
      modules: [
        "Leadership Fundamentals",
        "Team Formation & Dynamics",
        "Communication Strategies",
        "Conflict Resolution",
        "Performance Management",
        "Cultural Intelligence"
      ],
      instructor: "Grace Nakimera",
      outcomes: [
        "Leadership assessment",
        "Team building toolkit",
        "Communication framework",
        "Performance metrics"
      ],
      certificate: true,
      category: "Leadership"
    },
    {
      id: 6,
      title: "Sustainable Business Practices",
      duration: "4 weeks",
      format: "Hybrid",
      level: "All Levels",
      price: "GHS 350",
      maxParticipants: 35,
      currentEnrolled: 22,
      rating: 4.8,
      reviews: 38,
      startDate: "May 20, 2024",
      schedule: "Thursdays, 2:00 PM - 5:00 PM",
      description: "Learn how to integrate sustainability principles into your business model for long-term success.",
      modules: [
        "Sustainability Frameworks",
        "Environmental Impact Assessment",
        "Social Impact Measurement",
        "Sustainable Supply Chains",
        "Green Financing",
        "ESG Reporting"
      ],
      instructor: "Dr. Fatima Hassan",
      outcomes: [
        "Sustainability strategy",
        "Impact measurement plan",
        "ESG framework",
        "Green finance proposal"
      ],
      certificate: true,
      category: "Sustainability"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "Online": return "bg-blue-100 text-blue-800";
      case "In-person": return "bg-green-100 text-green-800";
      case "Hybrid": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Professional Training
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive training programs designed to equip African entrepreneurs with the skills needed to build successful, sustainable businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Browse Programs
              </Button>
              <Button size="lg" variant="outline">
                Corporate Training
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
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Training Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">3,000+</div>
              <div className="text-muted-foreground">Graduates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">87%</div>
              <div className="text-muted-foreground">Business Launch Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Available Training Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive catalog of training programs, each designed to address specific entrepreneurial skills and challenges.
            </p>
          </div>

          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="foundation">Foundation</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainingPrograms.map((program) => (
                  <Card key={program.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                          <Badge className={getLevelColor(program.level)}>
                            {program.level}
                          </Badge>
                          <Badge className={getFormatColor(program.format)}>
                            {program.format}
                          </Badge>
                          {program.certificate && (
                            <Badge variant="outline">
                              <Award className="h-3 w-3 mr-1" />
                              Certificate
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{program.price}</div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{program.rating}</span>
                            <span className="text-muted-foreground">({program.reviews})</span>
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{program.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{program.currentEnrolled}/{program.maxParticipants} enrolled</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span>By {program.instructor}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">{program.schedule}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Key Modules</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {program.modules.slice(0, 4).map((module, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                                <CheckCircle className="h-3 w-3 text-primary" />
                                {module}
                              </div>
                            ))}
                          </div>
                          {program.modules.length > 4 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              +{program.modules.length - 4} more modules
                            </p>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">You'll Receive</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {program.outcomes.map((outcome, index) => (
                              <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                                <CheckCircle className="h-3 w-3 text-primary" />
                                {outcome}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1">
                            Enroll Now
                          </Button>
                          <Button variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Category-specific tabs */}
            <TabsContent value="foundation" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainingPrograms.filter(p => p.category === "Foundation").map((program) => (
                  <Card key={program.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-lg font-bold text-primary">{program.price}</div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="marketing" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainingPrograms.filter(p => p.category === "Marketing").map((program) => (
                  <Card key={program.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-lg font-bold text-primary">{program.price}</div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="finance" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainingPrograms.filter(p => p.category === "Finance").map((program) => (
                  <Card key={program.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-lg font-bold text-primary">{program.price}</div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainingPrograms.filter(p => p.category === "Technology").map((program) => (
                  <Card key={program.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-lg font-bold text-primary">{program.price}</div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leadership" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {trainingPrograms.filter(p => p.category === "Leadership").map((program) => (
                  <Card key={program.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-lg font-bold text-primary">{program.price}</div>
                        <Button className="w-full">Enroll Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Training Benefits */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our Training?</h2>
              <p className="text-muted-foreground">
                Our programs are designed by entrepreneurs, for entrepreneurs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Practical Learning</h3>
                <p className="text-muted-foreground">
                  Hands-on training with real-world case studies and actionable insights.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Learn from successful entrepreneurs and industry professionals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certification</h3>
                <p className="text-muted-foreground">
                  Receive recognized certificates to showcase your new skills.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">African Focus</h3>
                <p className="text-muted-foreground">
                  Content specifically designed for African markets and challenges.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-muted-foreground">
                  Multiple formats and timings to fit your busy schedule.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
                <p className="text-muted-foreground">
                  Access to alumni network and continued mentorship.
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
              Ready to Level Up?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of African entrepreneurs who have transformed their businesses through our training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Enroll Today
              </Button>
              <Button size="lg" variant="outline">
                Request Corporate Training
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Training;