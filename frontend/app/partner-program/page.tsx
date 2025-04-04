'use client';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  ArrowRight,
  Award,
  Check,
  DollarSign,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import partnersData from '../../data.json';
import { Partner } from '@/app/types/constant';

const PartnerProgram = () => {
  const partners: Partner[] = partnersData.partnersprogram;

  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth scroll animation setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 },
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="py-16 md:py-24 bg-gradient-to-br from-fundify-muted to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div
                ref={(el) => (sectionsRef.current[0] = el)}
                className="opacity-0"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
                    Partner Drive
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join our exclusive network of influential partners and help
                  fundraisers achieve their goals while growing your own
                  audience and impact.
                </p>
                <Button
                  className="bg-fundify-primary hover:bg-fundify-primary/90 text-white"
                  size="lg"
                >
                  Apply to Become a Partner
                </Button>
              </div>

              <div
                ref={(el) => (sectionsRef.current[1] = el)}
                className="opacity-0"
              >
                <img
                  src="/bantuhive-hero-img.png"
                  alt="Partner Program"
                  className="w-full h-auto rounded-lg shadow-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Split Section 1 */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div
                ref={(el) => (sectionsRef.current[2] = el)}
                className="order-2 md:order-1 opacity-0"
              >
                <img
                  src="/drive1.jpg"
                  alt="Benefits"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              <div
                ref={(el) => (sectionsRef.current[3] = el)}
                className="order-1 md:order-2 opacity-0"
              >
                <h2 className="text-3xl font-bold mb-6 relative">
                  Partner Benefits
                  <div className="absolute -bottom-3 left-0 w-20 h-1 bg-fundify-primary"></div>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 bg-fundify-muted p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-fundify-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Earn Commissions
                      </h3>
                      <p className="text-gray-600">
                        Receive competitive commissions for successful campaign
                        referrals.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 bg-fundify-muted p-2 rounded-full">
                      <Users className="h-5 w-5 text-fundify-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Grow Your Audience
                      </h3>
                      <p className="text-gray-600">
                        Increase your visibility by being featured on our
                        platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 bg-fundify-muted p-2 rounded-full">
                      <Star className="h-5 w-5 text-fundify-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Exclusive Access
                      </h3>
                      <p className="text-gray-600">
                        Get early access to promising campaigns and special
                        events.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Split Section 2 */}
        <div className="py-16 bg-fundify-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div
                ref={(el) => (sectionsRef.current[4] = el)}
                className="opacity-0"
              >
                <h2 className="text-3xl font-bold mb-6 relative">
                  How It Works
                  <div className="absolute -bottom-3 left-0 w-20 h-1 bg-fundify-primary"></div>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fundify-primary text-white flex items-center justify-center mr-4">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Apply</h3>
                      <p className="text-gray-600">
                        Submit your application with details about your audience
                        and previous collaborations.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fundify-primary text-white flex items-center justify-center mr-4">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Get Verified</h3>
                      <p className="text-gray-600">
                        Our team will review your application and verify your
                        credentials.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fundify-primary text-white flex items-center justify-center mr-4">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Connect</h3>
                      <p className="text-gray-600">
                        Start receiving partnership requests from campaign
                        creators.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fundify-primary text-white flex items-center justify-center mr-4">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Collaborate</h3>
                      <p className="text-gray-600">
                        Work together to boost campaign success and earn money.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={(el) => (sectionsRef.current[5] = el)}
                className="opacity-0"
              >
                <img
                  src="/drive2.jpg"
                  alt="How It Works"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div
              ref={(el) => (sectionsRef.current[6] = el)}
              className="max-w-3xl mx-auto text-center mb-12 opacity-0"
            >
              <h2 className="text-3xl font-bold mb-4">
                Meet Our Verified Partners
              </h2>
              <p className="text-lg text-gray-600">
                Our network of trusted partners has helped hundreds of campaigns
                reach their goals.
              </p>
            </div>

            <div
              ref={(el) => (sectionsRef.current[7] = el)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 opacity-0"
            >
              {partners && partners.length > 0 ? (
                partners.map((partner: Partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No partners available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          ref={(el) => (sectionsRef.current[8] = el)}
          className="py-16 bg-gradient-to-r from-fundify-primary to-fundify-accent opacity-0"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join Our Partner Network?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Help campaigns succeed while growing your influence and income.
            </p>
            <Button
              size="lg"
              className="bg-white text-fundify-primary hover:bg-white/90"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Partner card component
const PartnerCard = ({
  partner,
  style,
}: {
  partner: Partner;
  style?: React.CSSProperties;
}) => {
  // Calculate engagement metrics (this could come from the API in a real scenario)
  const audience = Math.floor(Math.random() * 100000) + 10000;
  const successRate = Math.floor(Math.random() * 40) + 60; // 60-100%

  return (
    <Card
      className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full bg-white animate-fade-in relative"
      style={style}
    >
      <div className="relative w-full h-48">
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-medium">{partner.name}</h3>
              <Check className="h-4 w-4 text-fundify-primary" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <Users className="h-3 w-3 mr-1 text-fundify-primary" />
                <span>{audience.toLocaleString()}</span>
              </div>
              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <TrendingUp className="h-3 w-3 mr-1 text-fundify-primary" />
                <span>{successRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <Button className="w-full text-sm text-fundify-accent py-1 rounded-full" variant="outline">
          Apply to Partner
        </Button>
      </CardContent>
    </Card>
  );
};

export default PartnerProgram;
