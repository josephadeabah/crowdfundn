import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, FileText, DollarSign, AlertTriangle, CheckCircle, Info, Shield, Calendar, TrendingUp } from "lucide-react";

const DebtSecurities = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-trust/10 via-background to-growth/5 py-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-trust/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contracts
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-trust/10 text-trust">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Debt Securities</h1>
              <p className="text-muted-foreground">Fixed-income investments with guaranteed returns</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-success/10 text-success">Low-Medium Risk</Badge>
            <Badge variant="secondary" className="bg-trust/10 text-trust">Fixed Interest</Badge>
            <Badge variant="secondary" className="bg-growth/10 text-growth">Principal Protection</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What Are Debt Securities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5 text-trust" />
                  What Are Debt Securities?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Debt securities are fixed-income investments where you lend money to a company or government entity 
                  for a predetermined period at a fixed interest rate. The borrower is legally obligated to pay you 
                  regular interest payments and return your principal amount at maturity.
                </p>
                <p className="text-muted-foreground">
                  In Ghana's investment landscape, debt securities include corporate bonds, government bonds, 
                  commercial papers, and other fixed-income instruments that provide predictable returns with 
                  lower risk compared to equity investments.
                </p>
                <div className="bg-trust/5 border border-trust/20 p-4 rounded-lg">
                  <h5 className="font-medium text-trust mb-2">Key Advantage</h5>
                  <p className="text-sm text-muted-foreground">
                    Debt securities provide capital preservation and predictable income streams, making them 
                    ideal for conservative investors seeking stable returns with lower volatility.
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
                    <h4 className="font-semibold text-foreground">Interest Payments (Coupons)</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive regular interest payments at predetermined rates and intervals, 
                      typically semi-annually or annually.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Principal Repayment</h4>
                    <p className="text-sm text-muted-foreground">
                      Get your initial investment amount back at maturity, 
                      providing full capital recovery if held to term.
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">Example Return Calculation</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Investment:</strong> GHS 10,000 in 3-year corporate bond at 12% annual interest</p>
                    <p><strong>Annual Interest:</strong> GHS 1,200 (12% of GHS 10,000)</p>
                    <p><strong>Total Interest Over 3 Years:</strong> GHS 3,600</p>
                    <p><strong>Principal at Maturity:</strong> GHS 10,000</p>
                    <p><strong>Total Return:</strong> GHS 13,600 (36% total return over 3 years)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types of Debt Securities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-trust" />
                  Types of Debt Securities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">Government Bonds</h5>
                      <p className="text-sm text-muted-foreground">
                        Issued by Bank of Ghana. Lowest risk with moderate returns. 
                        Include Treasury Bills and Government Bonds.
                      </p>
                    </div>
                    
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">Corporate Bonds</h5>
                      <p className="text-sm text-muted-foreground">
                        Issued by companies. Higher returns than government bonds 
                        but with increased credit risk.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">Commercial Papers</h5>
                      <p className="text-sm text-muted-foreground">
                        Short-term unsecured promissory notes, typically 
                        with maturities of less than one year.
                      </p>
                    </div>
                    
                    <div className="border border-border p-4 rounded-lg">
                      <h5 className="font-medium text-foreground mb-2">Municipal Bonds</h5>
                      <p className="text-sm text-muted-foreground">
                        Issued by local government authorities for 
                        infrastructure and development projects.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-trust" />
                  Key Features and Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">Predictable Income</h5>
                        <p className="text-sm text-muted-foreground">
                          Fixed interest payments provide steady, predictable cash flow
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">Capital Preservation</h5>
                        <p className="text-sm text-muted-foreground">
                          Principal amount is guaranteed if held to maturity
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">Priority in Liquidation</h5>
                        <p className="text-sm text-muted-foreground">
                          Bondholders are paid before equity shareholders if company fails
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h5 className="font-medium text-foreground">Tradeable</h5>
                        <p className="text-sm text-muted-foreground">
                          Can be bought and sold on secondary markets before maturity
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Ratings and Risk */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-trust" />
                  Understanding Credit Ratings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Credit ratings assess the creditworthiness of bond issuers and help investors understand the risk level:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-success/5 border border-success/20 p-3 rounded-lg text-center">
                    <h5 className="font-medium text-success">High Grade (AAA-BBB)</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Investment grade bonds with low default risk
                    </p>
                  </div>
                  <div className="bg-warning/5 border border-warning/20 p-3 rounded-lg text-center">
                    <h5 className="font-medium text-warning">Speculative (BB-B)</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher yields but increased credit risk
                    </p>
                  </div>
                  <div className="bg-destructive/5 border border-destructive/20 p-3 rounded-lg text-center">
                    <h5 className="font-medium text-destructive">High Risk (CCC-D)</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                      Junk bonds with significant default risk
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
                    <h5 className="font-medium text-warning mb-2">Credit Risk</h5>
                    <p className="text-sm text-muted-foreground">
                      Risk that the issuer may default on interest payments or principal repayment.
                    </p>
                  </div>
                  
                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">Interest Rate Risk</h5>
                    <p className="text-sm text-muted-foreground">
                      Bond values decline when interest rates rise, affecting market value before maturity.
                    </p>
                  </div>
                  
                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">Inflation Risk</h5>
                    <p className="text-sm text-muted-foreground">
                      Fixed interest payments lose purchasing power if inflation exceeds the interest rate.
                    </p>
                  </div>
                  
                  <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                    <h5 className="font-medium text-warning mb-2">Liquidity Risk</h5>
                    <p className="text-sm text-muted-foreground">
                      Some bonds may be difficult to sell quickly without affecting the price significantly.
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
                    <span className="text-sm text-muted-foreground">Risk Level:</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">Low-Medium</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Min. Investment:</span>
                    <span className="text-sm font-medium">GHS 500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate:</span>
                    <span className="text-sm font-medium">8-18% annually</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Term:</span>
                    <span className="text-sm font-medium">3 months - 20 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Liquidity:</span>
                    <span className="text-sm font-medium text-success">Good</span>
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
                  Debt securities in Ghana are governed by:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Securities Industry Act, 2016</li>
                  <li>• Bank of Ghana Act, 2016</li>
                  <li>• Companies Act, 2019 (Act 992)</li>
                  <li>• Ghana Stock Exchange Rules</li>
                  <li>• SEC Regulations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Market Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm text-foreground">Current Rates</h5>
                    <p className="text-xs text-muted-foreground">Government bonds: 15-25%</p>
                    <p className="text-xs text-muted-foreground">Corporate bonds: 18-30%</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-foreground">Trading</h5>
                    <p className="text-xs text-muted-foreground">Ghana Stock Exchange</p>
                    <p className="text-xs text-muted-foreground">Primary Dealer Network</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Contracts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/convertible-bonds">
                  <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                    <div>
                      <div className="font-medium text-sm">Convertible Bonds</div>
                      <div className="text-xs text-muted-foreground">Bonds with equity option</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/preference-shares">
                  <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                    <div>
                      <div className="font-medium text-sm">Preference Shares</div>
                      <div className="text-xs text-muted-foreground">Fixed dividend equity</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtSecurities;