// app/account/investor-clubs/components/Investments/InvestmentDetailsModal.tsx
import React from 'react';
import { ClubInvestment } from '../../clubTypes';
import Modal from '@/app/components/modal/Modal';
import {
  Calendar,
  TrendingUp,
  FileText,
  Building,
  Target,
  DollarSign,
  Percent,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface InvestmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: ClubInvestment | null;
  formatCurrency: (
    amount: number | string | null | undefined,
    currency?: string,
    currencySymbol?: string,
  ) => string;
  formatDate: (dateString: string | null | undefined) => string;
  onExecuteInvestment?: (investmentId: string) => void;
  onDownloadCertificate?: (investment: ClubInvestment) => void;
}

export const InvestmentDetailsModal: React.FC<InvestmentDetailsModalProps> = ({
  isOpen,
  onClose,
  investment,
  formatCurrency,
  formatDate,
  onExecuteInvestment,
  onDownloadCertificate,
}) => {
  if (!investment) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
      case 'committed':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'failed':
        return 'text-red-800 bg-red-100 border-red-200';
      case 'pending':
      case 'committed':
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const handleExecuteInvestment = () => {
    if (onExecuteInvestment && investment.status === 'pending') {
      onExecuteInvestment(investment.id);
    }
  };

  const handleDownloadCertificate = () => {
    if (onDownloadCertificate && investment.certificate_url) {
      onDownloadCertificate(investment);
    }
  };

  const DetailItem = ({
    icon: Icon,
    label,
    value,
    valueColor = 'text-gray-900',
    showArrow = false,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value: React.ReactNode;
    valueColor?: string;
    showArrow?: boolean;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <span className="text-gray-600 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${valueColor}`}>{value}</span>
        {showArrow && <ArrowRight className="w-4 h-4 text-gray-400" />}
      </div>
    </div>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100 px-2">{children}</div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="large"
      closeOnBackdropClick={true}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200 px-6 py-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {investment.campaign?.title || 'Investment Details'}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(investment.status)}`}
                >
                  {getStatusIcon(investment.status)}
                  {investment.status.charAt(0).toUpperCase() +
                    investment.status.slice(1)}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Building className="w-4 h-4" />
                  {investment.is_equity_investment
                    ? 'Equity Investment'
                    : 'Other Investment'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-3 pb-6">
          {/* Financial Details */}
          <Section title="Financial Details">
            <DetailItem
              icon={DollarSign}
              label="Investment Amount"
              value={formatCurrency(
                investment.investment_amount,
                investment.currency,
                investment.currency_symbol,
              )}
            />

            {investment.current_value !== undefined &&
              investment.current_value !== null && (
                <DetailItem
                  icon={TrendingUp}
                  label="Current Value"
                  value={formatCurrency(
                    investment.current_value,
                    investment.currency,
                    investment.currency_symbol,
                  )}
                  valueColor={
                    investment.current_value >= investment.investment_amount
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                />
              )}

            {investment.total_returns !== undefined &&
              investment.total_returns !== null && (
                <DetailItem
                  icon={BarChart3}
                  label="Total Returns"
                  value={formatCurrency(
                    investment.total_returns,
                    investment.currency,
                    investment.currency_symbol,
                  )}
                  valueColor={
                    investment.total_returns >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                />
              )}

            {investment.roi !== undefined && investment.roi !== null && (
              <DetailItem
                icon={Percent}
                label="Return on Investment (ROI)"
                value={
                  <span
                    className={
                      investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {investment.roi >= 0 ? '+' : ''}
                    {investment.roi}%
                  </span>
                }
              />
            )}
          </Section>

          {/* Equity Details */}
          {investment.is_equity_investment && (
            <Section title="Equity Details">
              {investment.shares && (
                <DetailItem
                  icon={Target}
                  label="Shares Owned"
                  value={`${investment.shares.toLocaleString()} shares`}
                />
              )}

              {investment.percentage && (
                <DetailItem
                  icon={Percent}
                  label="Ownership Percentage"
                  value={`${investment.percentage}%`}
                />
              )}

              {investment.campaign?.valuation && (
                <DetailItem
                  icon={DollarSign}
                  label="Company Valuation"
                  value={formatCurrency(
                    investment.campaign.valuation,
                    investment.campaign.currency,
                    investment.campaign.currency_symbol,
                  )}
                />
              )}
            </Section>
          )}

          {/* Campaign Information */}
          <Section title="Campaign Information">
            <DetailItem
              icon={Building}
              label="Company"
              value={investment.campaign?.company_name || 'N/A'}
            />

            {investment.campaign?.category && (
              <DetailItem
                icon={BarChart3}
                label="Sector"
                value={investment.campaign.category
                  .replace('-', ' ')
                  .toUpperCase()}
              />
            )}

            {investment.campaign?.goal_amount && (
              <DetailItem
                icon={Target}
                label="Funding Goal"
                value={formatCurrency(
                  investment.campaign.goal_amount,
                  investment.campaign.currency,
                  investment.campaign.currency_symbol,
                )}
              />
            )}

            {investment.campaign?.current_amount && (
              <DetailItem
                icon={TrendingUp}
                label="Amount Raised"
                value={formatCurrency(
                  investment.campaign.current_amount,
                  investment.campaign.currency,
                  investment.campaign.currency_symbol,
                )}
              />
            )}
          </Section>

          {/* Timeline */}
          <Section title="Timeline">
            <DetailItem
              icon={Calendar}
              label="Investment Date"
              value={formatDate(investment.investment_date)}
            />

            <DetailItem
              icon={Clock}
              label="Created Date"
              value={formatDate(investment.created_at)}
            />
          </Section>

          {/* Certificate Information */}
          {investment.is_equity_investment && (
            <Section title="Certificate">
              {investment.certificate_number && (
                <DetailItem
                  icon={FileText}
                  label="Certificate Number"
                  value={
                    <span className="font-mono">
                      {investment.certificate_number}
                    </span>
                  }
                />
              )}

              <DetailItem
                icon={FileText}
                label="Certificate Status"
                value={
                  investment.certificate_url ? (
                    <span className="text-green-600 font-medium">
                      Available
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )
                }
              />
            </Section>
          )}

          {/* Additional Information */}
          <Section title="Additional Information">
            <DetailItem
              icon={BarChart3}
              label="Investment ID"
              value={<span className="font-mono">{investment.id}</span>}
            />

            {investment.club_investment_id && (
              <DetailItem
                icon={BarChart3}
                label="Club Investment ID"
                value={
                  <span className="font-mono">
                    {investment.club_investment_id}
                  </span>
                }
              />
            )}

            {investment.campaign_id && (
              <DetailItem
                icon={BarChart3}
                label="Campaign ID"
                value={
                  <span className="font-mono">{investment.campaign_id}</span>
                }
              />
            )}

            {investment.equity_investment_id && (
              <DetailItem
                icon={BarChart3}
                label="Equity Investment ID"
                value={
                  <span className="font-mono">
                    {investment.equity_investment_id}
                  </span>
                }
              />
            )}
          </Section>

          {/* Action Buttons */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              {/* Execute Investment Button */}
              {investment.status === 'pending' && onExecuteInvestment && (
                <button
                  onClick={handleExecuteInvestment}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <TrendingUp className="w-5 h-5" />
                  Execute Investment
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Download Certificate Button */}
              {investment.status === 'successful' &&
                investment.certificate_url &&
                onDownloadCertificate && (
                  <button
                    onClick={handleDownloadCertificate}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <FileText className="w-5 h-5" />
                    Download Certificate
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

              {/* Generate Certificate Button */}
              {investment.status === 'successful' &&
                !investment.certificate_url &&
                onDownloadCertificate && (
                  <button
                    onClick={handleDownloadCertificate}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    <FileText className="w-5 h-5" />
                    Generate Certificate
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

              {/* View Campaign Button */}
              {investment.campaign_slug && (
                <button
                  onClick={() =>
                    window.open(
                      `/campaign/${investment.campaign_slug}`,
                      '_blank',
                    )
                  }
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  <Building className="w-5 h-5" />
                  View Campaign
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
