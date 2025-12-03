import {
  X,
  Users,
  Clock,
  TrendingUp,
  FileText,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/seperator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Deal } from './dealRoomData';

interface DealDetailModalProps {
  deal: Deal | null;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

export function DealDetailModal({ deal, onClose }: DealDetailModalProps) {
  if (!deal) return null;

  const progressPercent = Math.min(
    (deal.currentRaise / deal.targetRaise) * 100,
    100,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border/50 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                {deal.logo}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {deal.companyName}
                  </h2>
                  <Badge
                    variant={
                      deal.status === 'Funded'
                        ? 'secondary'
                        : deal.status === 'Closing Soon'
                          ? 'destructive'
                          : 'default'
                    }
                  >
                    {deal.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{deal.tagline}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Funding Progress Card */}
              <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Amount Raised
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(deal.currentRaise)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-xl font-semibold text-foreground">
                      {formatCurrency(deal.targetRaise)}
                    </p>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-3 mb-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-medium">
                    {progressPercent.toFixed(0)}% funded
                  </span>
                  <span className="text-muted-foreground">
                    {deal.investors} investors
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-muted/50">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      About {deal.companyName}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {deal.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Investment Highlights
                    </h3>
                    <ul className="space-y-2">
                      {deal.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            {highlight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Metrics */}
                  {deal.metrics && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        Key Metrics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {deal.metrics.mrr && (
                          <div className="bg-muted/30 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-foreground">
                              {formatCurrency(deal.metrics.mrr)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Monthly Revenue
                            </p>
                          </div>
                        )}
                        {deal.metrics.growth && (
                          <div className="bg-muted/30 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-primary">
                              +{deal.metrics.growth}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              YoY Growth
                            </p>
                          </div>
                        )}
                        {deal.metrics.users && (
                          <div className="bg-muted/30 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-foreground">
                              {formatNumber(deal.metrics.users)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Active Users
                            </p>
                          </div>
                        )}
                        {deal.metrics.revenue && (
                          <div className="bg-muted/30 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-foreground">
                              {formatCurrency(deal.metrics.revenue)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Annual Revenue
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-3">
                    {deal.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} Document
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {deal.interested} investors interested
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Showing strong demand
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {deal.meetings} meetings scheduled
                        </p>
                        <p className="text-sm text-muted-foreground">
                          With potential investors
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Deal Terms */}
              <div className="bg-muted/30 rounded-xl p-5 border border-border/30 space-y-4">
                <h3 className="font-semibold text-foreground">Deal Terms</h3>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stage</span>
                    <span className="font-medium text-foreground">
                      {deal.stage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valuation</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(deal.valuation)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Min Investment
                    </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(deal.minInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry</span>
                    <span className="font-medium text-foreground">
                      {deal.industry}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Left</span>
                    <span className="font-medium text-foreground">
                      {deal.daysLeft > 0 ? deal.daysLeft : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Info */}
              <div className="bg-muted/30 rounded-xl p-5 border border-border/30">
                <h3 className="font-semibold text-foreground mb-4">
                  Meet the Founder
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                    {deal.founderImage}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {deal.founderName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {deal.founderTitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <Button
                  className="w-full gradient-emerald text-primary-foreground"
                  size="lg"
                  disabled={deal.status === 'Funded'}
                >
                  {deal.status === 'Funded' ? 'Fully Funded' : 'Invest Now'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Deal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
