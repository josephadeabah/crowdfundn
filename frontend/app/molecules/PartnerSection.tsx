import React from 'react';
import { Partner } from '@/app/types/constant';

interface PartnerSectionProps {
  partners: Partner[] | undefined;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({ partners }) => {
  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6">Our Partners</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners && partners.length > 0 ? (
          partners.map((partner) => (
            <div
              key={partner.id}
              className="relative rounded-xl overflow-hidden group cursor-pointer h-44"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No partners found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerSection;
