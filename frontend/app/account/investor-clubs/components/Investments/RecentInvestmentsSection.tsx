// app/account/investor-clubs/components/Investments/RecentInvestmentsSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClubInvestment } from '../../clubTypes';
import { FileText, TrendingUp, Clock, X, AlertTriangle } from 'lucide-react';
import Pagination from '@/app/components/pagination/Pagination';
import Modal from '@/app/components/modal/Modal';
import { CountdownTimer } from '@/app/components/countdowntimer/CountdonwTimer';
import { FaInfoCircle } from 'react-icons/fa';

interface RecentInvestmentsSectionProps {
  investments: ClubInvestment[];
  formatCurrency: (
    amount: number | string | null | undefined,
    currency?: string,
    currencySymbol?: string,
  ) => string;
  onViewInvestment?: (investment: ClubInvestment) => void;
  onDownloadCertificate?: (investment: ClubInvestment) => void;
  onCancelInvestment?: (investmentId: string, reason?: string) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  showPagination?: boolean;
}

// Cancellation Confirmation Modal Component (Updated to use custom Modal)
const CancellationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  investment: ClubInvestment | null;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, investment, isLoading = false }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }
    onConfirm(reason);
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="medium"
      closeOnBackdropClick={true}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cancel Investment
          </h3>
          <p className="text-sm text-gray-600">
            {investment?.campaign?.title || 'Unknown Investment'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="cancellation-reason"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Reason for cancellation *
        </label>
        <textarea
          id="cancellation-reason"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          placeholder="Please provide a reason for cancelling this investment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          rows={4}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      {investment && investment.time_remaining_for_cancellation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium mr-2">Time remaining:</span>
            <CountdownTimer
              timeString={investment.time_remaining_for_cancellation}
              className="text-sm"
              onComplete={() => {
                // Close modal when time runs out
                onClose();
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Keep Investment
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading || !reason.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Cancelling...' : 'Cancel Investment'}
        </button>
      </div>
    </Modal>
  );
};

export const RecentInvestmentsSection: React.FC<
  RecentInvestmentsSectionProps
> = ({
  investments,
  formatCurrency,
  onViewInvestment,
  onDownloadCertificate,
  onCancelInvestment,
  // Pagination props
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  perPage = 5,
  onPageChange,
  onPerPageChange,
  showPagination = true,
}) => {
  const [cancellingInvestment, setCancellingInvestment] = useState<
    string | null
  >(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<ClubInvestment | null>(null);

  // Debug: Log all investments to see what data we have
  React.useEffect(() => {
    console.log('🔍 ALL INVESTMENTS DATA:', investments);
    investments?.forEach((inv) => {
      if (inv.can_be_cancelled) {
        console.log('✅ FOUND CANCELLABLE INVESTMENT:', {
          id: inv.id,
          status: inv.status,
          can_be_cancelled: inv.can_be_cancelled,
          time_remaining: inv.time_remaining_for_cancellation,
        });
      }
    });
  }, [investments]);

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
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
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

  // Enhanced cancellation check - use the API-provided flag
  const canBeCancelled = (investment: ClubInvestment): boolean => {
    const isCancellable = investment.can_be_cancelled === true;

    return isCancellable;
  };

  const handleInvestmentClick = (investment: ClubInvestment) => {
    if (onViewInvestment) {
      onViewInvestment(investment);
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

  // Enhanced cancellation handler
  const handleCancelClick = (
    e: React.MouseEvent,
    investment: ClubInvestment,
  ) => {
    e.stopPropagation();
    setSelectedInvestment(investment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedInvestment || !onCancelInvestment) return;

    setCancellingInvestment(selectedInvestment.id);

    try {
      await onCancelInvestment(selectedInvestment.id, reason);
      setShowCancelModal(false);
      setSelectedInvestment(null);
    } catch (error) {
      console.error('Failed to cancel investment:', error);
    } finally {
      setCancellingInvestment(null);
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedInvestment(null);
  };

  // Safe date formatting
  const formatInvestmentDate = (investment: ClubInvestment) => {
    if (investment.investment_date) {
      try {
        return new Date(investment.investment_date).toLocaleDateString();
      } catch (error) {
        return 'N/A';
      }
    }
    return investment.created_at
      ? new Date(investment.created_at).toLocaleDateString()
      : 'N/A';
  };

  // Check if there are any cancellable investments
  const hasCancellableInvestments = investments?.some((investment) =>
    canBeCancelled(investment),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        investment={selectedInvestment}
        isLoading={cancellingInvestment !== null}
      />

      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h3 className="text-lg lg:text-xl font-semibold">
          Recent Investment Events
        </h3>
        <span className="text-xs lg:text-sm text-gray-500">
          {totalCount || investments?.length || 0} total
        </span>
      </div>
      {/* Professional Disclaimer Banner */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              Important Notice
            </p>
            <p className="text-xs text-blue-500">
              These data assume the company's current valuation accurately
              reflects what investors would pay today. In reality, this is an
              estimate until there's either an actual exit event (acquisition,
              IPO, or secondary sale) or the specific terms of the investment
              instrument are realized (such as profit-sharing distributions).
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Notice Banner */}
      {hasCancellableInvestments && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                48-Hour Cancellation Window Active
              </p>
              <p className="text-xs text-orange-700">
                You can cancel committed investments within 48 hours of
                commitment. Look for the red "Cancel" button below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm divide-y">
        {investments?.map((investment) => {
          const isCancellable = canBeCancelled(investment);
          const isCancelling = cancellingInvestment === investment.id;

          return (
            <div
              key={investment?.id}
              className="p-3 lg:p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleInvestmentClick(investment)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h4 className="font-semibold text-sm lg:text-base line-clamp-2 flex-1">
                      {investment?.campaign?.company_name ||
                        investment?.company ||
                        'Unknown Investment'}
                    </h4>
                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {investment?.is_equity_investment ? 'Equity' : 'Other'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs lg:text-sm text-gray-600 font-medium">
                      {formatCurrency(
                        investment?.investment_amount ||
                          investment?.proposed_amount,
                        investment?.currency,
                        investment?.currency_symbol || '$',
                      )}
                    </p>
                    {getStatusBadge(investment)}
                  </div>

                  {/* Updated Cancellation Info with CountdownTimer */}
                  {isCancellable &&
                    investment.time_remaining_for_cancellation && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded border border-orange-200">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium whitespace-nowrap">
                          Cancel within:
                        </span>
                        <CountdownTimer
                          timeString={
                            investment.time_remaining_for_cancellation
                          }
                          className="text-xs font-mono"
                          onComplete={() => {
                            // Handle countdown completion
                            console.log(
                              `Countdown completed for investment ${investment.id}`,
                            );
                            // You could add logic to refresh the investments list
                            // or update the specific investment's status
                          }}
                        />
                      </div>
                    )}

                  {/* Investment Details */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {investment?.shares && (
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>
                          {parseFloat(
                            investment.shares.toString(),
                          ).toLocaleString()}{' '}
                          shares
                          {investment?.percentage &&
                            ` (${parseFloat(investment.percentage.toString())}%)`}
                        </span>
                      </div>
                    )}

                    {investment?.current_value !== undefined &&
                      investment.current_value !== null && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-medium ${
                              investment?.total_returns !== undefined &&
                              parseFloat(investment.total_returns.toString()) >=
                                0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            Current:{' '}
                            {formatCurrency(
                              investment?.current_value,
                              investment?.currency,
                              investment?.currency_symbol || '$',
                            )}
                          </span>
                        </div>
                      )}

                    {investment?.roi !== undefined &&
                      investment.roi !== null && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-medium ${
                              parseFloat(investment.roi.toString()) >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            ROI:{' '}
                            {parseFloat(investment.roi.toString()) >= 0
                              ? '+'
                              : ''}
                            {parseFloat(investment.roi.toString())}%
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="text-xs lg:text-sm text-gray-500 whitespace-nowrap">
                    {formatInvestmentDate(investment)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    {/* Cancel Button - Only for cancellable investments */}
                    {isCancellable && (
                      <button
                        onClick={(e) => handleCancelClick(e, investment)}
                        disabled={isCancelling}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Cancel Investment"
                      >
                        <X size={12} />
                        {isCancelling ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}

                    {/* Certificate Buttons */}
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
                  {investment.campaign?.company_info?.name ||
                    investment.campaign?.company_name ||
                    investment?.company ||
                    'Unknown Company'}
                </p>
              </div>
            </div>
          );
        })}

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

      {/* Pagination */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            perPage={perPage}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
            showPerPageSelector={true}
          />
        </div>
      )}
    </motion.div>
  );
};
