// investment-contracts/impact-linked-investments
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
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Award,
  Users,
} from 'lucide-react';

const ImpactLinkedInvestments = () => {
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
              <div className="p-3 rounded-xl bg-success/10 text-success">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Impact-linked Investment Agreements
                </h1>
                <p className="text-muted-foreground">
                  Financial returns tied to social and environmental impact
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Impact Focused
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
              {/* What Are Impact-linked Investments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Impact-linked Investments?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Impact-linked investments tie financial returns to the
                    achievement of specific, measurable social or environmental
                    outcomes. These innovative instruments reward companies for
                    delivering positive impact while providing investors with
                    both financial returns and measurable social benefits.
                  </p>
                  <p className="text-muted-foreground">
                    Ghana is emerging as a leader in impact investing in Africa,
                    with growing interest in investments that address
                    development challenges while generating competitive returns.
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
                        Base Returns
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Standard financial returns regardless of impact
                        performance.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Impact Premium
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Additional returns for achieving predefined impact
                        targets.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Impact-linked Structure
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Invest GHS 500,000 in a clean water company with 8% base
                      return. If the company provides clean water to 10,000
                      additional people (impact target), returns increase to
                      12%. If they reach 15,000 people, returns increase to 15%.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Common Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-trust" />
                    Common Impact Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 border rounded-lg p-4 bg-success/5">
                      <h4 className="font-semibold text-foreground">
                        Social Impact
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Jobs created for underserved communities</li>
                        <li>• Students educated or trained</li>
                        <li>• Patients provided healthcare access</li>
                        <li>• Affordable housing units built</li>
                      </ul>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-blue-500/5">
                      <h4 className="font-semibold text-foreground">
                        Environmental Impact
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Tons of CO2 emissions reduced</li>
                        <li>• Hectares of forest protected</li>
                        <li>• Liters of water saved or cleaned</li>
                        <li>• Renewable energy capacity added</li>
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
                            Measurable Impact
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Clear, verifiable impact metrics and reporting
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Third-party Verification
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Independent validation of impact achievements
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Alignment of Interests
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Investors and companies both benefit from impact
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Flexible Structures
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Can be applied to debt, equity, or hybrid
                            instruments
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
                        Impact Measurement Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Difficulty accurately measuring and verifying impact
                        outcomes.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Mission Drift
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Companies may prioritize financial over impact goals.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Complexity Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Complex structures require sophisticated monitoring.
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
                      <span className="text-sm font-medium">GHS 100,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Base Returns:
                      </span>
                      <span className="text-sm font-medium">6-10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Impact Premium:
                      </span>
                      <span className="text-sm font-medium">2-8%</span>
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
                    Impact-linked investments in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Ghana Sustainable Banking Principles</li>
                    <li>• Companies Act, 2019</li>
                    <li>• SEC Impact Investment Guidelines</li>
                    <li>• International Impact Standards</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/sustainable-debt">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Sustainable Debt
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ESG-focused financing
                        </div>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/investment-contracts/blended-investments">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Blended Investments
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Mixed capital sources
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

export default ImpactLinkedInvestments;
