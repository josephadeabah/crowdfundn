// investment-contracts/repurchase-agreements
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

const RepurchaseAgreements = () => {
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
                  Repurchase & Buy-back Agreements
                </h1>
                <p className="text-muted-foreground">
                  Guaranteed exit through company repurchase
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Guaranteed Exit
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Fixed Returns
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Repurchase Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Repurchase Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Repurchase agreements (repos) are contracts where a company
                    agrees to buy back securities or assets from investors at a
                    predetermined price and date. This provides investors with a
                    guaranteed exit strategy while giving companies flexible
                    financing options.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's investment landscape, repurchase agreements offer
                    lower-risk opportunities with defined returns and exit
                    timelines, making them attractive for conservative
                    investors.
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
                        Fixed Repurchase Price
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Company agrees to repurchase at predetermined price,
                        ensuring known returns.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Interest Component
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Repurchase price includes agreed interest or premium
                        over original price.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 100,000 with 2-year repurchase agreement at 15%
                      premium. Company buys back investment for GHS 115,000
                      after 2 years, providing GHS 15,000 profit (15% total
                      return, 7.5% annualized).
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
                            Guaranteed Exit
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Company legally obligated to repurchase at set date
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Predictable Returns
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Known returns from the beginning of investment
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Collateral Protection
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Assets or securities serve as collateral
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Short to Medium Term
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Typically 6 months to 3 year durations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-trust" />
                    Common Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Working Capital
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Short-term financing for inventory or operations
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Project Finance
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Specific project funding with defined completion
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Bridge Financing
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Temporary funding until longer-term financing secured
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        ESOP Financing
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Employee stock ownership plan funding
                      </p>
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
                        Counterparty Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Company may default on repurchase obligation.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Collateral Depreciation
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Value of collateral may decline below repurchase price.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Liquidity Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Difficulty selling position before repurchase date.
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
                        Low
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Min. Investment:
                      </span>
                      <span className="text-sm font-medium">GHS 25,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Returns:
                      </span>
                      <span className="text-sm font-medium">8-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Term Length:
                      </span>
                      <span className="text-sm font-medium">6-36 months</span>
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
                    Repurchase agreements in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Companies Act, 2019 (Act 992)</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• Contract Act, 1960</li>
                    <li>• Borrowers and Lenders Act, 2020</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/redeemable-equity">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Redeemable Equity
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Equity with exit options
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
                          Fixed income instruments
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

export default RepurchaseAgreements;
