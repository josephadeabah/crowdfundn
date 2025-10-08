// investment-contracts/secured-unsecured-debt
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
  Unlock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
} from 'lucide-react';

const SecuredUnsecuredDebt = () => {
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
                <Lock className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Secured & Unsecured Debt
                </h1>
                <p className="text-muted-foreground">
                  Fixed income investments with varying risk levels
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low-Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Fixed Returns
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
              {/* What Are Debt Instruments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Debt Instruments?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Debt instruments represent loans made by investors to
                    companies, with promised repayment of principal plus
                    interest. Secured debt is backed by company assets as
                    collateral, while unsecured debt relies solely on the
                    company's creditworthiness.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's financial markets, debt instruments provide
                    stable income streams and are essential components of
                    diversified investment portfolios.
                  </p>
                </CardContent>
              </Card>

              {/* Types of Debt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-trust" />
                    Types of Debt Instruments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 border rounded-lg p-4 bg-success/5">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-success" />
                        <h4 className="font-semibold text-foreground">
                          Secured Debt
                        </h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Backed by company assets</li>
                        <li>• Lower interest rates</li>
                        <li>• Priority in bankruptcy</li>
                        <li>• Asset collateralization</li>
                      </ul>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-warning/5">
                      <div className="flex items-center space-x-2">
                        <Unlock className="h-5 w-5 text-warning" />
                        <h4 className="font-semibold text-foreground">
                          Unsecured Debt
                        </h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• No specific collateral</li>
                        <li>• Higher interest rates</li>
                        <li>• General creditor status</li>
                        <li>• Based on credit rating</li>
                      </ul>
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
                        Regular Interest
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receive fixed or variable interest payments monthly,
                        quarterly, or annually.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Principal Repayment
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Get your original investment back at maturity or
                        according to repayment schedule.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 10,000 in secured corporate bonds with 12%
                      annual interest for 3 years. You receive GHS 1,200
                      interest each year, totaling GHS 3,600, plus your GHS
                      10,000 principal back at maturity.
                    </p>
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
                        Default Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Company may fail to make interest payments or repay
                        principal.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Interest Rate Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Rising interest rates may make your fixed returns less
                        attractive.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Inflation Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Fixed returns may not keep pace with inflation over
                        time.
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
                        Low-Medium
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
                        Typical Interest:
                      </span>
                      <span className="text-sm font-medium">8-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Term Length:
                      </span>
                      <span className="text-sm font-medium">1-7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Liquidity:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Medium-High
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
                    Debt instruments in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Borrowers and Lenders Act, 2020</li>
                    <li>• Companies Act, 2019</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• Bank of Ghana Regulations</li>
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
                          Tradable debt instruments
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

export default SecuredUnsecuredDebt;
