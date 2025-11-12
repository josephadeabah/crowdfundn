// app/account/investor-clubs/components/ShareChanges/ShareChangesSection.tsx

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
} from 'lucide-react';

interface ShareChangesSectionProps {
  club: any;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const ShareChangesSection: React.FC<ShareChangesSectionProps> = ({
  club,
  formatCurrency,
}) => {
  const { token } = useAuth();
  const [shareChanges, setShareChanges] = useState<ShareChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_count: 0,
  });
  const [summary, setSummary] = useState<{
    total_changes: number;
    current_share: number;
    total_contributed: number;
  } | null>(null);
  const [expandedChange, setExpandedChange] = useState<string | null>(null);

  const loadShareChanges = async (page: number = 1) => {
    if (!token || !club) return;

    setLoading(true);
    setError(null);

    try {
      const response: ShareChangesResponse =
        await shareChangeService.getMyShareChanges(
          token,
          club.slug,
          page,
          pagination.per_page,
        );

      setShareChanges(response.share_changes);
      setPagination(response.pagination);
      setSummary(response.summary || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load share changes');
      console.error('Failed to load share changes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShareChanges();
  }, [club, token]);

  const handlePageChange = (page: number) => {
    loadShareChanges(page);
  };

  const toggleExpand = (changeId: string) => {
    setExpandedChange(expandedChange === changeId ? null : changeId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChangeIcon = (changeAmount: number) => {
    return changeAmount > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (changeAmount: number) => {
    return changeAmount > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeSymbol = (changeAmount: number) => {
    return changeAmount > 0 ? '+' : '';
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
        <h3 className="text-lg font-semibold">Share Change History</h3>
        {summary && (
          <div className="text-sm text-gray-600">
            Current Share:{' '}
            <span className="font-semibold text-emerald-600">
              {summary.current_share.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => loadShareChanges()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
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
            Your share changes will appear here after contributions.
          </p>
        </div>
      ) : (
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
                      {getChangeSymbol(change.change_amount)}
                      {change.change_amount.toFixed(4)}%
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(change.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`text-sm font-semibold ${getChangeColor(change.change_amount)}`}
                  >
                    {change.previous_share.toFixed(2)}% →{' '}
                    {change.new_share.toFixed(2)}%
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
                          <span className="text-gray-500">Previous Share:</span>
                          <span className="font-medium">
                            {change.previous_share.toFixed(4)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">New Share:</span>
                          <span className="font-medium text-emerald-600">
                            {change.new_share.toFixed(4)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Net Change:</span>
                          <span
                            className={`font-medium ${getChangeColor(change.change_amount)}`}
                          >
                            {getChangeSymbol(change.change_amount)}
                            {change.change_amount.toFixed(4)}%
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
                            {change.change_percentage.toFixed(2)}%
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
                              change.total_contributions_at_time,
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
                                  change.contribution.amount,
                                  change.contribution.currency,
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
      )}

      {pagination.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
            {Math.min(
              pagination.current_page * pagination.per_page,
              pagination.total_count,
            )}{' '}
            of {pagination.total_count} changes
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
