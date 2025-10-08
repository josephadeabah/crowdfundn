// investment-contracts/sustainable-debt
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
  Leaf,
  Users,
  Globe,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
} from 'lucide-react';

const SustainableDebt = () => {
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
                <Leaf className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Sustainable, Social & Green Debt
                </h1>
                <p className="text-muted-foreground">
                  Financing for positive environmental and social impact
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Low-Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Impact Focused
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Market Returns
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Sustainable Debt Instruments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Sustainable Debt Instruments?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Sustainable debt instruments finance projects with specific
                    environmental, social, or governance (ESG) benefits. This
                    includes green bonds for environmental projects, social
                    bonds for community benefits, and sustainability-linked debt
                    with performance targets.
                  </p>
                  <p className="text-muted-foreground">
                    Ghana is emerging as a leader in sustainable finance in
                    Africa, with growing issuance of green bonds and
                    impact-focused debt instruments supporting national
                    development goals.
                  </p>
                </CardContent>
              </Card>

              {/* Types of Sustainable Debt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-trust" />
                    Types of Sustainable Debt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3 border rounded-lg p-4 bg-success/5">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-5 w-5 text-success" />
                        <h4 className="font-semibold text-foreground">
                          Green Bonds
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Finance environmental projects like renewable energy,
                        clean transportation, and climate adaptation.
                      </p>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-blue-500/5">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold text-foreground">
                          Social Bonds
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Fund projects addressing social issues like affordable
                        housing, healthcare, and education access.
                      </p>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-purple-500/5">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold text-foreground">
                          Sustainability Bonds
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Combine environmental and social objectives in
                        comprehensive sustainability frameworks.
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
                        Fixed Income
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Regular interest payments comparable to traditional debt
                        instruments.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Impact Premium
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Some instruments offer premium returns for achieving
                        specific impact targets.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Impact Measurement
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      A green bond funding solar energy projects might track
                      metrics like tons of CO2 emissions reduced, megawatts of
                      clean energy generated, and number of households provided
                      with renewable electricity.
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
                            Dual Returns
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Financial returns plus measurable
                            social/environmental impact
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Transparency
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Regular impact reporting and third-party
                            verification
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Risk Mitigation
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            ESG factors often correlate with better long-term
                            performance
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Market Alignment
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Growing investor demand for sustainable investment
                            options
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
                        Impact Washing
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Projects may not deliver promised environmental or
                        social benefits.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Measurement Complexity
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Impact metrics can be difficult to standardize and
                        verify.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Regulatory Evolution
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Evolving ESG standards and reporting requirements.
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
                      <span className="text-sm font-medium">GHS 5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Interest:
                      </span>
                      <span className="text-sm font-medium">7-12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Term Length:
                      </span>
                      <span className="text-sm font-medium">3-10 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Impact Reporting:
                      </span>
                      <span className="text-sm font-medium text-success">
                        Required
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
                    Sustainable debt in Ghana is governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Ghana Sustainable Banking Principles</li>
                    <li>• SEC Green Bond Guidelines</li>
                    <li>• Companies Act, 2019</li>
                    <li>• International Capital Market Standards</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Contracts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/investment-contracts/impact-linked-investments">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          Impact-linked Investments
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Performance-based impact
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
                          Traditional debt instruments
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

export default SustainableDebt;
