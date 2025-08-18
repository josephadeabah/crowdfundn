import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Clock, Calendar, User, Video, MapPin, Star, CheckCircle } from "lucide-react";

const OfficeHours = () => {
  const mentors = [
    {
      id: 1,
      name: "Dr. Kwame Asante",
      title: "Serial Entrepreneur & Business Strategy Expert",
      company: "African Ventures Ltd",
      expertise: ["Business Strategy", "Scaling", "Market Entry", "Fundraising"],
      experience: "15+ years",
      successStories: "50+ startups mentored",
      rating: 4.9,
      reviews: 127,
      availability: [
        { day: "Monday", time: "2:00 PM - 6:00 PM", timezone: "GMT" },
        { day: "Wednesday", time: "10:00 AM - 2:00 PM", timezone: "GMT" },
        { day: "Friday", time: "3:00 PM - 7:00 PM", timezone: "GMT" }
      ],
      sessionTypes: ["30-min consultation", "60-min deep dive", "Follow-up session"],
      bio: "Former CEO of three successful African startups, now helping the next generation of entrepreneurs scale their businesses across the continent.",
      languages: ["English", "Twi", "French"],
      bookingFee: "GHS 150/hour"
    },
    {
      id: 2,
      name: "Sarah Okonkwo",
      title: "Digital Marketing & Growth Specialist",
      company: "GrowthHack Africa",
      expertise: ["Digital Marketing", "Growth Hacking", "Social Media", "Brand Building"],
      experience: "10+ years",
      successStories: "100+ campaigns launched",
      rating: 4.8,
      reviews: 89,
      availability: [
        { day: "Tuesday", time: "9:00 AM - 1:00 PM", timezone: "WAT" },
        { day: "Thursday", time: "2:00 PM - 6:00 PM", timezone: "WAT" },
        { day: "Saturday", time: "10:00 AM - 2:00 PM", timezone: "WAT" }
      ],
      sessionTypes: ["Marketing audit", "Strategy session", "Campaign review"],
      bio: "Led marketing teams at top African tech companies, specializing in user acquisition and retention strategies for emerging markets.",
      languages: ["English", "Igbo", "French"],
      bookingFee: "GHS 120/hour"
    },
    {
      id: 3,
      name: "Michael Adebayo",
      title: "Financial Planning & Investment Expert",
      company: "FinTech Capital Partners",
      expertise: ["Financial Planning", "Investment Strategy", "Due Diligence", "Exit Planning"],
      experience: "12+ years",
      successStories: "GHS 50M+ raised for clients",
      rating: 4.9,
      reviews: 156,
      availability: [
        { day: "Monday", time: "9:00 AM - 12:00 PM", timezone: "WAT" },
        { day: "Wednesday", time: "2:00 PM - 5:00 PM", timezone: "WAT" },
        { day: "Friday", time: "10:00 AM - 1:00 PM", timezone: "WAT" }
      ],
      sessionTypes: ["Financial health check", "Fundraising prep", "Investor pitch review"],
      bio: "Former investment banker turned entrepreneur, helping African startups prepare for and secure funding from local and international investors.",
      languages: ["English", "Yoruba"],
      bookingFee: "GHS 180/hour"
    },
    {
      id: 4,
      name: "Grace Mwangi",
      title: "Legal & Compliance Specialist",
      company: "Mwangi & Associates",
      expertise: ["Corporate Law", "IP Protection", "Regulatory Compliance", "Contract Law"],
      experience: "8+ years",
      successStories: "200+ legal matters resolved",
      rating: 4.7,
      reviews: 73,
      availability: [
        { day: "Tuesday", time: "1:00 PM - 5:00 PM", timezone: "EAT" },
        { day: "Thursday", time: "9:00 AM - 1:00 PM", timezone: "EAT" },
        { day: "Friday", time: "2:00 PM - 6:00 PM", timezone: "EAT" }
      ],
      sessionTypes: ["Legal consultation", "Document review", "Compliance audit"],
      bio: "Specialized in startup law and intellectual property protection, helping entrepreneurs navigate the legal landscape across East Africa.",
      languages: ["English", "Swahili"],
      bookingFee: "GHS 200/hour"
    },
    {
      id: 5,
      name: "James Mutua",
      title: "Technology & Product Development Expert",
      company: "TechBuild Solutions",
      expertise: ["Product Development", "Tech Architecture", "MVP Development", "Team Building"],
      experience: "14+ years",
      successStories: "80+ products launched",
      rating: 4.8,
      reviews: 94,
      availability: [
        { day: "Monday", time: "6:00 PM - 9:00 PM", timezone: "EAT" },
        { day: "Wednesday", time: "7:00 AM - 11:00 AM", timezone: "EAT" },
        { day: "Saturday", time: "9:00 AM - 1:00 PM", timezone: "EAT" }
      ],
      sessionTypes: ["Technical review", "Architecture planning", "Team scaling advice"],
      bio: "Former CTO at leading African tech companies, specializing in building scalable technology solutions for emerging markets.",
      languages: ["English", "Swahili"],
      bookingFee: "GHS 160/hour"
    },
    {
      id: 6,
      name: "Dr. Fatima Hassan",
      title: "Impact & Sustainability Consultant",
      company: "Impact Ventures Africa",
      expertise: ["Impact Measurement", "Sustainability", "Social Enterprise", "ESG Compliance"],
      experience: "11+ years",
      successStories: "40+ impact reports created",
      rating: 4.9,
      reviews: 68,
      availability: [
        { day: "Tuesday", time: "8:00 AM - 12:00 PM", timezone: "CAT" },
        { day: "Thursday", time: "1:00 PM - 5:00 PM", timezone: "CAT" },
        { day: "Saturday", time: "10:00 AM - 2:00 PM", timezone: "CAT" }
      ],
      sessionTypes: ["Impact assessment", "Sustainability planning", "ESG audit"],
      bio: "Leading expert in impact measurement and sustainable business practices, helping organizations create positive change while building profitable businesses.",
      languages: ["English", "Arabic", "French"],
      bookingFee: "GHS 140/hour"
    }
  ];

  const upcomingSessions = [
    {
      mentor: "Dr. Kwame Asante",
      topic: "Scaling Your Business Across African Markets",
      date: "March 29, 2024",
      time: "3:00 PM GMT",
      type: "Group Session",
      spots: "3 spots left",
      price: "GHS 50"
    },
    {
      mentor: "Sarah Okonkwo",
      topic: "Digital Marketing for Mobile-First Markets",
      date: "March 31, 2024",
      time: "11:00 AM WAT",
      type: "Group Session",
      spots: "5 spots left",
      price: "GHS 40"
    },
    {
      mentor: "Michael Adebayo",
      topic: "Preparing for Your First Fundraising Round",
      date: "April 3, 2024",
      time: "2:00 PM WAT",
      type: "Group Session",
      spots: "2 spots left",
      price: "GHS 60"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Clock className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Office Hours
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get personalized guidance from experienced entrepreneurs and industry experts through one-on-one mentorship sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Book a Session
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
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-muted-foreground">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Group Sessions */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Group Office Hours</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join group sessions for focused learning at a lower cost, perfect for common entrepreneurial challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {upcomingSessions.map((session, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline">{session.type}</Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{session.price}</div>
                      <div className="text-xs text-muted-foreground">{session.spots}</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{session.topic}</CardTitle>
                  <p className="text-sm text-muted-foreground">with {session.mentor}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{session.time}</span>
                    </div>
                    <Button className="w-full">
                      Join Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Mentors */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Book 1-on-1 Sessions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our roster of experienced mentors and book personalized sessions tailored to your specific needs.
            </p>
          </div>

          <Tabs defaultValue="all" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Mentors</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentors.map((mentor) => (
                  <Card key={mentor.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <CardTitle className="text-xl">{mentor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{mentor.title}</p>
                          <p className="text-xs text-muted-foreground">{mentor.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{mentor.rating}</span>
                            <span className="text-xs text-muted-foreground">({mentor.reviews})</span>
                          </div>
                          <div className="text-sm font-semibold text-primary">{mentor.bookingFee}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Experience:</span> {mentor.experience}
                          </div>
                          <div>
                            <span className="font-semibold">Track Record:</span> {mentor.successStories}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Session Types</h4>
                          <ul className="space-y-1">
                            {mentor.sessionTypes.map((type, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                {type}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Available Times</h4>
                          <div className="space-y-1">
                            {mentor.availability.slice(0, 2).map((slot, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {slot.day}: {slot.time} ({slot.timezone})
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1">
                            Book Session
                          </Button>
                          <Button variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentors.filter(m => m.expertise.some(e => ["Business Strategy", "Scaling", "Market Entry"].includes(e))).map((mentor) => (
                  <Card key={mentor.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{mentor.bio}</p>
                      <Button className="w-full">Book Session</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="marketing" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentors.filter(m => m.expertise.some(e => ["Digital Marketing", "Growth Hacking", "Social Media", "Brand Building"].includes(e))).map((mentor) => (
                  <Card key={mentor.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{mentor.bio}</p>
                      <Button className="w-full">Book Session</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="finance" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentors.filter(m => m.expertise.some(e => ["Financial Planning", "Investment Strategy", "Due Diligence", "Exit Planning"].includes(e))).map((mentor) => (
                  <Card key={mentor.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{mentor.bio}</p>
                      <Button className="w-full">Book Session</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentors.filter(m => m.expertise.some(e => ["Corporate Law", "IP Protection", "Regulatory Compliance", "Contract Law"].includes(e))).map((mentor) => (
                  <Card key={mentor.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{mentor.bio}</p>
                      <Button className="w-full">Book Session</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tech" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mentors.filter(m => m.expertise.some(e => ["Product Development", "Tech Architecture", "MVP Development", "Team Building"].includes(e))).map((mentor) => (
                  <Card key={mentor.id} className="border-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mentor.title}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{mentor.bio}</p>
                      <Button className="w-full">Book Session</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">How Office Hours Work</h2>
              <p className="text-muted-foreground">
                Simple steps to get the mentorship you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Mentor</h3>
                <p className="text-muted-foreground">
                  Browse our expert mentors and select based on your specific needs
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Your Session</h3>
                <p className="text-muted-foreground">
                  Schedule a convenient time and prepare your questions or challenges
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Receive personalized advice and actionable insights for your business
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
              Accelerate Your Growth
            </h2>
            <p className="text-muted-foreground mb-8">
              Don't navigate your entrepreneurial journey alone. Get expert guidance from mentors who've been where you want to go.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book Your First Session
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfficeHours;
