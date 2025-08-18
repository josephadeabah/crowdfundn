import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Users,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Target,
  Network,
} from 'lucide-react';

const GroupMeetings = () => {
  const meetingGroups = [
    {
      id: 1,
      name: 'Women Entrepreneurs Circle',
      location: 'Accra, Ghana',
      nextMeeting: 'March 30, 2024',
      time: '10:00 AM - 12:00 PM',
      members: 45,
      maxMembers: 60,
      frequency: 'Bi-weekly',
      focus: 'Women-led businesses and gender equality in entrepreneurship',
      description:
        'A supportive community for women entrepreneurs to share experiences, challenges, and celebrate successes together.',
      topics: [
        'Business scaling',
        'Work-life balance',
        'Funding strategies',
        'Networking',
      ],
      facilitator: 'Grace Nakimera',
      venue: 'Impact Hub Accra',
      memberLevel: 'All levels welcome',
      language: 'English & Twi',
    },
    {
      id: 2,
      name: 'Tech Innovators Hub',
      location: 'Lagos, Nigeria',
      nextMeeting: 'April 2, 2024',
      time: '6:00 PM - 8:00 PM',
      members: 38,
      maxMembers: 50,
      frequency: 'Weekly',
      focus: 'Technology startups and digital innovation',
      description:
        'Connect with fellow tech entrepreneurs, share coding challenges, and discuss the latest trends in African tech.',
      topics: [
        'Product development',
        'Technical architecture',
        'User acquisition',
        'Funding rounds',
      ],
      facilitator: 'Chidi Okonkwo',
      venue: 'CcHUB Lagos',
      memberLevel: 'Intermediate to Advanced',
      language: 'English',
    },
    {
      id: 3,
      name: 'Social Impact Collective',
      location: 'Cape Town, South Africa',
      nextMeeting: 'April 5, 2024',
      time: '2:00 PM - 4:00 PM',
      members: 32,
      maxMembers: 40,
      frequency: 'Monthly',
      focus: 'Social enterprises and impact measurement',
      description:
        'For entrepreneurs building businesses that create positive social and environmental change.',
      topics: [
        'Impact measurement',
        'Sustainable business models',
        'Grant applications',
        'Community engagement',
      ],
      facilitator: 'Dr. Nomsa Daniels',
      venue: 'The Cape Town Partnership',
      memberLevel: 'All levels welcome',
      language: 'English & Afrikaans',
    },
    {
      id: 4,
      name: 'AgriTech Pioneers',
      location: 'Nairobi, Kenya',
      nextMeeting: 'April 8, 2024',
      time: '3:00 PM - 5:00 PM',
      members: 28,
      maxMembers: 35,
      frequency: 'Bi-weekly',
      focus: 'Agricultural technology and food security solutions',
      description:
        "Bringing together entrepreneurs working on innovative solutions for Africa's agricultural challenges.",
      topics: [
        'Crop technology',
        'Supply chain innovation',
        'Farmer education',
        'Climate adaptation',
      ],
      facilitator: 'Dr. Michael Ndegwa',
      venue: 'iHub Nairobi',
      memberLevel: 'Industry professionals',
      language: 'English & Swahili',
    },
    {
      id: 5,
      name: 'Fintech Builders',
      location: 'Kigali, Rwanda',
      nextMeeting: 'April 10, 2024',
      time: '4:00 PM - 6:00 PM',
      members: 25,
      maxMembers: 30,
      frequency: 'Weekly',
      focus: 'Financial technology and digital payments',
      description:
        'A community for fintech entrepreneurs building the future of financial services in Africa.',
      topics: [
        'Digital payments',
        'Financial inclusion',
        'Regulatory compliance',
        'Blockchain applications',
      ],
      facilitator: 'Alex Tumusiime',
      venue: 'Kigali Innovation City',
      memberLevel: 'Advanced',
      language: 'English & Kinyarwanda',
    },
    {
      id: 6,
      name: 'Young Entrepreneurs Network',
      location: 'Kumasi, Ghana',
      nextMeeting: 'April 12, 2024',
      time: '5:00 PM - 7:00 PM',
      members: 52,
      maxMembers: 70,
      frequency: 'Weekly',
      focus: 'Youth entrepreneurship and startup fundamentals',
      description:
        'Supporting young entrepreneurs (18-30) with mentorship, resources, and peer learning opportunities.',
      topics: [
        'Business basics',
        'Funding options',
        'Marketing strategies',
        'Legal requirements',
      ],
      facilitator: 'Kwame Asante Jr.',
      venue: 'KNUST Innovation Hub',
      memberLevel: 'Beginner to Intermediate',
      language: 'English & Twi',
    },
  ];

  const upcomingEvents = [
    {
      group: 'Women Entrepreneurs Circle',
      topic: 'Scaling Your Business: Lessons from Successful Women CEOs',
      date: 'March 30, 2024',
      time: '10:00 AM',
      speaker: 'Maria Okafor, CEO of EcoFarms Ltd',
    },
    {
      group: 'Tech Innovators Hub',
      topic: 'Building APIs for African Markets',
      date: 'April 2, 2024',
      time: '6:00 PM',
      speaker: 'Samuel Adeyemi, CTO of PayStack',
    },
    {
      group: 'Social Impact Collective',
      topic: 'Measuring Social Return on Investment',
      date: 'April 5, 2024',
      time: '2:00 PM',
      speaker: 'Dr. Aisha Mohamed, Impact Measurement Expert',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Users className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Group Meetings
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join peer learning groups where African entrepreneurs connect,
              collaborate, and grow together through regular meetups and shared
              experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join a Group
              </Button>
              <Button size="lg" variant="outline">
                Start New Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Join Group Meetings?
              </h2>
              <p className="text-muted-foreground">
                Experience the power of peer learning and community support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Build Your Network
                </h3>
                <p className="text-muted-foreground">
                  Connect with like-minded entrepreneurs and build lasting
                  professional relationships.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Stay Accountable</h3>
                <p className="text-muted-foreground">
                  Share your goals with peers and stay motivated through regular
                  check-ins and support.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learn from Peers</h3>
                <p className="text-muted-foreground">
                  Share experiences, challenges, and solutions with
                  entrepreneurs facing similar journeys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Groups */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Active Group Meetings
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join any of our specialized groups based on your industry, stage,
              or interests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {meetingGroups.map((group) => (
              <Card
                key={group.id}
                className="border-border hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <Badge variant="outline">
                      {group.members}/{group.maxMembers} members
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {group.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{group.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{group.frequency}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{group.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{group.memberLevel}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Next Meeting</h4>
                      <p className="text-sm text-muted-foreground">
                        {group.nextMeeting} at {group.venue}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Regular Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.topics.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Facilitator</h4>
                      <p className="text-sm text-muted-foreground">
                        {group.facilitator}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1">Join Group</Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Upcoming Sessions
              </h2>
              <p className="text-muted-foreground">
                Don't miss these special sessions happening this week
              </p>
            </div>

            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{event.group}</Badge>
                          <Badge variant="secondary">{event.date}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {event.topic}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Special session with {event.speaker}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary">
                          {event.time}
                        </div>
                        <Button className="mt-2">Reserve Spot</Button>
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
                How Group Meetings Work
              </h2>
              <p className="text-muted-foreground">
                Simple steps to join and participate in our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Choose Your Group
                </h3>
                <p className="text-muted-foreground">
                  Select a group that matches your industry, stage, or interests
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Attend Regularly</h3>
                <p className="text-muted-foreground">
                  Join regular meetings and participate in discussions and
                  activities
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Grow Together</h3>
                <p className="text-muted-foreground">
                  Build relationships, share knowledge, and support each other's
                  growth
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
              Ready to Connect?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join a group meeting today and become part of Africa's most
              supportive entrepreneurial community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Find Your Group
              </Button>
              <Button size="lg" variant="outline">
                Start a New Group
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GroupMeetings;
