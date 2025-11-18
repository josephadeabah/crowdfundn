// app/account/investor-clubs/components/Investments/RecentInvestmentsSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ClubInvestment } from '../../clubTypes';
import { FileText, TrendingUp, Play } from 'lucide-react';

interface RecentInvestmentsSectionProps {
  investments: ClubInvestment[];
  formatCurrency: (amount: number, currency?: string) => string;
  onViewInvestment?: (investment: ClubInvestment) => void;
  onExecuteInvestment?: (investmentId: string) => void;
  onDownloadCertificate?: (investment: ClubInvestment) => void;
}

export const RecentInvestmentsSection: React.FC<
  RecentInvestmentsSectionProps
> = ({
  investments,
  formatCurrency,
  onViewInvestment,
  onExecuteInvestment,
  onDownloadCertificate,
}) => {
  const getStatusBadge = (investment: ClubInvestment) => {
    switch (investment.status) {
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'committed':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
            Committed
          </span>
        );
      case 'successful':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
            Successful
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            Failed
          </span>
        );
      case 'canceled':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Canceled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            {investment.status}
          </span>
        );
    }
  };

  const handleInvestmentAction = (investment: ClubInvestment) => {
    if (onViewInvestment) {
      onViewInvestment(investment);
    }
  };

  const handleExecute = (e: React.MouseEvent, investmentId: string) => {
    e.stopPropagation();
    if (onExecuteInvestment) {
      onExecuteInvestment(investmentId);
    }
  };

  const handleDownloadCertificate = (
    e: React.MouseEvent,
    investment: ClubInvestment,
  ) => {
    e.stopPropagation();
    if (onDownloadCertificate) {
      onDownloadCertificate(investment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">Recent Investments</h3>
        <span className="text-xs lg:text-sm text-gray-500">
          {investments?.length || 0} total
        </span>
      </div>

      <div className="bg-white rounded-sm divide-y">
        {investments?.slice(0, 5)?.map((investment) => (
          <div
            key={investment?.id}
            className="p-3 lg:p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleInvestmentAction(investment)}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="font-semibold text-sm lg:text-base line-clamp-2 flex-1">
                    {investment?.campaign?.title}
                  </h4>
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Equity
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs lg:text-sm text-gray-600 font-medium">
                    {formatCurrency(
                      investment?.investment_amount,
                      investment?.currency_symbol,
                    )}
                  </p>
                  {getStatusBadge(investment)}
                </div>

                {/* Investment Details */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {investment?.shares && (
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      <span>
                        {investment?.shares.toLocaleString()} shares (
                        {investment?.percentage}%)
                      </span>
                    </div>
                  )}

                  {investment?.current_value && (
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-medium ${
                          investment?.total_returns &&
                          investment?.total_returns >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        Current:{' '}
                        {formatCurrency(
                          investment?.current_value,
                          investment?.currency_symbol,
                        )}
                      </span>
                    </div>
                  )}

                  {investment?.roi && (
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-medium ${
                          investment?.roi >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        ROI: {investment?.roi >= 0 ? '+' : ''}
                        {investment?.roi}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                <div className="text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                  {new Date(investment.created_at).toLocaleDateString()}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  {/* Equity Investment Actions */}
                  {investment.status === 'pending' && (
                    <button
                      onClick={(e) => handleExecute(e, investment.id)}
                      className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-1"
                    >
                      <Play size={12} />
                      Invest
                    </button>
                  )}

                  {investment.status === 'successful' &&
                    investment?.certificate_url && (
                      <button
                        onClick={(e) =>
                          handleDownloadCertificate(e, investment)
                        }
                        className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        title="Download Certificate"
                      >
                        <FileText size={12} />
                        Certificate
                      </button>
                    )}

                  {investment.status === 'successful' &&
                    !investment.certificate_url && (
                      <button
                        onClick={(e) =>
                          handleDownloadCertificate(e, investment)
                        }
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
                        title="Generate Certificate"
                      >
                        <FileText size={12} />
                        Generate Cert
                      </button>
                    )}
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {investment.campaign.company_name}
              </p>
            </div>
          </div>
        ))}

        {(!investments || investments.length === 0) && (
          <div className="p-6 text-center text-gray-500">
            <TrendingUp size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No investments yet</p>
            <p className="text-xs mt-1">
              Start by creating your first investment
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
