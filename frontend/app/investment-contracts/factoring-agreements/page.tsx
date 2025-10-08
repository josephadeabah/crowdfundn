// investment-contracts/factoring-agreements
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
  FileText,
  Receipt,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
} from 'lucide-react';

const FactoringAgreements = () => {
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
                <Receipt className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Factoring Agreements
                </h1>
                <p className="text-muted-foreground">
                  Accounts receivable financing for businesses
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Invoice Backed
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Short Term
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Factoring Agreements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Factoring Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Factoring agreements involve purchasing a company's accounts
                    receivable (invoices) at a discount, providing immediate
                    cash flow to the business. Investors advance funds against
                    verified invoices and collect payment directly from the
                    company's customers.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's business environment, factoring helps SMEs manage
                    cash flow gaps while offering investors short-term, secured
                    returns.
                  </p>
                </CardContent>
              </Card>

              {/* How Factoring Works */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-trust" />
                    How Factoring Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-trust text-white flex items-center justify-center text-xs">
                        1
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          Invoice Verification
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Company submits invoices from creditworthy customers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-trust text-white flex items-center justify-center text-xs">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          Funding Advance
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Investor advances 70-90% of invoice value immediately
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-trust text-white flex items-center justify-center text-xs">
                        3
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          Collection
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Customer pays investor directly upon invoice due date
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-trust text-white flex items-center justify-center text-xs">
                        4
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          Final Settlement
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Investor pays remaining balance minus factoring fee
                        </p>
                      </div>
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
                        Factoring Fees
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Discount on invoice value representing your return.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Volume Based
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Returns scale with the volume of invoices processed.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Return Calculation
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      You purchase a GHS 100,000 invoice at 85% advance rate
                      (GHS 85,000 to business). When customer pays the full GHS
                      100,000, you keep GHS 95,000 (5% factoring fee) and return
                      GHS 5,000 to the business. Your return: GHS 10,000 on GHS
                      85,000 advance in 60 days.
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
                            Short Duration
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Typically 30-90 day investment periods
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Customer Credit Risk
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Relies on creditworthiness of invoice payers
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            No Business Risk
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Returns not dependent on business performance
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Diversification
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Can fund multiple businesses and customers
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
                        Customer Default
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Invoice payer may fail to pay on time or at all.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Fraud Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Invoices may be fraudulent or disputed.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Concentration Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Overexposure to single customer or industry.
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
                      <span className="text-sm font-medium">GHS 10,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Returns:
                      </span>
                      <span className="text-sm font-medium">
                        15-25% annualized
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Term Length:
                      </span>
                      <span className="text-sm font-medium">30-90 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Liquidity:
                      </span>
                      <span className="text-sm font-medium text-success">
                        High
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
                    Factoring in Ghana is governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Borrowers and Lenders Act, 2020</li>
                    <li>• Companies Act, 2019</li>
                    <li>• Contract Act, 1960</li>
                    <li>• Secured Transactions Act</li>
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
                          Short-term debt
                        </div>
                      </div>
                    </Button>
                  </Link>
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
                          Revenue-based returns
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

export default FactoringAgreements;
