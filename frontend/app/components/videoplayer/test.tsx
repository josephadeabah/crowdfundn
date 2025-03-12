
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { VideoPlayer } from './videoplayar';

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwYzkuOTQgMCAxOCA4LjA2IDE4IDE4aDEyeiIgZmlsbD0icmdiYSgwLDAsMCwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-50 -z-10"></div>
      
       <div className="container mx-auto px-6 py-24 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2 space-y-8 animate-fade-in">
            <div className="space-y-2">
              <div className="bg-video/10 text-video px-4 py-1.5 rounded-full inline-flex items-center text-sm font-medium">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-video opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-video"></span>
                </span>
                Launching our beta platform soon
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-balance leading-tight text-gray-900">
                <span className="block">Fund your projects,</span>
                <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent">earn rewards together</span>
              </h1>
            </div>
            
            <p className="text-lg text-gray-700 max-w-2xl">
              Our gamified platform revolutionizes crowdfunding by rewarding backers and creators alike. 
              Join our community to find innovative projects or get your ideas funded with our unique 
              reward-based ecosystem.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 rounded-lg bg-gray-900 text-white font-medium transition-all duration-300 
                                hover:bg-gray-800 hover:shadow-lg hover:translate-y-[-2px]">
                Get Started
              </button>
              <button className="px-8 py-3 rounded-lg border border-gray-200 bg-white/80 text-gray-900 font-medium transition-all duration-300 
                               hover:bg-gray-50 hover:border-gray-300">
                How It Works
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={cn(
                    "w-10 h-10 rounded-full border-2 border-white flex items-center justify-center",
                    i === 1 ? "bg-blue-100 text-blue-600" : 
                    i === 2 ? "bg-purple-100 text-purple-600" :
                    i === 3 ? "bg-green-100 text-green-600" : 
                    "bg-orange-100 text-orange-600"
                  )}>
                    <span className="text-sm font-semibold">{i === 1 ? 'JD' : i === 2 ? 'SA' : i === 3 ? 'TK' : 'MP'}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">1,200+</span> backers already joined
              </div>
            </div>
          </div>
          
          {/* Right content with video */}
          <div className="w-full lg:w-1/2 relative animate-fade-in">
            <div className="relative rounded-xl overflow-hidden shadow-2xl group">
              {/* Thumbnail image */}
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80" 
                alt="Video thumbnail" 
                className="w-full aspect-video object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                {/* Play button */}
                <button 
                  onClick={openVideo}
                  className="group/button video-play-button"
                  aria-label="Play video"
                >
                  <Play fill="white" size={24} className="ml-1.5" />
                </button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-gray-200/50 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 -top-6 -left-6 w-40 h-40 bg-video/10 rounded-full blur-3xl"></div>
          </div>
        </div>
       </div>
      
      {/* Video Player Modal */}
      <VideoPlayer 
        videoSrc="https://static.videezy.com/system/resources/previews/000/039/511/original/Marketing.mp4" 
        isOpen={isVideoOpen} 
        onClose={closeVideo} 
      />
    </div>
  );
}
