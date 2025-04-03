import React from 'react';
import { Partner } from '../types/constant';
import partnersData from '../../data.json';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';


const PartnersCarousel = () => {
      const partners: Partner[] = partnersData.partners;
    
  return (
    <div className="max-w-7xl mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6">Our Partners</h2>

      {partners && partners.length > 0 ? (
        <div className="relative overflow-hidden py-6">
          <div className="flex space-x-16 animate-marquee whitespace-nowrap pt-4 mt-4">
            {[...partners, ...partners].map((partner, index) => (
              <TooltipProvider key={`partner-provider-${partner.id}-${index}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-shrink-0 flex items-center justify-center h-20">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-full max-h-16 w-auto object-contain"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{partner.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No partners found.</div>
      )}
    </div>
  );
};

export default PartnersCarousel;
