import React, { useState } from 'react';
import { ClubInvestment } from '../../clubTypes';
import {
  X,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Percent,
  DollarSign,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface InvestmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: ClubInvestment | null;
  formatCurrency: (amount: number | string | null | undefined, currency?: string, currencySymbol?: string) => string;
  formatDate: (dateString: string | null | undefined) => string;
  onCancelInvestment?: (investmentId: string, reason?: string) => void;
  onDownloadCertificate: (investment: ClubInvestment) => void;
}

// Cancellation Modal Component
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
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

        {investment && investment.cancel_window_expires_at && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Time remaining: {investment.time_remaining_for_cancellation}
              </span>
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
      </div>
    </div>
  );
};

export const InvestmentDetailsModal: React.FC<InvestmentDetailsModalProps> = ({
  isOpen,
  onClose,
  investment,
  formatCurrency,
  formatDate,
  onCancelInvestment,
  onDownloadCertificate,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen || !investment) return null;

  const getStatusBadge = () => {
    switch (investment.status) {
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
            Payment Pending
          </span>
        );
      case 'committed':
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
            Committed (48h Cancellation Window)
          </span>
        );
      case 'successful':
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
            Successful
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 border border-red-200">
            Failed
          </span>
        );
      case 'canceled':
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
            Canceled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
            {investment.status}
          </span>
        );
    }
  };

  const canBeCancelled = investment.can_be_cancelled || false;

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!onCancelInvestment) return;

    setCancelling(true);
    try {
      await onCancelInvestment(investment.id, reason);
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel investment:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadClick = () => {
    onDownloadCertificate(investment);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Investment Details
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {investment.campaign?.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Investment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge()}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        investment.investment_amount,
                        investment.currency,
                        investment.currency_symbol
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium">
                      {formatDate(investment.investment_date)}
                    </span>
                  </div>
                  {investment.shares && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shares:</span>
                      <span className="text-sm font-medium">
                        {investment.shares.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {investment.percentage && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ownership:</span>
                      <span className="text-sm font-medium">
                        {investment.percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Performance
                </h3>
                <div className="space-y-3">
                  {investment.current_value !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Value:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(
                          investment.current_value,
                          investment.currency,
                          investment.currency_symbol
                        )}
                      </span>
                    </div>
                  )}
                  {investment.total_returns !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Returns:</span>
                      <span className={`text-sm font-medium ${
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
                  {investment.roi !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI:</span>
                      <span className={`text-sm font-medium ${
                        investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {investment.roi >= 0 ? '+' : ''}{investment.roi}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Company Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">
                  {investment.campaign?.company_name || 'Unknown Company'}
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  {investment.campaign?.title}
                </p>
                {investment.campaign?.valuation && (
                  <p className="text-sm text-gray-600 mt-1">
                    Valuation: {formatCurrency(
                      investment.campaign.valuation,
                      investment.campaign.currency,
                      investment.campaign.currency_symbol
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Cancellation Info */}
            {canBeCancelled && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-orange-800">
                      48-Hour Cancellation Window
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      You can cancel this investment within {investment.time_remaining_for_cancellation}. 
                      The amount will be refunded to the club balance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {/* Cancel Button */}
              {canBeCancelled && (
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel Investment
                </button>
              )}

              {/* Certificate Buttons */}
              {investment.status === 'successful' && investment.certificate_url && (
                <button
                  onClick={handleDownloadClick}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              )}

              {investment.status === 'successful' && !investment.certificate_url && (
                <button
                  onClick={handleDownloadClick}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Certificate
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        investment={investment}
        isLoading={cancelling}
      />
    </>
  );
};