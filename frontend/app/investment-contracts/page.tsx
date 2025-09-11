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
} from 'lucide-react';

const investmentContracts = [
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
];

const InvestmentContracts = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Investment Contracts in Ghana
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              How you earn a return depends on the investment contract
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn more with our resources for first-time investors.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Contracts Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-16 relative">
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
                      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-gray-200 hover:border-blue-500 bg-white h-full"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
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
                            <span className="text-gray-600">
                              Return Type:
                            </span>
                            <span className="font-medium text-gray-800">
                              {contract.returnType}
                            </span>
                          </div>
                        </div>

                        <Link href={`${contract.id}`}>
                          <Button
                            variant="outline"
                            className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 border-gray-300"
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

        {/* Additional Resources Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-100 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              New to Investing?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Understanding investment contracts is crucial for making informed
              decisions. Each contract type offers different risk levels,
              returns, and investor rights under Ghanaian securities law.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Shield className="mr-2 h-4 w-4" />
                Investment Guide
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                <FileText className="mr-2 h-4 w-4" />
                Legal Framework
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentContracts;