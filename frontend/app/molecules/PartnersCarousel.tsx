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
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 px-4 py-6">Our Direct Partners</h2>

      {partners && partners.length > 0 ? (
        <div className="relative overflow-hidden">
          <div className="flex space-x-16 animate-marquee whitespace-nowrap pt-4 mt-11">
            {[...partners, ...partners].map((partner, index) => (
              <TooltipProvider key={`partner-provider-${partner.id}-${index}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-shrink-0 flex items-center justify-center h-28 group">
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                      >
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="h-full max-h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                      </a>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white text-gray-800 px-3 py-2 text-sm font-medium rounded-md shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {partner.name}
                    </a>
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
