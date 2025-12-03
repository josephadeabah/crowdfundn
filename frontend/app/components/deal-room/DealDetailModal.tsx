import {
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
import Modal from '@/app/components/modal/Modal';
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
    <Modal
      isOpen={!!deal}
      onClose={onClose}
      size="xxxlarge" // Using xxxlarge for max-w-4xl equivalent
      closeOnBackdropClick={true}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-6 py-4 -mx-6 -mt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center text-3xl">
              {deal.logo}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
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
              <p className="text-gray-600">{deal.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Funding Progress Card */}
            <div className="bg-gray-50 p-5">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-600">Amount Raised</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(deal.currentRaise)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatCurrency(deal.targetRaise)}
                  </p>
                </div>
              </div>
              <Progress
                value={progressPercent}
                className="h-3 mb-3 bg-gray-200"
              >
                <div
                  className="h-full bg-emerald-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </Progress>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 font-medium">
                  {progressPercent.toFixed(0)}% funded
                </span>
                <span className="text-gray-600">
                  {deal.investors} investors
                </span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-gray-100">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    About {deal.companyName}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Investment Highlights
                  </h3>
                  <ul className="space-y-2">
                    {deal.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Metrics */}
                {deal.metrics && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {deal.metrics.mrr && (
                        <div className="bg-gray-50 p-3 text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(deal.metrics.mrr)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Monthly Revenue
                          </p>
                        </div>
                      )}
                      {deal.metrics.growth && (
                        <div className="bg-gray-50 p-3 text-center">
                          <p className="text-lg font-bold text-emerald-600">
                            +{deal.metrics.growth}%
                          </p>
                          <p className="text-xs text-gray-600">YoY Growth</p>
                        </div>
                      )}
                      {deal.metrics.users && (
                        <div className="bg-gray-50 p-3 text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {formatNumber(deal.metrics.users)}
                          </p>
                          <p className="text-xs text-gray-600">Active Users</p>
                        </div>
                      )}
                      {deal.metrics.revenue && (
                        <div className="bg-gray-50 p-3 text-center">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(deal.metrics.revenue)}
                          </p>
                          <p className="text-xs text-gray-600">
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
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {doc.type} Document
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <div className="flex items-center gap-3 p-4 bg-gray-50">
                    <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {deal.interested} investors interested
                      </p>
                      <p className="text-sm text-gray-600">
                        Showing strong demand
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50">
                    <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {deal.meetings} meetings scheduled
                      </p>
                      <p className="text-sm text-gray-600">
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
            <div className="bg-gray-50 p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">Deal Terms</h3>
              <Separator className="bg-gray-300" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage</span>
                  <span className="font-medium text-gray-900">
                    {deal.stage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valuation</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(deal.valuation)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Investment</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(deal.minInvestment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium text-gray-900">
                    {deal.industry}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Left</span>
                  <span className="font-medium text-gray-900">
                    {deal.daysLeft > 0 ? deal.daysLeft : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Info */}
            <div className="bg-gray-50 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Meet the Founder
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-600">
                  {deal.founderImage}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {deal.founderName}
                  </p>
                  <p className="text-sm text-gray-600">{deal.founderTitle}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                size="lg"
                disabled={deal.status === 'Funded'}
              >
                {deal.status === 'Funded' ? 'Fully Funded' : 'Invest Now'}
              </Button>
              <Button className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300">
                <Share2 className="w-4 h-4 mr-2" />
                Share Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
