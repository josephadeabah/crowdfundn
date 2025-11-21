import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShareChange, ShareChangesResponse } from '../../clubTypes';
import { shareChangeService } from '../../services/shareChangeService';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertCircle,
  Users,
  PieChart,
  Info,
} from 'lucide-react';
import Pagination from '@/app/components/pagination/Pagination';

interface ShareChangesSectionProps {
  club: any;
  formatCurrency: (amount: number, currency?: string) => string;
  currentUserShare?: number; // NEW: Add current user share prop
}

export const ShareChangesSection: React.FC<ShareChangesSectionProps> = ({
  club,
  formatCurrency,
  currentUserShare, // NEW: Receive current user share
}) => {
  const { token, user } = useAuth();
  const [shareChanges, setShareChanges] = useState<ShareChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    per_page: 5,
    total_count: 0,
  });
  const [expandedChange, setExpandedChange] = useState<string | null>(null);

  // FIXED: Enhanced safe number formatting with validation
  const safeToFixed = (value: any, decimals: number = 4): string => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
      return '0.00';
    }
    const numValue = Number(value);
    // Validate the number is finite and reasonable
    if (!isFinite(numValue) || Math.abs(numValue) > 1000000) {
      return '0.00';
    }
    return numValue.toFixed(decimals);
  };

  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
      return 0;
    }
    const numValue = Number(value);
    return isFinite(numValue) ? numValue : 0;
  };

  // FIXED: Enhanced current user share display with validation
  const displayCurrentUserShare = () => {
    if (currentUserShare === undefined || currentUserShare === null) {
      return '0.00';
    }
    const shareValue = safeNumber(currentUserShare);
    // Validate share is between 0 and 100
    const validShare = Math.max(0, Math.min(100, shareValue));
    return safeToFixed(validShare, 2);
  };

  const loadShareChanges = async (
    page: number = 1,
    perPage: number = pagination.per_page,
  ) => {
    if (!token || !club) return;

    setLoading(true);
    setError(null);

    try {
      const response: ShareChangesResponse =
        await shareChangeService.getShareChanges(
          token,
          club.slug,
          page,
          perPage,
        );

      // Validate and sanitize the data
      const validatedChanges = response.share_changes.map((change) => ({
        ...change,
        previous_share: safeNumber(change.previous_share),
        new_share: safeNumber(change.new_share),
        change_amount: safeNumber(change.change_amount),
        change_percentage: safeNumber(change.change_percentage),
        total_contributions_at_time: safeNumber(
          change.total_contributions_at_time,
        ),
      }));

      setShareChanges(validatedChanges);
      setPagination(response.pagination);
    } catch (err: any) {
      // Handle specific error cases
      if (
        err.message.includes('500') ||
        err.message.includes('Internal Server Error')
      ) {
        setError(
          'Share history service is temporarily unavailable. Please try again later.',
        );
      } else if (err.message.includes('404')) {
        setError('Share history not available for this club.');
      } else {
        setError(err.message || 'Failed to load share changes');
      }
      console.error('Failed to load share changes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShareChanges();
  }, [club, token]);

  const handlePageChange = (page: number) => {
    loadShareChanges(page, pagination.per_page);
  };

  const handlePerPageChange = (perPage: number) => {
    loadShareChanges(1, perPage);
  };

  const toggleExpand = (changeId: string) => {
    setExpandedChange(expandedChange === changeId ? null : changeId);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getChangeIcon = (changeAmount?: number) => {
    const amt = changeAmount ?? 0;
    return amt > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (changeAmount?: number) => {
    const amt = changeAmount ?? 0;
    return amt > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeSymbol = (changeAmount?: number) => {
    const amt = changeAmount ?? 0;
    return amt > 0 ? '+' : '';
  };

  if (loading && shareChanges.length === 0) {
    return (
      <div className="bg-white rounded-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Share Change History</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-sm p-4 lg:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">All Members Share Changes</h3>
        </div>

        {/* FIXED: Enhanced current user share display */}
        {currentUserShare !== undefined && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <PieChart className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Your Share:{' '}
              <span className="font-bold text-green-600">
                {displayCurrentUserShare()}%
              </span>
            </span>
          </div>
        )}
      </div>

      {/* FIXED: Add share calculation explanation */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">How shares are calculated:</p>
            <p className="text-xs mt-1">
              Your share percentage = (Your Total Contributions ÷ Club Total Contributions) × 100
              {currentUserShare !== undefined && club?.financials && (
                <span className="block mt-1">
                  Your share: {safeToFixed(currentUserShare, 4)}% = 
                  ({formatCurrency(
                    club.members?.find((m: any) => Number(m.user.id) === Number(user?.id))?.total_contributed || 0, 
                    club.currency
                  )} ÷ {formatCurrency(club.financials.total_contributions, club.currency)}) × 100
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
          <button
            onClick={() => loadShareChanges()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {shareChanges.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm">No share changes recorded yet.</p>
          <p className="text-xs mt-1">
            Share changes will appear here after contributions.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {shareChanges.map((change) => (
              <div
                key={change.id}
                className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => toggleExpand(change.id)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getChangeIcon(change.change_amount)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {change.membership?.user?.full_name || 'Unknown Member'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(change.created_at)}</span>
                        <span
                          className={`font-medium ${getChangeColor(change.change_amount)}`}
                        >
                          {getChangeSymbol(change.change_amount)}
                          {safeToFixed(change.change_amount, 4)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`text-sm font-semibold ${getChangeColor(change.change_amount)}`}
                    >
                      {safeToFixed(change.previous_share, 2)}% →{' '}
                      {safeToFixed(change.new_share, 2)}%
                    </div>
                    {expandedChange === change.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedChange === change.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4 border-t border-gray-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-2">Change Details</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Member:</span>
                            <span className="font-medium">
                              {change.membership?.user?.full_name ||
                                'Unknown Member'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Previous Share:
                            </span>
                            <span className="font-medium">
                              {safeToFixed(change.previous_share, 4)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">New Share:</span>
                            <span className="font-medium text-emerald-600">
                              {safeToFixed(change.new_share, 4)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Net Change:</span>
                            <span
                              className={`font-medium ${getChangeColor(change.change_amount)}`}
                            >
                              {getChangeSymbol(change.change_amount)}
                              {safeToFixed(change.change_amount, 4)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Percentage Change:
                            </span>
                            <span
                              className={`font-medium ${getChangeColor(change.change_amount)}`}
                            >
                              {getChangeSymbol(change.change_percentage)}
                              {safeToFixed(change.change_percentage, 2)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-600 mb-2">Context</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reason:</span>
                            <span className="font-medium capitalize">
                              {change.change_reason || 'recalculation'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Club Funds:</span>
                            <span className="font-medium">
                              {formatCurrency(
                                safeNumber(change.total_contributions_at_time),
                                club.currency,
                              )}
                            </span>
                          </div>
                          {change.contribution && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Contribution:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(
                                    safeNumber(change.contribution.amount),
                                    change.contribution.currency ||
                                      club.currency,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Contribution Date:
                                </span>
                                <span className="font-medium">
                                  {formatDate(change.contribution.created_at)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          {pagination.total_pages > 1 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              totalCount={pagination.total_count}
              perPage={pagination.per_page}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              showPerPageSelector={true}
            />
          )}
        </>
      )}
    </motion.div>
  );
};