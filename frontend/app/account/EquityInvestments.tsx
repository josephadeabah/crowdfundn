// app/components/equity/EquityInvestments.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { format } from 'date-fns';
import {
  EquityInvestment,
  InvestmentPortfolio,
} from '@/app/types/equityCampaigns.types';
import Pagination from '@/app/components/pagination/Pagination';
import EquityInvestmentsLoader from '@/app/loaders/EquityInvestmentsLoader';
import { generateRandomString } from '@/app/utils/helpers/generate.random-string';
import { useEquityCampaignContext } from '../context/account/campaign/EquityCampaignContext';
import { useAuth } from '../context/auth/AuthContext';
import { PerformanceCharts } from '../components/investchart/PerformanceCharts';
import { PortfolioSummary } from '../components/investchart/PortfolioSummary';
import { Badge } from '../components/ui/badge';
import { formatCurrency } from '../utils/helpers/calculate.days';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import Avatar from '../components/avatar/Avatar';
import { 
  FaInfoCircle, 
  FaTimes, 
  FaClock, 
  FaDownload, 
  FaEye,
  FaRocket,
  FaChartLine,
  FaHistory,
  FaGlobeAmericas
} from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

const EquityInvestments = () => {
  const {
    fetchPortfolio,
    portfolio,
    loading,
    error,
    generateCertificate,
    downloadCertificate,
    checkCertificateStatus,
    certificateError,
    cancelInvestment,
  } = useEquityCampaignContext();
  const { user } = useAuth();
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [certificateOperations, setCertificateOperations] = useState<{
    [key: string]: boolean;
  }>({});
  const [cancellingInvestment, setCancellingInvestment] = useState<
    string | null
  >(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<EquityInvestment | null>(null);
  const [expandedInvestments, setExpandedInvestments] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    fetchPortfolio(currentPage, itemsPerPage);
  }, [fetchPortfolio, currentPage, itemsPerPage]);

  const parseNumber = (
    value: string | number | undefined,
    fallback = 0,
  ): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || fallback;
    return fallback;
  };

  const toggleInvestmentDetails = (investmentId: number) => {
    const newExpanded = new Set(expandedInvestments);
    if (newExpanded.has(investmentId)) {
      newExpanded.delete(investmentId);
    } else {
      newExpanded.add(investmentId);
    }
    setExpandedInvestments(newExpanded);
  };

  // Enhanced cancellation handler
  const handleCancelInvestment = async () => {
    if (!selectedInvestment || !cancellationReason.trim()) return;

    setCancellingInvestment(selectedInvestment.id.toString());

    try {
      const result = await cancelInvestment(
        selectedInvestment.id.toString(),
        cancellationReason.trim(),
      );

      if (result.success) {
        // Refresh portfolio data
        await fetchPortfolio(currentPage, itemsPerPage);
        setShowCancelDialog(false);
        setCancellationReason('');
        setSelectedInvestment(null);
      } else {
        console.error('Failed to cancel investment:', result.error);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error cancelling investment:', error);
    } finally {
      setCancellingInvestment(null);
    }
  };

  const openCancelDialog = (investment: EquityInvestment) => {
    setSelectedInvestment(investment);
    setCancellationReason('');
    setShowCancelDialog(true);
  };

  const closeCancelDialog = () => {
    setShowCancelDialog(false);
    setSelectedInvestment(null);
    setCancellationReason('');
  };

  // Add this function near your other helper functions, after canBeCancelled
  const hasCancellableInvestments = (
    investments: EquityInvestment[],
  ): boolean => {
    return investments.some((investment) => canBeCancelled(investment));
  };

  // Enhanced function to check if investment can be cancelled
  const canBeCancelled = (investment: EquityInvestment): boolean => {
    if (investment.status !== 'committed') return false;

    // Check if we have explicit can_be_cancelled flag
    if (investment.can_be_cancelled !== undefined) {
      return investment.can_be_cancelled;
    }

    // Fallback: check if cancel window exists and is in future
    if (investment.cancel_window_expires_at) {
      return new Date(investment.cancel_window_expires_at) > new Date();
    }

    return false;
  };

  // Helper function to get time remaining for cancellation
  const getTimeRemaining = (investment: EquityInvestment): string => {
    if (!investment.cancel_window_expires_at) return 'No cancellation window';

    const expiresAt = new Date(investment.cancel_window_expires_at);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expired';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m`;
  };

  // Include committed investments in display
  const filterDisplayInvestments = (investments: EquityInvestment[]) => {
    return investments.filter(
      (investment) =>
        investment.status === 'successful' ||
        investment.status === 'committed' ||
        investment.status === 'pending' ||
        investment.status === 'processing',
    );
  };

  // Use the correct filtered investments
  const displayInvestments = filterDisplayInvestments(
    portfolio?.investments || [],
  );

  // For charts, only use successful investments
  const successfulInvestmentsForCharts = displayInvestments.filter(
    (inv) => inv.status === 'successful',
  );

  const handleDownloadCertificate = async (investmentId: string) => {
    setCertificateOperations((prev) => ({ ...prev, [investmentId]: true }));

    try {
      const investment: EquityInvestment | undefined =
        portfolio?.investments?.find(
          (inv: EquityInvestment) => inv.id.toString() === investmentId,
        );

      if (!investment) {
        console.error('Investment not found');
        return;
      }

      // Only allow certificate download for successful investments
      if (investment.status !== 'successful') {
        console.error('Certificate only available for successful investments');
        return;
      }

      // Get the campaign ID from the investment
      const campaignId =
        investment.campaign_id?.toString() ||
        investment.campaign?.id?.toString();

      if (!campaignId) {
        console.error('Campaign ID not found for investment');
        return;
      }

      // First check certificate status
      const statusResult = await checkCertificateStatus(
        investmentId,
        campaignId,
      );

      if (statusResult.exists && statusResult.url) {
        // Certificate exists, download it
        await downloadCertificate(investmentId, campaignId);
      } else {
        // Certificate doesn't exist, generate it first
        const genResult = await generateCertificate(investmentId, campaignId);
        if (genResult.success && genResult.url) {
          // After generation, download it
          await downloadCertificate(investmentId, campaignId);
        } else {
          console.error('Certificate generation failed:', genResult.error);
        }
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
    } finally {
      setCertificateOperations((prev) => ({ ...prev, [investmentId]: false }));
    }
  };

  // Calculate pagination data - Use the display investments
  const totalItems = displayInvestments.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Use display investments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvestments = displayInvestments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewCampaignDetails = (campaign: EquityInvestment) => {
    const identifier = campaign.campaign.slug;
    router.push(`/campaign/${identifier}?${generateRandomString()}`);
  };

  // Modern status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-emerald-500/10 text-emerald-700 border border-emerald-200';
      case 'committed':
        return 'bg-blue-500/10 text-blue-700 border border-blue-200 font-semibold';
      case 'pending':
      case 'processing':
      case 'ongoing':
      case 'queued':
        return 'bg-amber-500/10 text-amber-700 border border-amber-200';
      case 'failed':
        return 'bg-red-500/10 text-red-700 border border-red-200';
      case 'abandoned':
        return 'bg-gray-500/10 text-gray-700 border border-gray-200';
      case 'reversed':
      case 'refunded':
        return 'bg-purple-500/10 text-purple-700 border border-purple-200';
      case 'canceled':
        return 'bg-orange-500/10 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border border-gray-200';
    }
  };

  // Enhanced helper function to get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'successful':
        return 'Active';
      case 'committed':
        return 'Pending • Cancel Available';
      case 'pending':
        return 'Processing';
      case 'processing':
        return 'Verifying';
      case 'ongoing':
        return 'In Progress';
      case 'queued':
        return 'Queued';
      case 'failed':
        return 'Failed';
      case 'abandoned':
        return 'Abandoned';
      case 'reversed':
        return 'Reversed';
      case 'refunded':
        return 'Refunded';
      case 'canceled':
        return 'Canceled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Helper function to determine if investment can have certificate
  const canHaveCertificate = (status: string) => {
    return status === 'successful';
  };

  // Helper function to determine if investment has value data
  const hasValueData = (status: string) => {
    return status === 'successful';
  };

  if (loading) {
    return <EquityInvestmentsLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Portfolio</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Portfolio Data</h3>
            <p className="text-gray-600 mb-6">Start building your investment portfolio today.</p>
            <Link href="/invest">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-8 py-3 shadow-lg">
                Explore Investment Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      {/* Cancellation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-white rounded-2xl border-0 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Cancel Investment</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to cancel your investment in{' '}
              {selectedInvestment?.campaign?.company_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancellation-reason" className="text-sm font-medium text-gray-700">
                Reason for cancellation
              </Label>
              <Textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this investment..."
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {selectedInvestment && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800">
                  <FaClock className="flex-shrink-0" />
                  <span className="text-sm font-medium">
                    Time remaining: {getTimeRemaining(selectedInvestment)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCancelDialog}
              disabled={cancellingInvestment !== null}
              className="rounded-xl border-gray-300 hover:bg-gray-50"
            >
              Keep Investment
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelInvestment}
              disabled={
                !cancellationReason.trim() || cancellingInvestment !== null
              }
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              {cancellingInvestment ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cancelling...
                </div>
              ) : (
                'Cancel Investment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
              Investment Portfolio
            </h1>
            <p className="text-gray-600 text-lg">Track and manage your equity investments</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Link href="/invest">
              <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-xl px-6 py-3 shadow-sm flex items-center gap-2">
                <FaRocket className="text-blue-600" />
                Browse Startups
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary
          portfolio={portfolio?.portfolio}
          currency={user?.currency}
          currencySymbol={user?.currency_symbol}
        />

        {/* Performance Charts */}
        <PerformanceCharts
          investments={successfulInvestmentsForCharts}
          currency={user?.currency}
          currencySymbol={user?.currency_symbol}
        />

        {/* Investments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Investments</h2>
                <p className="text-gray-600">Active and pending equity positions</p>
              </div>
              <div className="flex items-center gap-2 mt-4 lg:mt-0">
                <span className="text-sm text-gray-500">
                  {displayInvestments.length} investment{displayInvestments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Dynamic Banners */}
            <div className="space-y-4 mb-6">
              {/* Cancellation Notice Banner */}
              {hasCancellableInvestments(displayInvestments) && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500 p-2 rounded-lg flex-shrink-0 mt-0.5">
                      <FaClock className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-orange-800 mb-1">
                        ⚡ Pending Investments - 48-Hour Review Period
                      </p>
                      <p className="text-xs text-orange-700">
                        You have investments that can be cancelled within the next 48 hours. 
                        Review your commitments before they are finalized.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Disclaimer Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0 mt-0.5">
                    <FaInfoCircle className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      Investment Information
                    </p>
                    <p className="text-xs text-blue-700">
                      Values shown are based on current company valuations and may fluctuate. 
                      Past performance is not indicative of future results.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {displayInvestments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaChartLine className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Investments Yet</h3>
                <p className="text-gray-600 mb-6">Start building your portfolio by investing in promising startups.</p>
                <Link href="/invest">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-8 py-3 shadow-lg">
                    Explore Investment Opportunities
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Modern Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Investment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Ownership
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Current Value
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentInvestments.map((investment: EquityInvestment) => {
                        const investmentAmount = parseNumber(investment.amount);
                        const currentValue = hasValueData(investment.status)
                          ? parseNumber(investment.current_value, investmentAmount)
                          : investmentAmount;
                        const investmentReturn = currentValue - investmentAmount;
                        const returnPct = investmentAmount > 0 ? (investmentReturn / investmentAmount) * 100 : 0;

                        const isCertificateLoading = certificateOperations[investment.id];
                        const hasCertificate = investment.certificate_exists || investment.certificate?.exists;
                        const isExpanded = expandedInvestments.has(investment.id);
                        const canDownloadCertificate = canHaveCertificate(investment.status);
                        const isCancellable = canBeCancelled(investment);
                        const timeRemaining = getTimeRemaining(investment);

                        return (
                          <>
                            <tr key={investment.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleInvestmentDetails(investment.id)}
                                    className="mr-3 rounded-lg hover:bg-gray-200"
                                  >
                                    {isExpanded ? '−' : '+'}
                                  </Button>
                                  <div>
                                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {investment.campaign?.company_name || `Campaign ${investment.campaign_id}`}
                                    </div>
                                    {isCancellable && (
                                      <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                                        <FaClock className="flex-shrink-0 text-xs" />
                                        <span>Cancel within: {timeRemaining}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatCurrency(
                                    investmentAmount,
                                    investment.currency || user?.currency,
                                    investment.currency_symbol || user?.currency_symbol,
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {parseNumber(investment.shares).toLocaleString()} shares
                                </div>
                                <div className="text-xs text-gray-500">
                                  {parseNumber(investment.percentage).toFixed(4)}% equity
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {hasValueData(investment.status) ? (
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatCurrency(
                                      currentValue,
                                      investment.currency || user?.currency,
                                      investment.currency_symbol || user?.currency_symbol,
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {hasValueData(investment.status) ? (
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${
                                      investmentReturn >= 0 ? 'text-emerald-600' : 'text-red-600'
                                    }`}>
                                      {formatCurrency(
                                        investmentReturn,
                                        investment.currency || user?.currency,
                                        investment.currency_symbol || user?.currency_symbol,
                                      )}
                                    </span>
                                    <Badge variant="secondary" className={`${
                                      investmentReturn >= 0 
                                        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200' 
                                        : 'bg-red-500/10 text-red-700 border-red-200'
                                    }`}>
                                      {investmentReturn >= 0 ? '+' : ''}{returnPct.toFixed(1)}%
                                    </Badge>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(investment.status)}`}>
                                  {getStatusDisplayText(investment.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewCampaignDetails(investment)}
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                  >
                                    <FaEye className="w-4 h-4" />
                                  </Button>

                                  {isCancellable && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openCancelDialog(investment)}
                                      disabled={cancellingInvestment === investment.id.toString()}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                    >
                                      <FaTimes className="w-4 h-4" />
                                    </Button>
                                  )}

                                  {canDownloadCertificate && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadCertificate(investment.id.toString())}
                                      disabled={isCertificateLoading}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                                    >
                                      {isCertificateLoading ? (
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <FaDownload className="w-4 h-4" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr>
                                <td colSpan={7} className="px-6 py-4 bg-gray-50/50">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Company Information */}
                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaGlobeAmericas className="text-blue-600" />
                                        Company Details
                                      </h4>
                                      {investment.company_info ? (
                                        <div className="space-y-3 text-sm">
                                          <div>
                                            <span className="font-medium text-gray-700">Description:</span>
                                            <p className="text-gray-600 mt-1">{investment.company_info.description}</p>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <span className="font-medium text-gray-700">Headquarters:</span>
                                              <p className="text-gray-600">{investment.company_info.headquarters || 'N/A'}</p>
                                            </div>
                                            <div>
                                              <span className="font-medium text-gray-700">Contract:</span>
                                              <p className="text-gray-600">{investment.company_info.contract_term || 'N/A'}</p>
                                            </div>
                                          </div>
                                          {investment.company_info.website && (
                                            <div>
                                              <span className="font-medium text-gray-700">Website:</span>
                                              <a
                                                href={investment.company_info.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 block mt-1"
                                              >
                                                {investment.company_info.website}
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-gray-500 text-sm">No company information available</p>
                                      )}
                                    </div>

                                    {/* Team Members */}
                                    <div>
                                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaRocket className="text-green-600" />
                                        Team Members
                                      </h4>
                                      {investment.team_members && investment.team_members.length > 0 ? (
                                        <div className="space-y-3">
                                          {investment.team_members.slice(0, 3).map((member) => (
                                            <div key={member.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                              <Avatar name={member.name} size="lg" imageUrl={member.avatar_url} />
                                              <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{member.name}</p>
                                                <p className="text-sm text-gray-600 truncate">{member.title}</p>
                                                <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                                                {member.equity_percentage > 0 && (
                                                  <p className="text-xs text-emerald-600 font-medium">
                                                    Equity: {member.equity_percentage}%
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-gray-500 text-sm">No team information available</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={paginate}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FaHistory className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600 text-sm">Your latest investment movements</p>
            </div>
          </div>

          <div className="grid gap-4">
            {displayInvestments.slice(0, 3).map((investment: EquityInvestment) => {
              const amount = formatCurrency(
                parseNumber(investment.amount),
                investment.currency || user?.currency,
                investment.currency_symbol || user?.currency_symbol,
              );

              const campaignName = investment.campaign?.title || `Campaign #${investment.campaign_id}`;
              const date = format(new Date(investment.created_at), 'MMM dd, yyyy');

              return (
                <div key={investment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      investment.status === 'successful' ? 'bg-emerald-100 text-emerald-600' :
                      investment.status === 'committed' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {investment.status === 'successful' ? '✓' : investment.status === 'committed' ? '⏳' : '⋯'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {investment.status === 'successful' ? 'Invested' : 
                         investment.status === 'committed' ? 'Committed' : 'Attempted'} {amount}
                      </p>
                      <p className="text-sm text-gray-600">{campaignName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{date}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(investment.status)}`}>
                      {getStatusDisplayText(investment.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquityInvestments;