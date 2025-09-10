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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-br from-trust/5 via-background to-growth/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Investment Contracts in Ghana
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              How you earn a return depends on the investment contract
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn more with our resources for first-time investors.
            </p>
          </div>
        </div>
      </div>

      {/* Investment Contracts Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Carousel
          className="w-full relative"
          opts={{ align: 'start', loop: false }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {investmentContracts.map((contract, index) => {
              const IconComponent = contract.icon;
              return (
                <CarouselItem
                  key={contract.id}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-trust/30 bg-card/80 backdrop-blur-sm h-full"
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
                            <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-trust transition-colors">
                              {contract.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                {contract.riskLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {contract.description}
                      </CardDescription>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Min. Investment:
                          </span>
                          <span className="font-medium text-card-foreground">
                            {contract.minInvestment}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Return Type:
                          </span>
                          <span className="font-medium text-card-foreground">
                            {contract.returnType}
                          </span>
                        </div>
                      </div>

                      <Link href={`${contract.id}`}>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-trust group-hover:text-trust-foreground group-hover:border-trust transition-all duration-300"
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
          <CarouselPrevious className="absolute -right-16 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-2 top-1/2 -translate-y-1/2" />
        </Carousel>

        {/* Additional Resources Section */}
        <div className="mt-16 text-center">
          <div className="bg-muted/30 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              New to Investing?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Understanding investment contracts is crucial for making informed
              decisions. Each contract type offers different risk levels,
              returns, and investor rights under Ghanaian securities law.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="default" className="bg-trust hover:bg-trust/90">
                <Shield className="mr-2 h-4 w-4" />
                Investment Guide
              </Button>
              <Button variant="outline">
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
