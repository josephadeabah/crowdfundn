'use client';
import React from 'react';
import { motion } from 'framer-motion';

const OurStorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl text-gray-600 max-w-3xl mx-auto"
          >
            We're building a transparent, inspiring & personalized way to make change
          </motion.p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Timeline */}
          <div className="bg-fundify-muted/20 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Journey</h3>
            
            <div className="space-y-8 relative before:absolute before:top-0 before:left-5 before:h-full before:w-0.5 before:bg-fundify-primary">
              {/* Timeline Item 1 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-fundify-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h4 className="text-xl font-semibold mb-2">Founded</h4>
                <p className="text-gray-600">January 2023</p>
                <p className="text-gray-700 mt-2">
                  BantuHive was founded with a vision to revolutionize crowdfunding in Africa.
                </p>
              </div>
              
              {/* Timeline Item 2 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-fundify-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h4 className="text-xl font-semibold mb-2">First Campaign</h4>
                <p className="text-gray-600">March 2023</p>
                <p className="text-gray-700 mt-2">
                  Launched our first successful campaign, proving the concept works.
                </p>
              </div>
              
              {/* Timeline Item 3 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-fundify-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h4 className="text-xl font-semibold mb-2">Platform Launch</h4>
                <p className="text-gray-600">June 2023</p>
                <p className="text-gray-700 mt-2">
                  Officially launched our platform to the public with 50+ campaigns.
                </p>
              </div>
              
              {/* Timeline Item 4 */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-fundify-primary flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h4 className="text-xl font-semibold mb-2">Today</h4>
                <p className="text-gray-600">Present</p>
                <p className="text-gray-700 mt-2">
                  Helping hundreds of creators fund their dreams across Africa.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Story */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why we started?</h3>
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
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">What we've been up to</h3>
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