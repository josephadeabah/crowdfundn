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
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  TrendingDown,
  Calendar,
} from 'lucide-react';

const ProfitSharing = () => {
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
              <DollarSign className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Profit Sharing
              </h1>
              <p className="text-muted-foreground">
                Share in company profits without equity ownership
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-success/10 text-success">
              Medium Risk
            </Badge>
            <Badge variant="secondary" className="bg-trust/10 text-trust">
              Profit Based
            </Badge>
            <Badge variant="secondary" className="bg-growth/10 text-growth">
              Performance Linked
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What Is Profit Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-trust" />
                  What Is Profit Sharing?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Profit sharing agreements allow investors to receive a
                  predetermined percentage of a company's net profits for a
                  specified period. Unlike equity ownership, you don't hold
                  shares or voting rights, but benefit directly from the
                  company's profitability.
                </p>
                <p className="text-muted-foreground">
                  This investment structure is common in Ghana for supporting
                  established businesses with proven profitability, particularly
                  in sectors like agriculture processing, manufacturing, and
                  professional services.
                </p>
                <div className="bg-trust/5 border border-trust/20 p-4 rounded-lg">
                  <h5 className="font-medium text-trust mb-2">
                    Key Difference from Revenue Sharing
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    While revenue sharing is based on gross sales, profit
                    sharing is calculated after deducting all business expenses,
                    taxes, and operational costs. This means higher potential
                    returns but also higher dependency on efficient business
                    management.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How Returns Work */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-growth" />
                  How Returns Are Calculated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">
                      Net Profit Calculation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Profits are calculated as total revenue minus all
                      operating expenses, taxes, interest payments, and
                      depreciation.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">
                      Your Share
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Receive a fixed percentage of net profits, typically
                      ranging from 5-25% depending on investment size and
                      company structure.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">
                    Example Calculation
                  </h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Investment:</strong> GHS 20,000 for 15% profit
                      share
                    </p>
                    <p>
                      <strong>Company Performance:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Annual Revenue: GHS 500,000</li>
                      <li>• Operating Expenses: GHS 350,000</li>
                      <li>• Taxes & Other Costs: GHS 50,000</li>
                      <li>• Net Profit: GHS 100,000</li>
                      <li>
                        • Your Annual Return: GHS 15,000 (15% of GHS 100,000)
                      </li>
                      <li>• Return on Investment: 75%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Distribution Models */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-trust" />
                  Distribution Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Annual Distribution
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Profits calculated and distributed once per year after
                        audited financial statements are completed.
                      </p>
                    </div>

                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Quarterly Distribution
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Based on quarterly financial statements, providing more
                        frequent but potentially less accurate distributions.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Cumulative Model
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Losses in one period can offset profits in subsequent
                        periods before distributions are made.
                      </p>
                    </div>

                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">
                        Non-Cumulative Model
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Each period stands alone - losses don't affect future
                        profit distributions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits and Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-trust" />
                  Your Rights and Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Financial Transparency
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Access to audited financial statements and profit
                          calculations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Performance Alignment
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Your returns align with company profitability and
                          efficiency
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          Audit Rights
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Right to verify profit calculations through
                          independent audits
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">
                          High Return Potential
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Can generate significant returns if business is highly
                          profitable
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Considerations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-trust" />
                  What Affects Your Returns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-muted/20 border border-border p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Operating Efficiency
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Companies with higher operating margins and cost control
                      will generate more profits to share.
                    </p>
                  </div>

                  <div className="bg-muted/20 border border-border p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Accounting Practices
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      How expenses are classified and depreciation is calculated
                      significantly impacts net profit.
                    </p>
                  </div>

                  <div className="bg-muted/20 border border-border p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Tax Structure
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Corporate tax rates and available deductions affect the
                      final profit available for distribution.
                    </p>
                  </div>

                  <div className="bg-muted/20 border border-border p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Reinvestment Policies
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Companies may retain profits for growth, affecting
                      immediate distributions to investors.
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
                      Profit Volatility
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Profits can fluctuate significantly - no profits means no
                      returns, regardless of revenue levels.
                    </p>
                  </div>

                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">
                      Expense Manipulation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Companies might inflate expenses or defer revenue to
                      minimize reported profits.
                    </p>
                  </div>

                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">
                      No Control Over Operations
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      You can't influence business decisions that affect
                      profitability and efficiency.
                    </p>
                  </div>

                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">
                      Accounting Complexity
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Profit calculations can be complex and subject to
                      different accounting interpretations.
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
                      Profit Share:
                    </span>
                    <span className="text-sm font-medium">5-25% typically</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Distribution:
                    </span>
                    <span className="text-sm font-medium">
                      Annual/Quarterly
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Voting Rights:
                    </span>
                    <span className="text-sm font-medium text-destructive">
                      None
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
                  Profit sharing in Ghana is governed by:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Contracts Act, 1960 (Act 25)</li>
                  <li>• Companies Act, 2019 (Act 992)</li>
                  <li>• Income Tax Act, 2015 (Act 896)</li>
                  <li>• Partnership agreements and contracts</li>
                </ul>
              </CardContent>
            </Card>

            {/* Related Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Contracts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/revenue-sharing">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium text-sm">Revenue Sharing</div>
                      <div className="text-xs text-muted-foreground">
                        Share in sales instead
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
                        Full ownership rights
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

export default ProfitSharing;
