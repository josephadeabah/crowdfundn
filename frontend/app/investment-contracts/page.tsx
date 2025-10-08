import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import {
  ExternalLink,
  TrendingUp,
  Shield,
  DollarSign,
  PieChart,
  BarChart3,
  FileText,
  Scale,
  Target,
  GitMerge,
  Lock,
  RotateCcw,
  Leaf,
  ShoppingCart,
  Building,
  Receipt,
  Home,
  Crown,
  Layers,
} from 'lucide-react';

const investmentContracts = [
  // Original contracts
  {
    id: '/investment-contracts/equity-shares',
    title: 'Equity Shares',
    description:
      'Direct ownership stake in the company with voting rights and potential dividends.',
    icon: TrendingUp,
    riskLevel: 'Medium-High',
    minInvestment: 'GHS 500',
    returnType: 'Capital appreciation + Dividends',
  },
  {
    id: '/investment-contracts/preference-shares',
    title: 'Preference Shares',
    description:
      'Priority shares with fixed dividend rates and preferential treatment in liquidation.',
    icon: Shield,
    riskLevel: 'Medium',
    minInvestment: 'GHS 1,000',
    returnType: 'Fixed dividends',
  },
  {
    id: '/investment-contracts/quasi-equity',
    title: 'Quasi-Equity',
    description:
      'Hybrid investment with debt security and performance-linked equity-like returns.',
    icon: Scale,
    riskLevel: 'Medium',
    minInvestment: 'GHS 1,000',
    returnType: 'Performance linked',
  },
  {
    id: '/investment-contracts/convertible-bonds',
    title: 'Convertible Bonds',
    description:
      'Debt securities that can be converted to equity shares at predetermined conditions.',
    icon: BarChart3,
    riskLevel: 'Medium',
    minInvestment: 'GHS 2,000',
    returnType: 'Interest + Conversion rights',
  },
  {
    id: '/investment-contracts/debt-securities',
    title: 'Debt Securities',
    description:
      'Fixed-income investments with guaranteed returns and principal protection.',
    icon: FileText,
    riskLevel: 'Low-Medium',
    minInvestment: 'GHS 500',
    returnType: 'Fixed interest',
  },
  {
    id: '/investment-contracts/revenue-sharing',
    title: 'Revenue Sharing',
    description:
      'Receive a percentage of company revenue for a specified period.',
    icon: PieChart,
    riskLevel: 'Medium-Low',
    minInvestment: 'GHS 1,500',
    returnType: 'Revenue percentage',
  },
  {
    id: '/investment-contracts/profit-sharing',
    title: 'Profit Sharing',
    description:
      "Share in the company's profits without owning equity or having voting rights.",
    icon: DollarSign,
    riskLevel: 'Medium',
    minInvestment: 'GHS 1,000',
    returnType: 'Profit percentage',
  },
  // Newly added contracts
  {
    id: '/investment-contracts/share-option-agreements',
    title: 'Share Option Agreements',
    description:
      'Right to purchase shares at predetermined price with limited downside risk.',
    icon: Target,
    riskLevel: 'Medium',
    minInvestment: 'GHS 1,000',
    returnType: 'Price appreciation',
  },
  {
    id: '/investment-contracts/convertible-securities',
    title: 'Convertible Securities',
    description:
      'Hybrid instruments with debt and equity features for balanced risk-return.',
    icon: GitMerge,
    riskLevel: 'Medium',
    minInvestment: 'GHS 5,000',
    returnType: 'Interest + Conversion option',
  },
  {
    id: '/investment-contracts/secured-unsecured-debt',
    title: 'Secured & Unsecured Debt',
    description:
      'Fixed income investments with varying risk levels and collateral protection.',
    icon: Lock,
    riskLevel: 'Low-Medium',
    minInvestment: 'GHS 2,000',
    returnType: 'Fixed interest',
  },
  {
    id: '/investment-contracts/redeemable-equity',
    title: 'Redeemable Equity',
    description:
      'Equity with built-in exit mechanism through company repurchase.',
    icon: RotateCcw,
    riskLevel: 'Medium',
    minInvestment: 'GHS 10,000',
    returnType: 'Appreciation + Guaranteed exit',
  },
  {
    id: '/investment-contracts/sustainable-debt',
    title: 'Sustainable Debt',
    description:
      'Green, social and sustainability bonds financing positive environmental impact.',
    icon: Leaf,
    riskLevel: 'Low-Medium',
    minInvestment: 'GHS 5,000',
    returnType: 'Fixed interest + Impact',
  },
  {
    id: '/investment-contracts/offtake-agreements',
    title: 'Offtake Agreements',
    description:
      'Pre-arranged purchase contracts for future production with revenue certainty.',
    icon: ShoppingCart,
    riskLevel: 'Low',
    minInvestment: 'GHS 25,000',
    returnType: 'Revenue sharing',
  },
  {
    id: '/investment-contracts/leasing-agreements',
    title: 'Leasing Agreements',
    description:
      'Asset financing through rental arrangements with regular income streams.',
    icon: Building,
    riskLevel: 'Low',
    minInvestment: 'GHS 50,000',
    returnType: 'Monthly rentals',
  },
  {
    id: '/investment-contracts/factoring-agreements',
    title: 'Factoring Agreements',
    description:
      'Accounts receivable financing with short-term, secured returns.',
    icon: Receipt,
    riskLevel: 'Low',
    minInvestment: 'GHS 10,000',
    returnType: 'Factoring fees',
  },
  {
    id: '/investment-contracts/rental-agreements',
    title: 'Rental Agreements',
    description:
      'Property investment through tenant rentals with dual return potential.',
    icon: Home,
    riskLevel: 'Low',
    minInvestment: 'GHS 50,000',
    returnType: 'Rent + Appreciation',
  },
  {
    id: '/investment-contracts/repurchase-agreements',
    title: 'Repurchase Agreements',
    description:
      'Guaranteed exit through company buy-back at predetermined price.',
    icon: RotateCcw,
    riskLevel: 'Low',
    minInvestment: 'GHS 25,000',
    returnType: 'Fixed premium',
  },
  {
    id: '/investment-contracts/royalty-agreements',
    title: 'Royalty Agreements',
    description:
      'Revenue-based returns from intellectual property or product sales.',
    icon: Crown,
    riskLevel: 'Medium',
    minInvestment: 'GHS 20,000',
    returnType: 'Revenue percentage',
  },
  {
    id: '/investment-contracts/impact-linked-investments',
    title: 'Impact-linked Investments',
    description:
      'Financial returns tied to achievement of social and environmental impact.',
    icon: Target,
    riskLevel: 'Medium',
    minInvestment: 'GHS 100,000',
    returnType: 'Base + Impact premium',
  },
  {
    id: '/investment-contracts/blended-investments',
    title: 'Blended Investments',
    description:
      'Combining different capital sources for optimal impact and returns.',
    icon: Layers,
    riskLevel: 'Medium',
    minInvestment: 'GHS 250,000',
    returnType: 'Risk-adjusted returns',
  },
];

