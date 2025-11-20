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
  AlertCircle
} from 'lucide-react';

interface InvestmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: ClubInvestment | null;
  formatCurrency: (amount: number | string | null | undefined, currency?: string, currencySymbol?: string) => string;
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="large"
      closeOnBackdropClick={true}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {investment.campaign?.title || 'Investment Details'}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(investment.status)}`}>
                  {getStatusIcon(investment.status)}
                  {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <Building className="w-4 h-4" />
                  {investment.is_equity_investment ? 'Equity Investment' : 'Other Investment'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Investment Details */}
          <div className="space-y-6">
            {/* Investment Amount & Value */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      investment.investment_amount,
                      investment.currency,
                      investment.currency_symbol
                    )}
                  </span>
                </div>
                
                {investment.current_value !== undefined && investment.current_value !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Value:</span>
                    <span className={`font-semibold ${
                      investment.current_value >= investment.investment_amount 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        investment.current_value,
                        investment.currency,
                        investment.currency_symbol
                      )}
                    </span>
                  </div>
                )}

                {investment.total_returns !== undefined && investment.total_returns !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Returns:</span>
                    <span className={`font-semibold ${
                      investment.total_returns >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        investment.total_returns,
                        investment.currency,
                        investment.currency_symbol
                      )}
                    </span>
                  </div>
                )}

                {investment.roi !== undefined && investment.roi !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ROI:</span>
                    <span className={`font-semibold ${
                      investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.roi >= 0 ? '+' : ''}{investment.roi}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Equity Details */}
            {investment.is_equity_investment && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Equity Details</h3>
                <div className="space-y-3">
                  {investment.shares && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Shares Owned:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {investment.shares.toLocaleString()} shares
                      </span>
                    </div>
                  )}
                  
                  {investment.percentage && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        Ownership Percentage:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {investment.percentage}%
                      </span>
                    </div>
                  )}
                  
                  {investment.campaign?.valuation && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Company Valuation:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(
                          investment.campaign.valuation,
                          investment.campaign.currency,
                          investment.campaign.currency_symbol
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Investment Date:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(investment.investment_date)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Created:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(investment.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Campaign & Actions */}
          <div className="space-y-6">
            {/* Campaign Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 block text-sm mb-1">Company:</span>
                  <span className="font-semibold text-gray-900">
                    {investment.campaign?.company_name || 'N/A'}
                  </span>
                </div>
                
                {investment.campaign?.category && (
                  <div>
                    <span className="text-gray-600 block text-sm mb-1">Sector:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {investment.campaign.category.replace('-', ' ')}
                    </span>
                  </div>
                )}
                
                {investment.campaign?.goal_amount && (
                  <div>
                    <span className="text-gray-600 block text-sm mb-1">Funding Goal:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        investment.campaign.goal_amount,
                        investment.campaign.currency,
                        investment.campaign.currency_symbol
                      )}
                    </span>
                  </div>
                )}
                
                {investment.campaign?.current_amount && (
                  <div>
                    <span className="text-gray-600 block text-sm mb-1">Raised:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        investment.campaign.current_amount,
                        investment.campaign.currency,
                        investment.campaign.currency_symbol
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Information */}
            {investment.is_equity_investment && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate</h3>
                <div className="space-y-3">
                  {investment.certificate_number && (
                    <div>
                      <span className="text-gray-600 block text-sm mb-1">Certificate Number:</span>
                      <span className="font-mono font-semibold text-gray-900">
                        {investment.certificate_number}
                      </span>
                    </div>
                  )}
                  
                  {investment.certificate_url ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">Certificate available</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">Certificate pending</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {/* Execute Investment Button */}
                {investment.status === 'pending' && onExecuteInvestment && (
                  <button
                    onClick={handleExecuteInvestment}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Execute Investment
                  </button>
                )}

                {/* Download Certificate Button */}
                {investment.status === 'successful' && investment.certificate_url && onDownloadCertificate && (
                  <button
                    onClick={handleDownloadCertificate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Download Certificate
                  </button>
                )}

                {/* Generate Certificate Button */}
                {investment.status === 'successful' && !investment.certificate_url && onDownloadCertificate && (
                  <button
                    onClick={handleDownloadCertificate}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Certificate
                  </button>
                )}

                {/* View Campaign Button */}
                {investment.campaign_slug && (
                  <button
                    onClick={() => window.open(`/campaigns/${investment.campaign_slug}`, '_blank')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <Building className="w-4 h-4" />
                    View Campaign
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block mb-1">Investment ID:</span>
              <span className="font-mono text-gray-900">{investment.id}</span>
            </div>
            
            {investment.club_investment_id && (
              <div>
                <span className="text-gray-600 block mb-1">Club Investment ID:</span>
                <span className="font-mono text-gray-900">{investment.club_investment_id}</span>
              </div>
            )}
            
            {investment.campaign_id && (
              <div>
                <span className="text-gray-600 block mb-1">Campaign ID:</span>
                <span className="font-mono text-gray-900">{investment.campaign_id}</span>
              </div>
            )}
            
            {investment.equity_investment_id && (
              <div>
                <span className="text-gray-600 block mb-1">Equity Investment ID:</span>
                <span className="font-mono text-gray-900">{investment.equity_investment_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};