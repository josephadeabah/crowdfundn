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
  Users,
  User,
  Mail,
  Crown,
} from 'lucide-react';
import Modal from '@/app/components/modal/Modal';
import Avatar from '@/app/components/avatar/Avatar';

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
  onCancelInvestment?: (investmentId: string, reason?: string) => void;
  onDownloadCertificate: (investment: ClubInvestment) => void;
}

// Team Member Stack Component
const TeamMembersStack: React.FC<{ teamMembers: any[] }> = ({
  teamMembers,
}) => {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const toggleMemberDetails = (id: number) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  // Calculate positions for stack effect
  const getStackPosition = (index: number) => {
    const baseOffset = 12; // Base offset in pixels
    const maxVisible = 4; // Maximum members to show in stack
    const rotation = -2; // Slight rotation for depth

    if (index >= maxVisible) {
      return {
        zIndex: teamMembers.length - index,
        transform: `translateX(${baseOffset * maxVisible}px) rotate(${rotation}deg)`,
        opacity: 0.3,
      };
    }

    return {
      zIndex: teamMembers.length - index,
      transform: `translateX(${baseOffset * index}px) rotate(${index * rotation}deg)`,
      opacity: 1 - index * 0.1,
    };
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        Team Members
      </h3>

      <div className="relative">
        {/* Stacked Avatars */}
        <div className="flex items-center mb-6">
          <div className="relative h-16 mr-20">
            {teamMembers.slice(0, 5).map((member, index) => (
              <div
                key={member.id}
                className="absolute top-0 transition-all duration-300 ease-in-out hover:z-50 hover:scale-110 cursor-pointer"
                style={getStackPosition(index)}
                onClick={() => toggleMemberDetails(member.id)}
              >
                <Avatar
                  name={member.name}
                  imageUrl={member.avatar_url}
                  size="md"
                />
                {member.role === 'founder' && (
                  <div className="absolute -top-1 -right-1">
                    <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>
            ))}

            {/* Overflow indicator */}
            {teamMembers.length > 5 && (
              <div
                className="absolute top-0 transition-all duration-300 ease-in-out"
                style={getStackPosition(5)}
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white">
                  +{teamMembers.length - 5}
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium">{teamMembers.length} team members</p>
            <p className="text-xs">Click to view details</p>
          </div>
        </div>

        {/* Expanded Member Details */}
        {expandedMember !== null && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 animate-in fade-in duration-300">
            {teamMembers
              .filter((member) => member.id === expandedMember)
              .map((member) => (
                <div key={member.id} className="flex items-start gap-4">
                  <Avatar
                    name={member.name}
                    imageUrl={member.avatar_url}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {member.name}
                      </h4>
                      {member.role === 'founder' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Founder
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {member.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        {member.equity_percentage && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Percent className="w-4 h-4" />
                            <span>Equity: {member.equity_percentage}%</span>
                          </div>
                        )}
                      </div>

                      {member.description && (
                        <div className="md:col-span-2">
                          <p className="text-gray-700 leading-relaxed">
                            {member.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedMember(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* All Members List (Collapsible) */}
        <div className="border-t border-gray-200 pt-4">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 list-none">
              <Users className="w-4 h-4" />
              View all team members ({teamMembers.length})
              <span className="ml-auto transform group-open:rotate-180 transition-transform">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </summary>

            <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => toggleMemberDetails(member.id)}
                >
                  <Avatar
                    name={member.name}
                    imageUrl={member.avatar_url}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {member.name}
                      </p>
                      {member.role === 'founder' && (
                        <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {member.title}
                      {member.equity_percentage &&
                        ` • ${member.equity_percentage}% equity`}
                    </p>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <User className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

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
    </Modal>
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

  if (!investment) return null;

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

  // Extract team members from investment data
  const teamMembers = (investment as any).team_members || [];

  return (
    <>
      {/* Main Investment Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xlarge"
        closeOnBackdropClick={true}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Investment Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {investment.campaign?.title}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
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
                      investment.currency_symbol,
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
                    <span className="text-sm text-gray-600">
                      Current Value:
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(
                        investment.current_value,
                        investment.currency,
                        investment.currency_symbol,
                      )}
                    </span>
                  </div>
                )}
                {investment.total_returns !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Returns:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        investment.total_returns >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(
                        investment.total_returns,
                        investment.currency,
                        investment.currency_symbol,
                      )}
                    </span>
                  </div>
                )}
                {investment.roi !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ROI:</span>
                    <span
                      className={`text-sm font-medium ${
                        investment.roi >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {investment.roi >= 0 ? '+' : ''}
                      {investment.roi}%
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
                  Valuation:{' '}
                  {formatCurrency(
                    investment.campaign.valuation,
                    investment.campaign.currency,
                    investment.campaign.currency_symbol,
                  )}
                </p>
              )}
              {(investment as any).company_info && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Headquarters:</strong>{' '}
                    {(investment as any).company_info.headquarters || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Website:</strong>{' '}
                    {(investment as any).company_info.website ? (
                      <a
                        href={(investment as any).company_info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {(investment as any).company_info.website}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Team Members Section */}
          {teamMembers.length > 0 && (
            <TeamMembersStack teamMembers={teamMembers} />
          )}

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
                    You can cancel this investment within{' '}
                    {investment.time_remaining_for_cancellation}. The amount
                    will be refunded to the club balance.
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
            {investment.status === 'successful' &&
              investment.certificate_url && (
                <button
                  onClick={handleDownloadClick}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              )}

            {investment.status === 'successful' &&
              !investment.certificate_url && (
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
      </Modal>

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