const InvestmentContracts = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Investment Contracts
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              How you earn a return depends on the investment contract
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of investment instruments tailored
              for the Ghanaian market.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Contracts Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        <div className="relative">
          <Carousel
            className="w-full"
            opts={{ align: 'start', loop: false, dragFree: true }}
          >
            <CarouselContent className="-ml-4">
              {investmentContracts.map((contract, index) => {
                const IconComponent = contract.icon;
                return (
                  <CarouselItem
                    key={contract.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 hover:border-trust/30 bg-white h-full"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-trust/10 text-trust">
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-trust transition-colors">
                                {contract.title}
                              </CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                  {contract.riskLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {contract.description}
                        </CardDescription>

                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Min. Investment:
                            </span>
                            <span className="font-medium text-gray-800">
                              {contract.minInvestment}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Return Type:</span>
                            <span className="font-medium text-gray-800">
                              {contract.returnType}
                            </span>
                          </div>
                        </div>

                        <Link href={`${contract.id}`}>
                          <Button
                            variant="outline"
                            className="w-full bg-white text-gray-800 group-hover:text-white group-hover:bg-trust transition-all duration-300 border-gray-300"
                          >
                            Learn more
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white border-gray-300 hover:bg-gray-100 md:-left-4 md:h-10 md:w-10" />
            <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white border-gray-300 hover:bg-gray-100 md:-right-4 md:h-10 md:w-10" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default InvestmentContracts;
