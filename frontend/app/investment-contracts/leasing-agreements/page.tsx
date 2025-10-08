// investment-contracts/leasing-agreements
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
  Building,
  Car,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
} from 'lucide-react';

const LeasingAgreements = () => {
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
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Leasing Agreements
                </h1>
                <p className="text-muted-foreground">
                  Asset financing through rental arrangements
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Asset Backed
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Regular Income
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Leasing Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Leasing Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Leasing agreements allow investors to purchase assets and
                    lease them to businesses in exchange for regular rental
                    payments. This includes equipment, vehicles, machinery, and
                    real estate. Investors earn income while businesses access
                    needed assets without large capital outlays.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana, leasing is a growing financing alternative that
                    supports business expansion while providing stable returns
                    to investors.
                  </p>
                </CardContent>
              </Card>

              {/* Types of Leasing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-trust" />
                    Types of Leasing Arrangements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 border rounded-lg p-4 bg-success/5">
                      <div className="flex items-center space-x-2">
                        <Car className="h-5 w-5 text-success" />
                        <h4 className="font-semibold text-foreground">
                          Operating Lease
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Short-term rentals with maintenance included. Asset
                        returned at lease end.
                      </p>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-blue-500/5">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold text-foreground">
                          Finance Lease
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Long-term agreements where lessee effectively owns asset
                        by lease end.
                      </p>
                    </div>
                  </div>
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
                        Monthly Rentals
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Regular lease payments providing stable cash flow.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Asset Appreciation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Potential increase in asset value over time.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 100,000 in construction equipment leased to a
                      contractor for 3 years at GHS 4,000 monthly. Total rental
                      income: GHS 144,000. After maintenance costs, net return
                      of GHS 30,000 (30%) plus residual equipment value.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-trust" />
                    Key Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Collateral Security
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Physical assets serve as collateral for the
                            investment
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Inflation Hedge
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Lease rates can be adjusted for inflation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Tax Benefits
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Depreciation and expense deductions available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Residual Value
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Asset can be sold or re-leased after initial term
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
                        Lessee Default
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Tenant may fail to make lease payments.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Asset Depreciation
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Equipment may lose value faster than anticipated.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Maintenance Costs
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Unexpected repair and maintenance expenses.
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
                      <span className="text-sm font-medium">GHS 50,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Returns:
                      </span>
                      <span className="text-sm font-medium">12-18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lease Term:
                      </span>
                      <span className="text-sm font-medium">2-5 years</span>
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
                    Leasing agreements in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Hire Purchase Act, 1974</li>
                    <li>• Companies Act, 2019</li>
                    <li>• Borrowers and Lenders Act, 2020</li>
                    <li>• Ghana Leasing Act</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/rental-agreements">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Rental Agreements
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Property rentals
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
                          Fixed income alternative
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

export default LeasingAgreements;
