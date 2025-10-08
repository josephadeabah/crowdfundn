// investment-contracts/royalty-agreements
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
  Crown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
} from 'lucide-react';

const RoyaltyAgreements = () => {
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
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Royalty Agreements
                </h1>
                <p className="text-muted-foreground">
                  Revenue-based returns from intellectual property or products
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Revenue Linked
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Unlimited Upside
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Royalty Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Royalty Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Royalty agreements provide investors with a percentage of
                    revenue generated from specific products, services, or
                    intellectual property. Unlike equity investments, royalties
                    don't involve ownership but rather a right to receive
                    payments based on commercial success.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's creative and innovation economy, royalty
                    agreements are increasingly used to finance music, films,
                    software, and product development while aligning investor
                    returns with commercial performance.
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
                        Revenue Percentage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receive fixed percentage of gross or net revenue from
                        specified products.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Unlimited Upside
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        No cap on returns if product becomes highly successful.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Scenario
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 50,000 for 5% royalty on a music album. If the
                      album generates GHS 2,000,000 in revenue over 5 years, you
                      receive GHS 100,000 in royalty payments (200% return). If
                      it generates GHS 5,000,000, you receive GHS 250,000 (500%
                      return).
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Types of Royalties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-trust" />
                    Types of Royalty Agreements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 border rounded-lg p-4 bg-success/5">
                      <h4 className="font-semibold text-foreground">
                        Intellectual Property
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Music and entertainment royalties</li>
                        <li>• Patent and technology licensing</li>
                        <li>• Book and publishing rights</li>
                        <li>• Software and app revenue sharing</li>
                      </ul>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-blue-500/5">
                      <h4 className="font-semibold text-foreground">
                        Product Royalties
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Consumer product sales</li>
                        <li>• Mineral and resource extraction</li>
                        <li>• Franchise and brand licensing</li>
                        <li>• Manufacturing and distribution</li>
                      </ul>
                    </div>
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
                            Performance Linked
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Returns directly tied to commercial success
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            No Ownership Dilution
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Founders maintain full ownership and control
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Flexible Terms
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Can include caps, floors, and time limits
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Tax Efficiency
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Often treated as business expenses for companies
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
                        Commercial Failure
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Product or IP may not generate expected revenue.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Revenue Reporting
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Difficulty verifying accurate revenue calculations.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        IP Protection
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Intellectual property rights may be challenged.
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
                      <span className="text-sm font-medium">GHS 20,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Royalty Rate:
                      </span>
                      <span className="text-sm font-medium">2-10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Term Length:
                      </span>
                      <span className="text-sm font-medium">3-10 years</span>
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
                    Royalty agreements in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Copyright Act, 2005</li>
                    <li>• Patents Act, 2003</li>
                    <li>• Contract Act, 1960</li>
                    <li>• Companies Act, 2019</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/revenue-sharing">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Revenue Sharing
                        </div>
                        <div className="text-xs text-muted-foreground">
                          General revenue participation
                        </div>
                      </div>
                    </Button>
                  </Link>
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
                          Profit-based returns
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

export default RoyaltyAgreements;
