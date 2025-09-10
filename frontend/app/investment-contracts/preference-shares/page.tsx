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
  Shield,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
} from 'lucide-react';

const PreferenceShares = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-trust/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contracts
            </Button>
          </Link>

          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-trust/10 text-trust">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Preference Shares
              </h1>
              <p className="text-muted-foreground">
                Priority shares with fixed dividend rates
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-success/10 text-success">
              Medium Risk
            </Badge>
            <Badge variant="secondary" className="bg-trust/10 text-trust">
              Fixed Dividends
            </Badge>
            <Badge variant="secondary" className="bg-growth/10 text-growth">
              Priority Rights
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What Are Preference Shares */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-trust" />
                  What Are Preference Shares?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Preference shares are a type of equity that gives holders
                  preferential treatment over ordinary shareholders. They
                  typically offer fixed dividend rates and priority in receiving
                  dividends and assets during liquidation.
                </p>
                <p className="text-muted-foreground">
                  In Ghana's investment landscape, preference shares provide a
                  middle ground between debt and equity investments, offering
                  more predictable returns than ordinary shares while still
                  providing ownership in the company.
                </p>
                <div className="bg-trust/5 border border-trust/20 p-4 rounded-lg">
                  <h5 className="font-medium text-trust mb-2">Key Advantage</h5>
                  <p className="text-sm text-muted-foreground">
                    Preference shareholders receive dividends before ordinary
                    shareholders and have priority claims on company assets if
                    the business is liquidated.
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
                      Fixed Dividends
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Receive predetermined dividend rates, typically higher
                      than ordinary shares. These are paid before any dividends
                      to ordinary shareholders.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">
                      Capital Appreciation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Limited capital growth potential compared to ordinary
                      shares, but more stable and predictable returns.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">
                    Example Return Calculation
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    If you invest GHS 2,000 in preference shares with a 8% fixed
                    dividend rate, you'll receive GHS 160 annually in dividends,
                    regardless of company performance (as long as profits
                    allow).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Types of Preference Shares */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-trust" />
                  Types of Preference Shares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Cumulative
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Unpaid dividends accumulate and must be paid before
                        ordinary shareholders receive any dividends.
                      </p>
                    </div>

                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Redeemable
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Company can buy back these shares at predetermined
                        prices and dates.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Non-Cumulative
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        If dividends aren't paid in a year, shareholders forfeit
                        that year's dividend permanently.
                      </p>
                    </div>

                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Convertible
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Can be converted to ordinary shares under specific
                        conditions and timeframes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-trust" />
                  Your Rights as a Preference Shareholder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Priority Dividends
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Receive dividends before ordinary shareholders
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Liquidation Priority
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Higher claim on assets than ordinary shareholders
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Fixed Returns
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Predetermined dividend rates provide stability
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Limited Voting
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Usually no voting rights unless dividends are in
                          arrears
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
                      Limited Growth Potential
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Fixed dividends mean you won't benefit as much from
                      company growth compared to ordinary shares.
                    </p>
                  </div>

                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">
                      Interest Rate Risk
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Rising interest rates can make fixed-rate preference
                      shares less attractive.
                    </p>
                  </div>

                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">
                      Company Performance Risk
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      If the company can't pay dividends, preference
                      shareholders may receive nothing.
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
                      Medium
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Min. Investment:
                    </span>
                    <span className="text-sm font-medium">GHS 1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Voting Rights:
                    </span>
                    <span className="text-sm font-medium text-warning">
                      Limited
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Dividend Priority:
                    </span>
                    <span className="text-sm font-medium text-success">
                      High
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Liquidity:
                    </span>
                    <span className="text-sm font-medium text-warning">
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
                  Preference shares in Ghana are governed by:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Companies Act, 2019 (Act 992)</li>
                  <li>• Securities Industry Act, 2016</li>
                  <li>• SEC Guidelines on Preference Shares</li>
                  <li>• Company Articles of Association</li>
                </ul>
              </CardContent>
            </Card>

            {/* Related Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Contracts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/equity-shares">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">Equity Shares</div>
                      <div className="text-xs text-muted-foreground">
                        Higher growth potential
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/convertible-bonds">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        Convertible Bonds
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Debt with conversion option
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
  );
};

export default PreferenceShares;
