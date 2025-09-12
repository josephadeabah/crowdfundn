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
  TrendingUp,
  Users,
  Vote,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

const EquityShares = () => {
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
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Equity Shares
                </h1>
                <p className="text-muted-foreground">
                  Direct ownership stake in the company
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium-High Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Voting Rights
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Dividend Eligible
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Equity Shares */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Equity Shares?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Equity shares represent ownership in a company. When you
                    purchase equity shares, you become a shareholder and
                    part-owner of the business. This ownership comes with
                    certain rights and potential rewards, but also carries
                    risks.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's equity crowdfunding market, equity shares allow
                    individual investors to own portions of growing businesses,
                    from startups to established companies looking to expand.
                  </p>
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
                        Capital Appreciation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        If the company grows and becomes more valuable, your
                        shares increase in value. You can sell them for more
                        than you paid.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Dividends
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Companies may distribute profits to shareholders as
                        dividends, typically paid quarterly or annually.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      If you invest GHS 1,000 for 10% equity and the company
                      value grows from GHS 10,000 to GHS 20,000, your shares are
                      now worth GHS 2,000 - a 100% return on investment.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Your Rights as a Shareholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Vote className="mr-2 h-5 w-5 text-trust" />
                    Your Rights as a Shareholder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Voting Rights
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Vote on major company decisions and board elections
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Information Rights
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Access to annual reports and financial statements
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Dividend Rights
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Share in profits when dividends are declared
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Liquidation Rights
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Share in company assets if the business is sold or
                            closed
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
                        Company Performance Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        If the company performs poorly, your shares may lose
                        value or become worthless.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Liquidity Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Equity shares in private companies can be difficult to
                        sell quickly.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Dilution Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Your ownership percentage may decrease if the company
                        issues new shares.
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
                        Medium-High
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Min. Investment:
                      </span>
                      <span className="text-sm font-medium">GHS 500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Voting Rights:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Yes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Dividend Eligible:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Yes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Liquidity:
                      </span>
                      <span className="text-sm font-medium text-warning">
                        Low
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
                    Equity shares in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Companies Act, 2019 (Act 992)</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• SEC Regulations</li>
                    <li>• Ghana Stock Exchange Rules</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/preference-shares">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Preference Shares
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Lower risk alternative
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/investment-contracts/convertible-bonds">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Convertible Bonds
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Debt with equity option
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

export default EquityShares;
