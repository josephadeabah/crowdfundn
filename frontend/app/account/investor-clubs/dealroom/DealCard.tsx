import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  ThumbsUp,
  Users,
} from 'lucide-react';

interface DealCardProps {
  deal: {
    id: string;
    founderName: string;
    founderTitle: string;
    companyName: string;
    sector: string;
    stage: string;
    seeking: string;
    valuation: string;
    traction: string;
    status: 'active' | 'pending' | 'reviewing' | 'closed';
    lastUpdate: string;
    matchScore: number;
    keyMetrics: Array<{
      label: string;
      value: string;
      trend: 'up' | 'down' | 'neutral';
    }>;
    investorInterest: number;
    nextMilestone: string;
  };
}

const statusConfig = {
  active: {
    bg: 'bg-status-active/10',
    text: 'text-status-active',
    label: 'Active',
  },
  pending: {
    bg: 'bg-status-pending/10',
    text: 'text-status-pending',
    label: 'Under Review',
  },
  reviewing: {
    bg: 'bg-status-reviewing/10',
    text: 'text-status-reviewing',
    label: 'In Discussion',
  },
  closed: {
    bg: 'bg-status-closed/10',
    text: 'text-status-closed',
    label: 'Closed',
  },
};

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-primary" />;
    case 'down':
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

export const DealCard = ({ deal }: DealCardProps) => {
  const statusStyle = statusConfig[deal.status];

  return (
    <div className="deal-card group">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {deal.founderName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h3 className="font-bold text-lg">{deal.founderName}</h3>
              <p className="text-sm text-muted-foreground">
                {deal.founderTitle}
              </p>
            </div>
          </div>

          <div className="ml-15">
            <h4 className="text-xl font-bold text-primary">
              {deal.companyName}
            </h4>
            <p className="text-sm text-muted-foreground">{deal.sector}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`status-badge ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Match Score</p>
              <p className="text-lg font-bold text-primary">
                {deal.matchScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Stage</p>
          <p className="font-semibold">{deal.stage}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Seeking</p>
          <p className="font-semibold text-primary">{deal.seeking}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Valuation</p>
          <p className="font-semibold">{deal.valuation}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Traction</p>
          <p className="font-semibold text-sm">{deal.traction}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Key Metrics
        </p>
        <div className="flex flex-wrap gap-2">
          {deal.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="metric-badge bg-card border border-border"
            >
              {getTrendIcon(metric.trend)}
              <span className="text-xs">
                <span className="text-muted-foreground">{metric.label}:</span>{' '}
                <span className="font-semibold">{metric.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              <span className="font-semibold text-accent">
                {deal.investorInterest}
              </span>{' '}
              investors interested
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Next: {deal.nextMilestone}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated {deal.lastUpdate}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View Details</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Express Interest</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-gradient-accent hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Start Discussion</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
