'use client';
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Rocket, 
  Lightbulb, 
  Globe, 
  Users, 
  ArrowRight,
  Calendar,
  Flag,
  Trophy,
  HeartHandshake
} from 'lucide-react';
import Image from 'next/image';

const OurStorySection = () => {
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(null);
  
  const timelineData = [
    {
      id: 1,
      title: "Founded",
      date: "November 2024",
      description: "BantuHive was founded with a vision to revolutionize crowdfunding in Africa.",
      extendedContent: (
        <div className="mt-4 space-y-4">
          <Image 
            src="/combined.webp" 
            alt="BantuHive founders" 
            width={400} 
            height={300}
            className="rounded-lg shadow-md"
          />
          <p className="text-gray-700">
            Our founders Nqoba Manana and Joseph Adeabah met through YCombinator and combined their expertise in technology and social impact to create a platform specifically for African creators and causes.
          </p>
        </div>
      ),
      icon: <Rocket className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Platform Launch",
      date: "January 2025",
      description: "Launched our first successful campaign, proving the concept works.",
      extendedContent: (
        <div className="mt-4 space-y-4">
          <Image 
            src="/undraw_connected-world_anke.png" 
            alt="Platform launch" 
            width={400} 
            height={300}
            className="rounded-lg shadow-md"
          />
          <p className="text-gray-700">
            The first campaign helped a young entrepreneur in Ghana raise funds for her sustainable fashion line. This success validated our model and showed the potential for African-focused crowdfunding.
          </p>
        </div>
      ),
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      id: 3,
      title: "First Campaign",
      date: "February 2025",
      description: "Officially launched our platform to the public with 50+ campaigns.",
      extendedContent: (
        <div className="mt-4 space-y-4">
          <Image 
            src="/undraw_party_k6eg.png" 
            alt="First Campaign" 
            width={400} 
            height={300}
            className="rounded-lg shadow-md"
          />
          <p className="text-gray-700">
            Our public launch event in Accra brought together creators, backers, and media to celebrate African innovation. The platform featured campaigns across education, business, arts, and social causes.
          </p>
        </div>
      ),
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Today",
      date: "Present",
      description: "Helping hundreds of creators fund their dreams across Africa.",
      extendedContent: (
        <div className="mt-4 space-y-4">
          <Image 
            src="/Team-spirit-bro.svg" 
            alt="Current team" 
            width={400} 
            height={300}
            className="rounded-lg shadow-md"
          />
          <p className="text-gray-700">
            Today, BantuHive has grown to a team of 15 across 3 African countries, supporting over 200 campaigns that have raised millions for African innovators and changemakers.
          </p>
        </div>
      ),
      icon: <Trophy className="w-5 h-5" />
    }
  ];

  const toggleTimelineItem = (id: number) => {
    setExpandedTimeline(expandedTimeline === id ? null : id);
  };

  return (
    <section className="py-16 bg-white" id="our-story">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl text-gray-600 max-w-3xl mx-auto"
          >
            We're building a transparent, inspiring & personalized way to make change
          </motion.p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Timeline */}
          <div className="bg-fundify-muted/20 p-8 rounded-xl sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="text-fundify-primary" />
              Our Journey
            </h3>
            
            <div className="space-y-8 relative before:absolute before:top-0 before:left-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-fundify-primary before:to-fundify-accent">
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-10"
                >
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-fundify-primary flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.date}</p>
                  <p className="text-gray-700 mt-2">{item.description}</p>
                  
                  <button
                    onClick={() => toggleTimelineItem(item.id)}
                    className="mt-3 flex items-center text-fundify-primary hover:text-fundify-accent transition-colors"
                  >
                    {expandedTimeline === item.id ? 'Show less' : 'Learn more'}
                    <ArrowRight className={`ml-1 w-4 h-4 transition-transform ${expandedTimeline === item.id ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {expandedTimeline === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {item.extendedContent}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Story */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HeartHandshake className="text-fundify-primary" />
                Why we started?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                When you see something that needs to change in your community what do you do?
              </p>
              
              <p className="text-lg text-gray-700 mb-6">
                Shout at the TV that 'someone should do something about it'? Rant online about how broken the system is and how people just don't 'get it'?
              </p>
              
              <p className="text-lg text-gray-700 mb-6">
                What if instead of doing that, we all put up our hand to do something - big or small.
              </p>
              
              <p className="text-lg text-gray-700 mb-6">
                All around the world, there are millions of people who already do just that. We built BantuHive for them. To make it incredibly simple for them to fundraise. To make it easy for them to find a community of people who wanted to support them. And to give the rest of us a more transparent and effective way of making the world we want to see.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-2">
                <Flag className="text-fundify-primary" />
                What we've been up to
              </h3>
              <p className="text-lg text-gray-700">
                The idea for BantuHive was born out of personal experience. One of our cofounders, on the verge of fulfilling a lifelong dream to study abroad, found himself needing to raise 30% of his tuition despite already securing a 70% scholarship. His attempts to fundraise on foreign platforms, like GoFundMe, fell short due to the lack of familiarity and participation from the African community.
              </p>
              <p className="text-lg text-gray-700 mt-4">
                This challenge inspired a question: <em>Why isn't there a crowdfunding platform tailored to Africa's unique needs?</em> A platform where Africans can support each other and invest in their collective growth. With this vision, BantuHive was created.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;