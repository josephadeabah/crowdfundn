// investment-contracts/blended-investments
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
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  Target,
} from 'lucide-react';

const BlendedInvestments = () => {
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
                <Layers className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Blended Investment Agreements
                </h1>
                <p className="text-muted-foreground">
                  Combining different capital sources for optimal impact and
                  returns
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Medium Risk
              </Badge>
              <Badge variant="secondary" className="bg-trust/10 text-trust">
                Multi-tiered Capital
              </Badge>
              <Badge variant="secondary" className="bg-growth/10 text-growth">
                Risk Mitigated
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What Are Blended Investments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-trust" />
                    What Are Blended Investment Agreements?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Blended investment agreements combine different types of
                    capital - commercial, philanthropic, and public - to achieve
                    both financial returns and social impact. These structured
                    arrangements use concessional capital to de-risk investments
                    and attract commercial capital to projects that might
                    otherwise be considered too risky.
                  </p>
                  <p className="text-muted-foreground">
                    In Ghana's development landscape, blended finance is
                    increasingly used to address infrastructure gaps, support
                    SMEs, and fund social enterprises while providing attractive
                    risk-adjusted returns to commercial investors.
                  </p>
                </CardContent>
              </Card>

              {/* Capital Stack Structure */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-trust" />
                    Typical Capital Stack Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-success/5">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-xs">
                        1
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          First Loss Capital (Philanthropic/Public)
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Absorbs initial losses, typically from foundations or
                          development agencies. Accepts lower or no returns to
                          catalyze investment.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-blue-500/5">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                        2
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          Mezzanine Capital (Impact Investors)
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Provides middle layer with moderate risk-return
                          profile. Often from impact funds seeking both
                          financial and social returns.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-purple-500/5">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                        3
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground">
                          Senior Commercial Capital (Private Investors)
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Top layer with lowest risk, attracted by first-loss
                          protection. Seeks market-rate returns with reduced
                          risk.
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
                        Risk-Adjusted Returns
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Returns commensurate with your position in the capital
                        stack.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">
                        Impact Premium
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Additional returns for achieving social or environmental
                        targets.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-2">
                      Example Blended Finance Structure
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      GHS 10 million affordable housing project: GHS 2 million
                      first-loss capital from development agency (0-3% returns),
                      GHS 3 million mezzanine from impact fund (6-8% returns),
                      GHS 5 million senior debt from commercial banks (10-12%
                      returns). First-loss capital protects senior investors,
                      enabling project viability.
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
                            Risk Mitigation
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Concessional capital absorbs first losses
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Enhanced Returns
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Commercial capital achieves better risk-return
                            profile
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Scalable Impact
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Leverages commercial capital for development goals
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <h5 className="font-medium text-foreground">
                            Diverse Participation
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            Multiple investor types with different objectives
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Applications in Ghana */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-trust" />
                    Common Applications in Ghana
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Infrastructure
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Renewable energy, water sanitation, transportation
                        projects
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Agriculture
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Smallholder farmer financing, agri-processing facilities
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        SME Development
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Credit guarantees, working capital for growing
                        businesses
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-foreground">
                        Affordable Housing
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Low-income housing development and mortgage financing
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
                        Structural Complexity
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Complex legal and financial structures require
                        expertise.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Coordination Risk
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Multiple stakeholders with different objectives and
                        timelines.
                      </p>
                    </div>

                    <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                      <h5 className="font-medium text-warning mb-2">
                        Impact Measurement
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Difficulty tracking and attributing social outcomes.
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
                      <span className="text-sm font-medium">GHS 250,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Typical Returns:
                      </span>
                      <span className="text-sm font-medium">5-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Investment Term:
                      </span>
                      <span className="text-sm font-medium">5-10 years</span>
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

              {/* Investor Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Typical Investor Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Development Agencies
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-success/10 text-success text-xs"
                      >
                        First-loss
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Impact Funds
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-500 text-xs"
                      >
                        Mezzanine
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Commercial Banks
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/10 text-purple-500 text-xs"
                      >
                        Senior
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Private Investors
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-orange-500/10 text-orange-500 text-xs"
                      >
                        Equity
                      </Badge>
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
                    Blended investments in Ghana are governed by:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Companies Act, 2019</li>
                    <li>• Securities Industry Act, 2016</li>
                    <li>• Development Finance Regulations</li>
                    <li>• International Investment Agreements</li>
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
                          ESG-focused instruments
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

export default BlendedInvestments;
