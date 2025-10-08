// investment-contracts/rental-agreements
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
  Home,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  MapPin,
} from 'lucide-react';

const RentalAgreements = () => {
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
                <Home className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Rental Agreements
                </h1>
                <p className="text-muted-foreground">
                  Property investment through tenant rentals
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Property Backed
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Dual Returns
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Rental Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Rental Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Rental agreements allow investors to participate in real
                    estate ownership and receive income from tenant rentals.
                    This includes residential properties, commercial spaces,
                    retail outlets, and industrial facilities. Investors earn
                    regular rental income while benefiting from property
                    appreciation over time.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's growing real estate market, rental agreements
                    provide stable returns and inflation protection through
                    tangible asset ownership.
                  </p>
                </CardContent>
              </Card>

              {/* Types of Rental Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-trust" />
                    Types of Rental Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 border rounded-lg p-4 bg-success/5">
                      <div className="flex items-center space-x-2">
                        <Home className="h-5 w-5 text-success" />
                        <h4 className="font-semibold text-foreground">
                          Residential
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Apartments, houses, and residential units with stable
                        tenant demand.
                      </p>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-blue-500/5">
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold text-foreground">
                          Commercial
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Office spaces, retail shops, and commercial properties
                        with longer leases.
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
                        Monthly Rent
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Regular rental payments from tenants providing stable
                        cash flow.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Property Appreciation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Increase in property value over time through market
                        growth and improvements.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 200,000 in a residential apartment generating
                      GHS 2,000 monthly rent. Annual rental income: GHS 24,000
                      (12% yield). After expenses, net return of GHS 18,000 (9%)
                      plus potential property appreciation of 5-10% annually.
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
                            Tangible Asset
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Investment backed by physical real estate
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Inflation Protection
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Rents and property values typically rise with
                            inflation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Tax Advantages
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Deductions for expenses, depreciation, and interest
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Leverage Potential
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Ability to use mortgage financing to enhance returns
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
                        Vacancy Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Properties may experience periods without tenants.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Tenant Default
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Tenants may fail to pay rent or damage property.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Market Fluctuations
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Property values and rental rates can decline.
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
                        Typical Yield:
                      </span>
                      <span className="text-sm font-medium">8-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lease Term:
                      </span>
                      <span className="text-sm font-medium">1-3 years</span>
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
                    Rental agreements in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Rent Act, 1963</li>
                    <li>• Land Act, 2020</li>
                    <li>• Companies Act, 2019</li>
                    <li>• Local Government Regulations</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/leasing-agreements">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Leasing Agreements
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Equipment leasing
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

export default RentalAgreements;
