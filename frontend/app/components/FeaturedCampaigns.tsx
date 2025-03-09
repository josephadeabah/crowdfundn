'use client';
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CampaignCard from './CampaignCard';

// Sample campaign data
const campaigns = [
  {
    id: 1,
    title: 'EcoRide: Solar-Powered Electric Bike',
    description:
      'An innovative electric bike that charges itself with built-in solar panels for eco-friendly urban transport.',
    category: 'Green Tech',
    funded: 78,
    goal: 50000,
    current: 39000,
    daysLeft: 15,
    imageUrl:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    creator: {
      name: 'GreenWheels Inc.',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    rewards: ['Exclusive Early Access', 'Limited Edition Model'],
  },
  {
    id: 2,
    title: 'Pocket Chef: AI-Powered Smart Kitchen Device',
    description:
      'Your personal AI chef that suggests recipes based on ingredients you have and guides you through cooking.',
    category: 'Food Tech',
    funded: 92,
    goal: 75000,
    current: 69000,
    daysLeft: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1586295166487-b265f7e83a7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    creator: {
      name: 'CulinaryTech',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    rewards: ['Recipe Book', 'Premium App Access'],
  },
  {
    id: 3,
    title: 'Dreamscape VR: Interactive Storytelling',
    description:
      'A virtual reality platform that turns books into immersive, interactive experiences you can step into.',
    category: 'Entertainment',
    funded: 45,
    goal: 100000,
    current: 45000,
    daysLeft: 21,
    imageUrl:
      'https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    creator: {
      name: 'Narrative Labs',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
    },
    rewards: ['First Edition Access', 'Creator Community Membership'],
  },
  {
    id: 4,
    title: 'Aqua Guardian: Smart Water Conservation System',
    description:
      'Monitor and optimize your household water usage with this AI-powered conservation system.',
    category: 'Sustainability',
    funded: 63,
    goal: 30000,
    current: 18900,
    daysLeft: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    creator: {
      name: 'WaterWise Solutions',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
    },
    rewards: ['Water Analytics Dashboard', 'Installation Service'],
  },
  {
    id: 5,
    title: 'Luna: Adaptive Learning Toy for Children',
    description:
      "An interactive toy that adapts to your child's learning style and grows with them over time.",
    category: 'Education',
    funded: 87,
    goal: 45000,
    current: 39150,
    daysLeft: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1555009779-7a49f5769705?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    creator: {
      name: 'PlayLearn Designs',
      avatarUrl: 'https://i.pravatar.cc/150?img=17',
    },
    rewards: ['Early Bird Discount', 'Educational Activity Pack'],
  },
];

const FeaturedCampaigns = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentFilter, setCurrentFilter] = useState('All');
  const filters = ['All', 'Tech', 'Creative', 'Community', 'Green'];

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div className="animate-fade-up">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Campaigns
            </h2>
          </div>

          <div className="flex mt-6 md:mt-0 gap-2 animate-fade-up">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 animate-fade-up">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                currentFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="snap-start flex-none w-[280px] md:w-[350px]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CampaignCard campaign={campaign} />
            </div>
          ))}
        </div>

        {/* Applied CSS without using the style tag with jsx prop */}
        <div className="no-scrollbar"></div>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
