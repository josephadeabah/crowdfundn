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
  Shield,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  Scale,
} from 'lucide-react';

const QuasiEquity = () => {
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
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Scale className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Quasi-Equity
                </h1>
                <p className="text-muted-foreground">
                  Hybrid investment with debt security and equity-like returns
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium Risk
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-500"
              >
                Priority Returns
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Performance Linked
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Creditor Protection
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Is Quasi-Equity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    What Is Quasi-Equity?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Quasi-equity is a hybrid investment instrument that combines
                    features of both debt and equity. It provides the security
                    of debt with the upside potential of equity, making it an
                    attractive option for investors seeking balanced risk-reward
                    profiles.
                  </p>
                  <p className="text-muted-foreground">
                    Unlike traditional equity, quasi-equity doesn't grant voting
                    rights or direct ownership. Instead, it offers returns
                    linked to company performance while maintaining creditor
                    rights in case of liquidation.
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
                        Performance-Linked Returns
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Returns are tied to company performance metrics like
                        revenue, EBITDA, or specific milestones rather than
                        fixed interest rates.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Priority Payments
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Quasi-equity holders receive payments before equity
                        shareholders, providing better cash flow predictability.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Structure
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      You invest GHS 10,000 with returns linked to 5% of annual
                      revenue plus 2x capital return upon exit. If revenue grows
                      from GHS 200,000 to GHS 500,000, your annual returns
                      increase proportionally while maintaining creditor
                      protection.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Your Rights as an Investor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-trust" />
                    Your Rights as an Investor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Creditor Priority
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Higher claim on assets than equity holders in
                            liquidation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Performance Monitoring
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Access to key performance indicators and financial
                            metrics
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Fixed Term & Exit
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Clear maturity date and predefined exit mechanisms
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Covenant Protections
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Financial and operational covenants to protect your
                            investment
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
                        Performance Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Returns depend on company performance; poor performance
                        may result in lower returns.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Subordination Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        While senior to equity, quasi-equity may be subordinate
                        to traditional debt instruments.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Complexity Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Terms can be complex and require careful understanding
                        of performance metrics and triggers.
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
                        No
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Return Type:
                      </span>
                      <span className="text-sm font-medium text-growth">
                        Performance Linked
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Creditor Status:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Senior to Equity
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Term:
                      </span>
                      <span className="text-sm font-medium">3-7 years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ideal For */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ideal For</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Investors seeking balanced risk-reward</li>
                    <li>• Those wanting creditor protection</li>
                    <li>
                      • Investors comfortable with performance-based returns
                    </li>
                    <li>• Portfolio diversification seekers</li>
                    <li>• Medium-term investment horizons</li>
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
                          Full ownership with higher risk
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
                          Debt with conversion option
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
                          Fixed returns, lower risk
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

export default QuasiEquity;
