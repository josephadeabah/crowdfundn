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
  BarChart3,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Calendar,
} from 'lucide-react';

const ConvertibleBonds = () => {
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
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Convertible Bonds
                </h1>
                <p className="text-muted-foreground">
                  Debt securities with equity conversion rights
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Interest + Conversion
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Flexible Returns
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Convertible Bonds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Convertible Bonds?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Convertible bonds are debt securities that can be converted
                    into a predetermined number of equity shares at specific
                    times during the bond's life. They combine features of both
                    debt and equity investments.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's growing capital markets, convertible bonds offer
                    investors the safety of regular interest payments like
                    traditional bonds, with the potential upside of equity
                    participation if the company performs well.
                  </p>
                  <div className="bg-trust/5 border border-trust/20 p-4 rounded-lg">
                    <h5 className="font-medium text-trust mb-2">
                      Best of Both Worlds
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Earn steady interest like a bondholder, but convert to
                      shares if the company's value increases significantly.
                      This provides downside protection with upside potential.
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
                        Interest Payments
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receive regular interest payments (coupon) throughout
                        the bond's term, typically at lower rates than
                        traditional bonds due to conversion option.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Conversion Gains
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        If you convert to shares and the company value
                        increases, you benefit from capital appreciation just
                        like equity shareholders.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Scenario
                    </h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      You invest GHS 5,000 in convertible bonds with 5% annual
                      interest, convertible to 500 shares at GHS 10 per share.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        • If share price stays at GHS 8: Keep bond, earn GHS 250
                        annual interest
                      </li>
                      <li>
                        • If share price rises to GHS 15: Convert to shares
                        worth GHS 7,500 (50% gain)
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Mechanics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-trust" />
                    How Conversion Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Conversion Ratio
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Number of shares you'll receive per bond. Fixed at
                          issuance (e.g., 1 bond = 50 shares).
                        </p>
                      </div>

                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Conversion Price
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          The effective price per share when converting (Bond
                          Value ÷ Conversion Ratio).
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Conversion Period
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Specific timeframes when conversion is allowed, often
                          with windows or continuous periods.
                        </p>
                      </div>

                      <div className="border border-border p-4 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2">
                          Conversion Premium
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Amount above current share price that you pay for
                          conversion rights.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* When to Convert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-trust" />
                    When Should You Convert?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="bg-success/5 border border-success/20 p-4 rounded-lg">
                      <h5 className="font-medium text-success mb-2">
                        Convert When:
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • Share price exceeds conversion price significantly
                        </li>
                        <li>• Company shows strong growth prospects</li>
                        <li>
                          • Near bond maturity with shares trading above
                          conversion price
                        </li>
                        <li>• Company announces dividend increases</li>
                      </ul>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Keep Bond When:
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Share price remains below conversion price</li>
                        <li>• You prefer steady interest income</li>
                        <li>• Market conditions are uncertain</li>
                        <li>
                          • Interest rates are rising (bonds become more
                          attractive)
                        </li>
                      </ul>
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
                        Interest Rate Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Bond value decreases when interest rates rise, affecting
                        both the bond and conversion value.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Conversion Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Share price may never reach conversion price, making the
                        conversion option worthless.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Lower Interest Rates
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Convertible bonds typically offer lower interest rates
                        than regular bonds due to the equity option.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Credit Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Company may default on interest payments or principal
                        repayment if financial condition deteriorates.
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
                      <span className="text-sm font-medium">GHS 2,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Interest Rate:
                      </span>
                      <span className="text-sm font-medium">
                        4-8% typically
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Conversion:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Optional
                      </span>
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
                    Convertible bonds in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Securities Industry Act, 2016</li>
                    <li>• Companies Act, 2019 (Act 992)</li>
                    <li>• SEC Bond Market Guidelines</li>
                    <li>• Trust Deed and Bond Terms</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                          Pure bond alternative
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/investment-contracts/equity-shares">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">Equity Shares</div>
                        <div className="text-xs text-muted-foreground">
                          Direct equity ownership
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

export default ConvertibleBonds;
