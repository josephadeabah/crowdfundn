import React, { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import * as LucideIcons from 'lucide-react';

// Destructure all Lucide icons
const {
  ArrowRight,
  Lightbulb,
  Rocket,
  Globe,
  Handshake,
  TrendingUp,
  Zap,
  // Add any other icons you need here
  ...remainingIcons
} = LucideIcons;

// Create an Icons object mapping for type safety
const Icons = {
  Lightbulb,
  Rocket,
  Globe,
  Handshake,
  TrendingUp,
  Zap,
  // Add other icons as needed
};

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  imageUrl: string;
  learnMoreUrl?: string;
  isLeft?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  description,
  icon,
  imageUrl,
  learnMoreUrl,
  isLeft = true,
}) => {
  const Icon = Icons[icon];

  return (
    <div className="relative">
      {/* Timeline center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-fundify-primary/40 to-fundify-accent/40"></div>

      {/* Timeline circle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-12 w-6 h-6 rounded-full border-2 border-fundify-primary bg-white z-10 shadow-md"></div>

      <div
        className={`flex flex-col md:flex-row items-center ${isLeft ? 'md:flex-row-reverse' : ''} mb-24 relative`}
      >
        {/* Timeline content */}
        <div
          className={`md:w-1/2 px-4 md:px-12 md:${isLeft ? 'text-right' : 'text-left'}`}
        >
          <div className="mb-4 inline-block bg-fundify-muted text-fundify-primary px-3 py-1 rounded-full text-sm font-medium">
            {year}
          </div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          {learnMoreUrl && (
            <Button
              variant="outline"
              className="border-fundify-primary text-fundify-primary hover:bg-fundify-primary/10"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Divider for mobile */}
        <div className="my-6 md:hidden w-1 h-12 bg-gradient-to-b from-fundify-primary/40 to-fundify-accent/40"></div>

        {/* Timeline image/icon */}
        <div
          className={`md:w-1/2 px-4 md:px-12 ${isLeft ? 'md:items-start' : 'md:items-end'} flex flex-col items-center`}
        >
          <Card className="overflow-hidden w-full max-w-md shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-0 right-0 m-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md">
                {Icon && <Icon className="h-8 w-8 text-fundify-primary" />}
              </div>
            </div>
            <CardContent className="p-4 bg-white">
              <h4 className="font-medium text-lg">{title}</h4>
              <p className="text-sm text-gray-500 mt-1">
                A milestone in our journey
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TimelineSection = () => {
  useEffect(() => {
    const handleScroll = () => {
      const timelineItems = document.querySelectorAll('.timeline-item');

      timelineItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.8;

        if (isVisible) {
          item.classList.add('animate-fade-in');
          item.classList.remove('opacity-0');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
              Our Story
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a transparent, inspiring & personalised way to make
            change
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="timeline-item opacity-0 transition-all duration-500">
            <TimelineItem
              year="2024"
              title="Why we started?"
              description="When you see something that needs to change in your community what do you do? Shout at the tv that 'someone should do something about it'? Rant online about how broken the system is and how people just don't 'get it'? What if instead of doing that, we all put up our hand to do something - big or small. All around the world, there are millions of people who already do just that. We built bantuhive for them. To make it incredibly simple for them to fundraise. To make it easy for them to find a community of people who wanted to support them. And to give the rest of us a more transparent and effective way of making the world we want to see."
              icon="Lightbulb"
              imageUrl="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1470"
              learnMoreUrl="/about/mission"
            />
          </div>

          <div className="timeline-item opacity-0 transition-all duration-500">
            <TimelineItem
              year="2025"
              title="First Platform Launch"
              description="After months of development and user testing, we launched the first version of Bantu Hive. Our initial platform focused on community-driven campaigns that addressed local social issues. Within the first month, we facilitated funding for 50 grassroots campaigns across 12 cities."
              icon="Rocket"
              imageUrl="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1470"
              isLeft={false}
            />
          </div>

          <div className="timeline-item opacity-0 transition-all duration-500">
            <TimelineItem
              year="2025"
              title="Expanding Our Reach"
              description="During a challenging year globally, we expanded our platform to include virtual fundraising tools. This allowed campaigns to continue despite physical restrictions, resulting in a 300% increase in user engagement and supporting an additional 500 campaigns focused on pandemic relief."
              icon="Globe"
              imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1471"
              learnMoreUrl="/about/expansion"
            />
          </div>

          <div className="timeline-item opacity-0 transition-all duration-500">
            <TimelineItem
              year="2025"
              title="Partnership Program"
              description="We launched our partnership program to bring together corporations, nonprofits, and community organizations. This collaborative approach has created a powerful network of change-makers, with over 100 partner organizations joining in the first year and collectively raising over $10 million for various causes."
              icon="Handshake"
              imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1470"
              isLeft={false}
            />
          </div>

          <div className="timeline-item opacity-0 transition-all duration-500">
            <TimelineItem
              year="2025"
              title="Impact Metrics Introduced"
              description="We developed comprehensive impact metrics to help both campaign creators and funders better understand the real-world effects of their contributions. This transparency feature has increased donor confidence and led to a 40% increase in recurring donations."
              icon="TrendingUp"
              imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1470"
              learnMoreUrl="/about/impact"
            />
          </div>

          <div className="timeline-item opacity-0 transition-all duration-500">
            <TimelineItem
              year="2025"
              title="The Future of Bantu Hive"
              description="Today, Bantu Hive stands as a leading platform for community-driven change, with over 1 million active users across 50 countries. We're now developing AI-powered tools to better connect campaigns with potential supporters, blockchain integration for enhanced transparency, and mobile solutions to make fundraising possible from anywhere."
              icon="Zap"
              imageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1470"
              isLeft={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
