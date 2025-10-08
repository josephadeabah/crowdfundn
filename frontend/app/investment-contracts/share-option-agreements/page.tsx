// investment-contracts/share-option-agreements
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
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
} from 'lucide-react';

const ShareOptionAgreements = () => {
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
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Share Option Agreements
                </h1>
                <p className="text-muted-foreground">
                  Right to purchase shares at predetermined price
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Future Equity
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Upside Potential
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Share Option Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Share Option Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Share option agreements grant investors the right, but not
                    the obligation, to purchase company shares at a
                    predetermined price (strike price) within a specified time
                    period. This allows investors to benefit from future company
                    growth while limiting downside risk.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's investment landscape, share options are commonly
                    used in early-stage companies and employee incentive plans,
                    providing flexibility for both investors and businesses.
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
                        Price Appreciation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Exercise your option to buy shares at the strike price
                        and sell them at the current market price if higher.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Strategic Timing
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Choose when to exercise options based on company
                        performance and market conditions.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      If you have options to buy 1,000 shares at GHS 2.00 each
                      and the share price rises to GHS 5.00, you can exercise
                      your options for GHS 2,000 and immediately sell for GHS
                      5,000 - a GHS 3,000 profit.
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
                            Fixed Strike Price
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Purchase shares at predetermined price regardless of
                            market value
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Limited Downside
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Maximum loss is the option premium paid
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Exercise Period
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Flexible timing to exercise within agreed timeframe
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            No Obligation
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Option to walk away if share price doesn't increase
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
                        Expiration Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Options become worthless if not exercised before
                        expiration date.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Price Volatility
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Share prices may not reach strike price, making options
                        unprofitable.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Liquidity Constraints
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Difficulty selling shares after exercise in private
                        companies.
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
                      <span className="text-sm font-medium">GHS 1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Voting Rights:
                      </span>
                      <span className="text-sm font-medium text-warning">
                        Upon Exercise
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Term:
                      </span>
                      <span className="text-sm font-medium">3-5 years</span>
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
                    Share options in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Companies Act, 2019 (Act 992)</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• SEC Regulations on Derivatives</li>
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
                          Direct ownership
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/investment-contracts/convertible-securities">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Convertible Securities
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Flexible conversion rights
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

export default ShareOptionAgreements;
