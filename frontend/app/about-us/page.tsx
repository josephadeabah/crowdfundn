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
        <section className="py-16 md:py-24 bg-gradient-to-br from-fundify-muted to-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div
                ref={(el: HTMLDivElement | null) =>
                  (sectionsRef.current[0] = el)
                }
                className="opacity-0"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
                    About Bantu Hive
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Bantu Hive is an impact acceleration platform that connects
                  innovators, creators, and change-makers with impact makers who
                  are passionate about bringing ideas to life.
                </p>
                <Button
                  className="bg-fundify-primary hover:bg-fundify-primary/90 text-white"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>

              <div
                ref={(el: HTMLDivElement | null) =>
                  (sectionsRef.current[1] = el)
                }
                className="opacity-0"
              >
                <img
                  src="/bantuhive.svg"
                  alt="About Bantu Hive"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Add our new TimelineSection */}
        <TimelineSection />

        <section className="py-16 bg-white">
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
                  Our mission is to provide an accessible, transparent, and
                  engaging platform for funding initiatives that drive positive
                  change across Africa. We believe in the potential of every
                  idea and strive to provide a platform that fosters innovation,
                  collaboration, and positive change.
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
        </section>

        <section className="py-16 bg-fundify-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div
                ref={(el: HTMLDivElement | null) =>
                  (sectionsRef.current[4] = el)
                }
                className="opacity-0"
              >
                <h2 className="text-3xl font-bold mb-6 relative">
                  Our Team
                  <div className="absolute -bottom-3 left-0 w-20 h-1 bg-fundify-primary"></div>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  We are a diverse team of passionate individuals dedicated to
                  making crowdfunding accessible and impactful for everyone.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <img
                        src="/placeholder.svg"
                        alt="Team Member"
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">Joseph Adeabah</h4>
                      <p className="text-gray-500">Co-Founder</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <img
                        src="/placeholder.svg"
                        alt="Team Member"
                        className="w-16 h-16 rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">Nqoba Manana</h4>
                      <p className="text-gray-500">Co-Founder</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={(el: HTMLDivElement | null) =>
                  (sectionsRef.current[5] = el)
                }
                className="opacity-0"
              >
                <img
                  src="/combined.webp"
                  alt="Our Team"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
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
        </section>
      </main>
    </div>
  );
};

export default About;
