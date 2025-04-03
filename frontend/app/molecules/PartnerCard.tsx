import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Partner } from '../types/constant';

interface PartnerCardProps {
  partner: Partner;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  return (
    <Card className="partner-card h-52 overflow-hidden">
      <CardContent className="p-0 h-full relative">
        <div className="h-full w-full relative">
          <img
            src={partner.logo}
            alt={partner.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
            <h3 className="font-medium text-center text-white">
              {partner.name}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerCard;
