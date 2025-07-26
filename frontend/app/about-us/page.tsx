'use client';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import TimelineSection from '@/app/molecules/TimelineSection';
import { ArrowRight, Heart, Lightbulb, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/auth/AuthContext';
import { motion } from 'framer-motion';

const About = () => {
  const { user } = useAuth();
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="py-16 md:py-24 bg-gradient-to-br from-fundify-muted to-white">
          <div className="container mx-auto px-4">
            <div className="min-h-screen bg-background">
              <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">

                  <div className="space-y-8 text-foreground">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        Our Mission
                      </h2>
                      <p className="text-lg leading-relaxed mb-4">
                        BantuHive is revolutionizing how Ghanaians and the
                        diaspora fund and co-own transformative startups and
                        projects. We believe that every innovative idea deserves
                        a chance to flourish, and every individual should have
                        the opportunity to participate in Ghana's economic
                        growth story.
                      </p>
                      <p className="leading-relaxed">
                        Our platform combines the power of crowdfunding,
                        micro-investment, and gamification to create an
                        ecosystem where entrepreneurs can access capital while
                        investors can discover and support high-impact ventures
                        across Ghana.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        Our Story
                      </h2>
                      <p className="leading-relaxed mb-4">
                        Founded in 2024, BantuHive emerged from the recognition
                        that Ghana's entrepreneurial ecosystem needed a platform
                        that could bridge the gap between innovative ideas and
                        accessible funding. We saw talented entrepreneurs
                        struggling to access capital while potential investors
                        lacked easy ways to discover and support promising
                        ventures.
                      </p>
                      <p className="leading-relaxed">
                        Today, we're proud to be Ghana's leading platform for
                        democratic investment, enabling anyone to participate in
                        building the country's economic future through our
                        innovative three-tier funding model.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        Our Approach
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-card p-6 rounded-lg border">
                          <h3 className="font-semibold mb-2 text-trust">
                            🎁 Donation|Grant-Based
                          </h3>
                          <p className="text-sm">
                            Supporting social impact projects and early-stage
                            innovations through grants and donations.
                          </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border">
                          <h3 className="font-semibold mb-2 text-growth">
                            🎁 Reward-Based
                          </h3>
                          <p className="text-sm">
                            Backing creative projects and product launches with
                            tangible rewards for supporters.
                          </p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border">
                          <h3 className="font-semibold mb-2 text-growth">
                            📈 Equity Investment
                          </h3>
                          <p className="text-sm">
                            Enabling micro-investment in promising startups with
                            potential for financial returns.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-green-600">
                        Why BantuHive?
                      </h2>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-trust mr-2">✓</span>
                          <span>
                            <strong>Fully Compliant:</strong> Licensed and
                            regulated under Ghanaian securities law
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-trust mr-2">✓</span>
                          <span>
                            <strong>Accessible:</strong> Start investing with as
                            little as GHS 50
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-trust mr-2">✓</span>
                          <span>
                            <strong>Transparent:</strong> Full disclosure of
                            risks, fees, and investment terms
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-trust mr-2">✓</span>
                          <span>
                            <strong>Local Focus:</strong> Supporting Ghana's
                            economic development and job creation
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-trust mr-2">✓</span>
                          <span>
                            <strong>Diaspora-Friendly:</strong> Easy
                            participation for Ghanaians worldwide
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add our new Timelinediv */}
        <TimelineSection />

        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div
                ref={(el: HTMLDivElement | null) =>
                  (sectionsRef.current[2] = el)
                }
                className="order-2 md:order-1 opacity-0"
              >
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  alt="Our Mission"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              <div
                ref={(el: HTMLDivElement | null) =>
                  (sectionsRef.current[3] = el)
                }
                className="order-1 md:order-2 opacity-0"
              >
                <h2 className="text-3xl font-bold mb-6 relative">
                  Our Mission
                  <div className="absolute -bottom-3 left-0 w-20 h-1 bg-fundify-primary"></div>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  To democratize access to funding and empower individuals and
                  communities to build legacies and make good things happen.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 bg-fundify-muted p-2 rounded-full">
                      <Lightbulb className="h-5 w-5 text-fundify-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Empowering Creators
                      </h3>
                      <p className="text-gray-600">
                        We provide the tools and resources for creators to
                        succeed.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 bg-fundify-muted p-2 rounded-full">
                      <Heart className="h-5 w-5 text-fundify-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Building Communities
                      </h3>
                      <p className="text-gray-600">
                        We connect creators with passionate impact makers who
                        share their vision.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-1 mr-4 bg-fundify-muted p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-fundify-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">
                        Driving Innovation
                      </h3>
                      <p className="text-gray-600">
                        We support projects that push boundaries and make a
                        difference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div
              ref={(el: HTMLDivElement | null) => (sectionsRef.current[6] = el)}
              className="max-w-3xl mx-auto opacity-0"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join Bantu Hive today and start turning your ideas into reality.
              </p>
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-fundify-primary text-white dark:bg-gray-950 dark:text-gray-50 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 hover:text-gray-700 hover:scale-105 transition-transform duration-300 "
                >
                  <a
                    href={`${user ? '/account/dashboard/create' : '/auth/register'}`}
                  >
                    Start Fundraising Now
                  </a>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
