import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import Link from 'next/link';
import partnersData from '../../../data.json';
import {
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { Partner } from '@/app/types/constant';
import { useRouter } from 'next/navigation';

const PartnerProgram = () => {
  const router = useRouter();
  // Fetch partners
  const partners: Partner[] = partnersData.partnersprogram;

  return (
    <div className="py-16 bg-gradient-to-br from-fundify-muted to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fundify-primary to-fundify-accent">
                Partner Drive
              </span>
              <span className="ml-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium align-middle">
                coming soon
              </span>
              <div className="absolute -bottom-3 left-0 w-20 h-1 bg-fundify-primary"></div>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Accelerate your fundraising journey by collaborating with our
              verified partners who have a proven track record of helping
              campaigns reach their goals faster.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-fundify-muted p-2 rounded-full">
                  <Zap className="h-5 w-5 text-fundify-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Reach Wider Audiences</h3>
                  <p className="text-gray-600">
                    Get exposure to established audiences that match your
                    campaign's niche
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-fundify-muted p-2 rounded-full">
                  <Trophy className="h-5 w-5 text-fundify-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    Verified Success Records
                  </h3>
                  <p className="text-gray-600">
                    All partners are vetted with proven success rates in
                    crowdfunding
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-3 bg-fundify-muted p-2 rounded-full">
                  <Check className="h-5 w-5 text-fundify-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Simple Application</h3>
                  <p className="text-gray-600">
                    Easy process to connect with the right partners for your
                    campaign
                  </p>
                </div>
              </div>
            </div>
            <a href="/partner-program">
              <Button
                className="bg-fundify-primary hover:bg-fundify-primary/90 text-white"
                size="lg"
                onClick={() => router.push('/partner-apply')}
              >
                Join as a Partner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-lg mx-auto md:max-w-none">
            {partners && partners.length > 0 ? (
              partners
                .slice(0, 4)
                .map((partner: Partner, index) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No partners available at the moment.
              </div>
            )}
          </div>
        </div>

        {partners && partners.length > 4 && (
          <div className="text-center mt-10">
            <a href="/partner-program">
              <Button
                variant="outline"
                className="border-fundify-primary text-fundify-primary"
              >
                View All Partners
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Partner card component
const PartnerCard = ({
  partner,
  style,
}: {
  partner: Partner;
  style?: React.CSSProperties;
}) => {
  // Calculate engagement metrics (this could come from the API in a real scenario)
  const audience = Math.floor(Math.random() * 100000) + 10000;
  const successRate = Math.floor(Math.random() * 40) + 60; // 60-100%

  return (
    <Card
      className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full bg-white animate-fade-in relative"
      style={style}
    >
      <div className="relative w-full h-48">
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-medium">{partner.name}</h3>
              <Check className="h-4 w-4 text-fundify-primary" />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <Users className="h-3 w-3 mr-1 text-fundify-primary" />
                <span>{audience.toLocaleString()}</span>
              </div>
              <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <TrendingUp className="h-3 w-3 mr-1 text-fundify-primary" />
                <span>{successRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <Button
          className="w-full text-sm text-fundify-accent py-1 rounded-full"
          variant="outline"
        >
          Apply to Partner
        </Button>
      </CardContent>
    </Card>
  );
};

export default PartnerProgram;
