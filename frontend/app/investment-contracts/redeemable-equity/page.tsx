// investment-contracts/redeemable-equity
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
  RotateCcw,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
} from 'lucide-react';

const RedeemableEquity = () => {
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
                <RotateCcw className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Redeemable Equity Agreements
                </h1>
                <p className="text-muted-foreground">
                  Equity with built-in exit mechanism
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Exit Flexibility
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Equity Upside
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Redeemable Equity Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Redeemable Equity Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Redeemable equity agreements provide investors with
                    ownership stakes that include predetermined exit options.
                    The company agrees to repurchase the shares at specified
                    times or under certain conditions, providing liquidity while
                    maintaining equity upside potential.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's investment ecosystem, redeemable equity offers a
                    balanced approach for investors seeking both growth
                    potential and defined exit strategies.
                  </p>
                </CardContent>
              </Card>

              {/* How Returns Work */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-growth" />
                    How You Earn Returns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Capital Appreciation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Benefit from company growth and increased valuation
                        during holding period.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Guaranteed Exit
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Company repurchases shares at predetermined price or
                        valuation multiple.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Scenario
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 50,000 for 5% equity with 3-year redemption at
                      3x multiple. If company grows, you benefit from
                      appreciation. If not, company buys back shares for GHS
                      150,000, ensuring 200% return.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-trust" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Defined Exit
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Clear redemption timeline and valuation methodology
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Dividend Rights
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Participate in profit distributions during holding
                            period
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Voting Rights
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Full shareholder rights until redemption
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Downside Protection
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Minimum return guarantees in some structures
                          </p>
                        </div>
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
                        Redemption Default
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Company may lack funds to honor redemption obligations.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Limited Upside
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Capped returns if company performance exceeds redemption
                        multiple.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Company Financial Strain
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Redemption payments may strain company cash flow.
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
                        className="bg-warning/10 text-warning"
                      >
                        Medium
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Min. Investment:
                      </span>
                      <span className="text-sm font-medium">GHS 10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Term:
                      </span>
                      <span className="text-sm font-medium">3-7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Redemption Multiple:
                      </span>
                      <span className="text-sm font-medium">2-5x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Liquidity:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Medium
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
                    Redeemable equity in Ghana is governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Companies Act, 2019 (Act 992)</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• SEC Regulations on Share Redemptions</li>
                    <li>• Contract Law Principles</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/equity-shares">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">Equity Shares</div>
                        <div className="text-xs text-muted-foreground">
                          Standard ownership
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/investment-contracts/repurchase-agreements">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Repurchase Agreements
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Buy-back arrangements
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

export default RedeemableEquity;
