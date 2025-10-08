// investment-contracts/offtake-agreements
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
  ShoppingCart,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
} from 'lucide-react';

const OfftakeAgreements = () => {
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
                <ShoppingCart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Offtake Agreements
                </h1>
                <p className="text-muted-foreground">
                  Pre-arranged purchase contracts for future production
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Revenue Certainty
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Stable Returns
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Offtake Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Offtake Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Offtake agreements are long-term contracts where a buyer
                    agrees to purchase a company's future production or output
                    at predetermined prices and quantities. These contracts
                    provide revenue certainty and are commonly used in
                    agriculture, mining, manufacturing, and energy sectors.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana, offtake agreements help businesses secure
                    financing by demonstrating guaranteed future revenue streams
                    to investors.
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
                        Revenue Sharing
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receive percentage of revenue from offtake contract
                        sales.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Fixed Returns
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Pre-agreed returns based on contract value and duration.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Investment Structure
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 100,000 to help a cocoa processor secure a
                      5-year offtake agreement with a European chocolate
                      manufacturer. You receive 15% of the contract revenue
                      until you've earned GHS 150,000 (50% return).
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
                            Revenue Certainty
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Guaranteed buyer for company's production
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Price Stability
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Fixed or formula-based pricing reduces market
                            volatility
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Credit Enhancement
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Strong offtaker credit improves investment security
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Production Focus
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Company can focus on production rather than
                            marketing
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
                    <FileText className="mr-2 h-5 w-5 text-trust" />
                    Common Applications in Ghana
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Agriculture
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Cocoa, cashew, shea butter, and horticulture exports
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">Mining</h5>
                      <p className="text-sm text-muted-foreground">
                        Gold, bauxite, manganese, and lithium production
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">Energy</h5>
                      <p className="text-sm text-muted-foreground">
                        Solar and renewable energy power purchase agreements
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Manufacturing
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Industrial products and processed goods for export
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
                        Production Failure
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Company may fail to produce the contracted quantities.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Offtaker Default
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Buyer may fail to honor purchase obligations.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Price Disadvantage
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Fixed prices may become unfavorable if market prices
                        rise.
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
                      <span className="text-sm font-medium">10-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Contract Term:
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
                    Offtake agreements in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Contract Act, 1960 (Act 25)</li>
                    <li>• Sale of Goods Act, 1962</li>
                    <li>• Companies Act, 2019</li>
                    <li>• International Commercial Law</li>
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
                          Percentage-based returns
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

export default OfftakeAgreements;
