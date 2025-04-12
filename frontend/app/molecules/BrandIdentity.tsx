import React from 'react';
import {
  BrickWall,
  Sparkles,
  UserPlus,
  Zap,
  Handshake,
} from 'lucide-react';

const BrandIdentity = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Left Container - Mission and Identity */}
      <div className="lg:w-1/2 space-y-8">
        {/* Mission statement */}
        <div className="space-y-4">
          <p className="text-2xl font-light">
            <span className="block font-medium text-gray-900">
              We're not waiting for saviors.
            </span>
            <span className="block text-gray-700">
              We are building with the people who believe, invest, and rise
              together.
            </span>
          </p>
        </div>

        {/* Geographic connection */}
        <div className="py-6 border-y border-gray-200">
          <p className="text-xl font-medium text-gray-600 tracking-wide">
            <span className="flex flex-wrap gap-x-2">
              <span>From Accra to Nairobi,</span>
              <span>London to Atlanta —</span>
            </span>
            <span className="block text-fundify-primary font-semibold mt-3 text-2xl">
              we are the Hive.
            </span>
          </p>
        </div>

        {/* Core identity */}
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-gray-900">
            We are <span className="text-fundify-primary">Bantu Hive</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-full bg-fundify-accent/10">
                <Sparkles className="h-5 w-5 text-fundify-accent" />
              </div>
              <span>Africa's Launchpad</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-full bg-fundify-accent/10">
                <BrickWall className="h-5 w-5 text-fundify-accent" />
              </div>
              <span>The Diaspora's Bridge</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-full bg-fundify-accent/10">
                <Zap className="h-5 w-5 text-fundify-accent" />
              </div>
              <span>Your Impact Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Container - Call to Action */}
      <div className="lg:w-1/2 flex flex-col justify-center h-full bg-gradient-to-br from-fundify-primary/5 to-white p-8 rounded-xl">
        <div className="space-y-8">
          {/* Visual element */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-fundify-primary/10 flex items-center justify-center">
              <Handshake className="h-10 w-10 text-fundify-primary" />
            </div>
          </div>

          {/* CTA section */}
          <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to co-create the future?
            </h3>
            <p className="text-lg text-gray-600">
              Join thousands already building bridges across continents
            </p>
            <button className="w-full max-w-xs mx-auto flex items-center justify-center px-8 py-4 bg-fundify-primary text-white text-lg font-medium rounded-lg hover:bg-fundify-primary/90 transition-all shadow-md hover:shadow-lg gap-3">
              <UserPlus className="h-5 w-5" />
              Join the movement
            </button>
          </div>

          {/* Closing statement */}
          <div className="pt-6 space-y-3 text-center">
            <p className="text-xl font-medium text-gray-800">
              Build what matters.
            </p>
            <p className="text-lg text-gray-600">
              Let's raise more than funds —{' '}
              <span className="font-medium text-fundify-accent">
                let's raise a generation.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandIdentity;
