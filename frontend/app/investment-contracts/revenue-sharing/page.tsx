import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  ArrowLeft,
  PieChart,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Calendar,
} from 'lucide-react';

const RevenueSharing = () => {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="px-4">
            <Link href="/">
              <Button variant="ghost" className="mb-4 hover:bg-trust/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contracts
              </Button>
            </Link>

            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-xl bg-trust/10 text-trust">
                <PieChart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Revenue Sharing
                </h1>
                <p className="text-muted-foreground">
                  Receive a percentage of company revenue
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Medium-Low Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Revenue Based
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Regular Payments
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Is Revenue Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Is Revenue Sharing?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Revenue sharing agreements allow investors to receive a
                    predetermined percentage of a company's total revenue for a
                    specified period. Unlike equity investments, you don't own
                    part of the company, but you benefit directly from its sales
                    performance.
                  </p>
                  <p className="text-muted-foreground">
                    This investment structure is particularly popular in Ghana
                    for supporting local businesses, especially in sectors like
                    agriculture, manufacturing, and services where revenue
                    streams are predictable.
                  </p>
                  <div className="bg-trust/5 border border-trust/20 p-4 rounded-lg">
                    <h5 className="font-medium text-trust mb-2">
                      Key Advantage
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Returns are tied directly to business performance without
                      the complexity of profit calculations. As sales grow, your
                      returns grow proportionally.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* How Returns Work */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-growth" />
                    How You Earn Returns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Revenue Percentage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receive a fixed percentage of gross revenue, typically
                        ranging from 1-10% depending on investment size and
                        company sector.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Payment Schedule
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Payments are usually made monthly or quarterly,
                        providing regular income that fluctuates with business
                        performance.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      You invest GHS 10,000 for 3% revenue share in a retail
                      business for 5 years:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        • If monthly revenue is GHS 50,000: You receive GHS
                        1,500/month
                      </li>
                      <li>
                        • If revenue grows to GHS 75,000: You receive GHS
                        2,250/month
                      </li>
                      <li>
                        • Annual return depends on business growth and seasonal
                        patterns
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Structure */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-trust" />
                    Contract Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Revenue Definition
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Clearly defines what constitutes "revenue" - gross
                          sales, net sales, or specific revenue streams.
                        </p>
                      </div>

                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Payment Terms
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Specifies payment frequency, reporting requirements,
                          and audit rights for revenue verification.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Term Period
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Fixed duration (typically 3-7 years) or until a
                          multiple of initial investment is returned.
                        </p>
                      </div>

                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Minimum Guarantees
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Some agreements include minimum payment thresholds or
                          floors to protect investors.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits and Rights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-trust" />
                    Your Rights and Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Revenue Transparency
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Right to verify revenue figures through regular
                            financial reports
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Regular Payments
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Consistent income stream tied to business
                            performance
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            No Dilution Risk
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Revenue percentage stays fixed regardless of new
                            investments
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Growth Participation
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Benefit directly from business growth and expansion
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sectors and Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-trust" />
                    Suitable Business Sectors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-success/5 border border-success/20 p-3 rounded-lg">
                        <h5 className="font-medium text-success">
                          Retail & E-commerce
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Predictable sales patterns and easy revenue tracking
                        </p>
                      </div>
                      <div className="bg-success/5 border border-success/20 p-3 rounded-lg">
                        <h5 className="font-medium text-success">
                          Agriculture
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Seasonal revenue cycles with growth potential
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-success/5 border border-success/20 p-3 rounded-lg">
                        <h5 className="font-medium text-success">
                          Manufacturing
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          Steady production and sales volumes
                        </p>
                      </div>
                      <div className="bg-success/5 border border-success/20 p-3 rounded-lg">
                        <h5 className="font-medium text-success">Services</h5>
                        <p className="text-xs text-muted-foreground">
                          Recurring revenue models and client relationships
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risks to Consider */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
                    Risks to Consider
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Revenue Volatility
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Your returns fluctuate with business revenue - low sales
                        periods mean lower payments.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        No Ownership Rights
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        You don't own equity or have voting rights in business
                        decisions that could affect revenue.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Revenue Manipulation
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Companies might structure transactions to minimize
                        reported revenue, affecting your returns.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Economic Sensitivity
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Revenue sharing is highly sensitive to economic
                        downturns and market conditions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Risk Level:
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-success/10 text-success"
                      >
                        Medium-Low
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Min. Investment:
                      </span>
                      <span className="text-sm font-medium">GHS 1,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Revenue Share:
                      </span>
                      <span className="text-sm font-medium">
                        1-10% typically
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Term Period:
                      </span>
                      <span className="text-sm font-medium">3-7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Payment Frequency:
                      </span>
                      <span className="text-sm font-medium">
                        Monthly/Quarterly
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Framework */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Legal Framework</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Revenue sharing in Ghana is governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Contracts Act, 1960 (Act 25)</li>
                    <li>• Companies Act, 2019 (Act 992)</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• Individual Contract Terms</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/profit-sharing">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Profit Sharing
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Share in profits instead
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/investment-contracts/debt-securities">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Debt Securities
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Fixed return alternative
                        </div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSharing;
