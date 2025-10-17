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
import { FaInfoCircle, FaTimes, FaClock } from 'react-icons/fa';
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

  // Debug logging to see what investments we're getting
  useEffect(() => {
    if (portfolio?.investments) {
      console.log('🔍 ALL INVESTMENTS:', portfolio.investments);
      console.log('🔍 INVESTMENT STATUSES:', portfolio.investments.map(inv => ({
        id: inv.id,
        status: inv.status,
        committed: inv.status === 'committed',
        can_be_cancelled: inv.can_be_cancelled,
        cancel_window_expires_at: inv.cancel_window_expires_at
      })));
    }
  }, [portfolio]);

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

  // Enhanced function to check if investment can be cancelled
  const canBeCancelled = (investment: EquityInvestment): boolean => {
    if (investment.status !== 'committed') {
      console.log(`❌ Investment ${investment.id} not cancellable: status is ${investment.status}`);
      return false;
    }
    
    // Check if we have explicit can_be_cancelled flag
    if (investment.can_be_cancelled !== undefined) {
      console.log(`✅ Investment ${investment.id} cancellable: can_be_cancelled = ${investment.can_be_cancelled}`);
      return investment.can_be_cancelled;
    }
    
    // Fallback: check if cancel window exists and is in future
    if (investment.cancel_window_expires_at) {
      const canCancel = new Date(investment.cancel_window_expires_at) > new Date();
      console.log(`⏰ Investment ${investment.id} cancellable check: ${canCancel} (expires: ${investment.cancel_window_expires_at})`);
      return canCancel;
    }
    
    console.log(`❌ Investment ${investment.id} not cancellable: no cancellation window data`);
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

  // FIXED: Include committed investments in display
  const filterDisplayInvestments = (investments: EquityInvestment[]) => {
    const filtered = investments.filter(
      (investment) => 
        investment.status === 'successful' || 
        investment.status === 'committed' ||
        investment.status === 'pending' ||
        investment.status === 'processing'
    );
    console.log(`📊 Displaying ${filtered.length} investments:`, filtered.map(inv => ({ id: inv.id, status: inv.status })));
    return filtered;
  };

  // FIXED: Use the correct filtered investments
  const displayInvestments = filterDisplayInvestments(
    portfolio?.investments || [],
  );

  // For charts, only use successful investments
  const successfulInvestmentsForCharts = displayInvestments.filter(
    inv => inv.status === 'successful'
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

  // FIXED: Use display investments for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvestments = displayInvestments.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewCampaignDetails = (campaign: EquityInvestment) => {
    const identifier = campaign.campaign.slug;
    router.push(`/campaign/${identifier}?${generateRandomString()}`);
  };

  // Enhanced helper function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'committed':
        return 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold';
      case 'pending':
      case 'processing':
      case 'ongoing':
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'abandoned':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'reversed':
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'canceled':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Enhanced helper function to get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'successful':
        return 'Successful';
      case 'committed':
        return 'Committed • Cancel Available';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
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

  // Helper function to get investment action text based on status
  const getInvestmentActionText = (
    status: string,
    amount: string,
    campaignName: string,
  ) => {
    const formattedAmount = formatCurrency(
      parseNumber(amount),
      user?.currency || 'GHS',
      user?.currency_symbol || '₵',
    );

    switch (status) {
      case 'successful':
        return `You invested ${formattedAmount} in ${campaignName}`;
      case 'committed':
        return `You committed ${formattedAmount} to ${campaignName} (48-hour cancellation window)`;
      case 'pending':
      case 'processing':
      case 'ongoing':
      case 'queued':
        return `You attempted to invest ${formattedAmount} in ${campaignName}`;
      case 'failed':
        return `Your investment of ${formattedAmount} in ${campaignName} failed`;
      case 'abandoned':
        return `You abandoned your ${formattedAmount} investment in ${campaignName}`;
      case 'reversed':
      case 'refunded':
        return `Your ${formattedAmount} investment in ${campaignName} was refunded`;
      case 'canceled':
        return `You canceled your ${formattedAmount} investment in ${campaignName}`;
      default:
        return `Investment activity with ${campaignName}`;
    }
  };

  if (loading) {
    return <EquityInvestmentsLoader />;
  }

  if (error) {
    return (
      <div className="px-2 py-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="px-2 py-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No portfolio data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-4">
      {/* Cancellation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Investment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your investment in{' '}
              {selectedInvestment?.campaign?.company_name}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancellation-reason">
                Reason for cancellation
              </Label>
              <Textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this investment..."
                className="mt-1"
              />
            </div>
            {selectedInvestment && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-800">
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
            >
              Keep Investment
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelInvestment}
              disabled={
                !cancellationReason.trim() || cancellingInvestment !== null
              }
            >
              {cancellingInvestment ? 'Cancelling...' : 'Cancel Investment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Equity Investments</h1>
        <div className="flex space-x-4">
          <Link href="/invest">
            <Button
              variant="outline"
              className="text-gray-700 rounded-full shadow-sm"
            >
              Browse Founders
            </Button>
          </Link>
        </div>
      </div>

      {/* Use the backend-calculated portfolio summary */}
      <PortfolioSummary
        portfolio={portfolio?.portfolio}
        currency={user?.currency}
        currencySymbol={user?.currency_symbol}
      />

      {/* Performance Charts Section - Use successful investments only */}
      <PerformanceCharts
        investments={successfulInvestmentsForCharts}
        currency={user?.currency}
        currencySymbol={user?.currency_symbol}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8 mt-8">
        <div className="px-2 py-4">
          <h2 className="text-xl font-semibold mb-4">Your Investments</h2>

          {/* Cancellation Notice Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaClock className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  48-Hour Cancellation Window
                </p>
                <p className="text-xs text-blue-700">
                  You can cancel committed investments within 48 hours. After
                  this period, investments will be finalized and cannot be
                  cancelled.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Disclaimer Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Investment Information Notice
                </p>
                <p className="text-xs text-blue-700">
                  The figures shown, returns and current values are based on
                  careful projections and may change. While some results may
                  align with these estimates, the final terms will always be set
                  out in the investment instrument and agreement between you and
                  the company.
                </p>
              </div>
            </div>
          </div>

          {displayInvestments.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">
                You haven't made any investments yet
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shares
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Return
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInvestments.map((investment: EquityInvestment) => {
                      const investmentAmount = parseNumber(investment.amount);
                      const currentValue = hasValueData(investment.status)
                        ? parseNumber(
                            investment.current_value,
                            investmentAmount,
                          )
                        : investmentAmount;
                      const investmentReturn = currentValue - investmentAmount;
                      const returnPct =
                        investmentAmount > 0
                          ? (investmentReturn / investmentAmount) * 100
                          : 0;

                      const isCertificateLoading =
                        certificateOperations[investment.id];
                      const hasCertificate =
                        investment.certificate_exists ||
                        investment.certificate?.exists;
                      const isExpanded = expandedInvestments.has(investment.id);
                      const canDownloadCertificate = canHaveCertificate(
                        investment.status,
                      );
                      const isCancellable = canBeCancelled(investment);
                      const timeRemaining = getTimeRemaining(investment);

                      console.log(`🎯 Investment ${investment.id}:`, {
                        status: investment.status,
                        isCancellable,
                        can_be_cancelled: investment.can_be_cancelled,
                        cancel_window_expires_at: investment.cancel_window_expires_at
                      });

                      return (
                        <>
                          <tr
                            key={investment.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleInvestmentDetails(investment.id)
                                  }
                                  className="mr-2"
                                >
                                  {isExpanded ? '−' : '+'}
                                </Button>
                                <div className="font-medium text-gray-900">
                                  {investment.campaign?.company_name ||
                                    `Campaign ${investment.campaign_id}`}
                                </div>
                              </div>
                              {isCancellable && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                  <FaClock className="flex-shrink-0" />
                                  <span>Cancel within: {timeRemaining}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatCurrency(
                                investmentAmount,
                                investment.currency || user?.currency,
                                investment.currency_symbol ||
                                  user?.currency_symbol,
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {parseNumber(investment.shares).toLocaleString()}{' '}
                              ({parseNumber(investment.percentage).toFixed(2)}%)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {hasValueData(investment.status) ? (
                                formatCurrency(
                                  currentValue,
                                  investment.currency || user?.currency,
                                  investment.currency_symbol ||
                                    user?.currency_symbol,
                                )
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {hasValueData(investment.status) ? (
                                <div className="flex flex-col">
                                  <span
                                    className={`font-medium ${
                                      investmentReturn >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}
                                  >
                                    {formatCurrency(
                                      investmentReturn,
                                      investment.currency || user?.currency,
                                      investment.currency_symbol ||
                                        user?.currency_symbol,
                                    )}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className={`w-fit mt-1 border ${
                                      investmentReturn >= 0
                                        ? 'bg-green-100 text-green-700 border-green-300'
                                        : 'bg-red-100 text-red-700 border-red-300'
                                    }`}
                                  >
                                    {investmentReturn >= 0 ? '+' : ''}
                                    {returnPct.toFixed(2)}%
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(
                                  investment.status,
                                )}`}
                              >
                                {getStatusDisplayText(investment.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  className="text-orange-600 hover:text-orange-900"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewCampaignDetails(investment)
                                  }
                                >
                                  View
                                </Button>

                                {/* Cancel Button for Committed Investments */}
                                {isCancellable && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openCancelDialog(investment)}
                                    disabled={
                                      cancellingInvestment ===
                                      investment.id.toString()
                                    }
                                    className="text-red-600 hover:text-red-900 border-red-200"
                                  >
                                    <FaTimes className="mr-1" />
                                    Cancel
                                  </Button>
                                )}

                                {/* Certificate Button for Successful Investments */}
                                {canDownloadCertificate && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDownloadCertificate(
                                        investment.id.toString(),
                                      )
                                    }
                                    disabled={isCertificateLoading}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    {isCertificateLoading
                                      ? 'Loading...'
                                      : hasCertificate
                                        ? 'Certificate'
                                        : 'Generate Certificate'}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Company Information */}
                                  <div>
                                    <h4 className="font-semibold text-lg mb-3">
                                      Company Information
                                    </h4>
                                    {investment.company_info ? (
                                      <div className="space-y-2">
                                        <p>
                                          <strong>Name:</strong>{' '}
                                          {investment.company_info.name}
                                        </p>
                                        <p>
                                          <strong>Description:</strong>{' '}
                                          {investment.company_info.description}
                                        </p>
                                        <p>
                                          <strong>Headquarters:</strong>{' '}
                                          {investment.company_info
                                            .headquarters || 'N/A'}
                                        </p>
                                        <p>
                                          <strong>Website:</strong>
                                          <a
                                            href={
                                              investment.company_info.website ||
                                              '#'
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-500 hover:underline ml-1"
                                          >
                                            {investment.company_info.website ||
                                              'N/A'}
                                          </a>
                                        </p>
                                        <p>
                                          <strong>Contract Term:</strong>{' '}
                                          {investment.company_info
                                            .contract_term || 'N/A'}
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="text-gray-500">
                                        No company information available
                                      </p>
                                    )}
                                  </div>

                                  {/* Team Members */}
                                  <div>
                                    <h4 className="font-semibold text-lg mb-3">
                                      Team Members
                                    </h4>
                                    {investment.team_members &&
                                    investment.team_members.length > 0 ? (
                                      <div className="space-y-3">
                                        {investment.team_members.map(
                                          (member) => (
                                            <div
                                              key={member.id}
                                              className="flex items-center space-x-3 p-2 bg-white rounded-lg"
                                            >
                                              <Avatar
                                                name={member.name}
                                                size="xl"
                                                imageUrl={member.avatar_url}
                                              />
                                              <div>
                                                <p className="font-medium">
                                                  {member.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                  {member.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  {member.role}
                                                </p>
                                                {member.equity_percentage >
                                                  0 && (
                                                  <p className="text-xs text-green-600">
                                                    Equity:{' '}
                                                    {member.equity_percentage}%
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-gray-500">
                                        No team information available
                                      </p>
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
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            </>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-pink-500">💫</span> Recent Activity
        </h3>

        <div className="space-y-6">
          {displayInvestments
            .slice(0, 3)
            .map((investment: EquityInvestment) => {
              const amount = formatCurrency(
                parseNumber(investment.amount),
                investment.currency || user?.currency,
                investment.currency_symbol || user?.currency_symbol,
              );

              const campaignName =
                investment.campaign?.title ||
                `Campaign #${investment.campaign_id}`;
              const date = format(
                new Date(investment.created_at),
                'MMM dd, yyyy',
              );

              // Get the appropriate action text based on status
              const actionText = getInvestmentActionText(
                investment.status,
                investment.amount.toString(),
                campaignName,
              );

              // Only show detailed information for successful investments
              const isSuccessful = investment.status === 'successful';
              const investment_id = investment.id;
              const shares = parseNumber(investment.shares)?.toLocaleString();
              const percentage = parseNumber(investment.percentage)?.toFixed(2);
              const certificate = investment.certificate?.number;

              return (
                <div
                  key={investment.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-700 mb-3">{actionText}</p>

                  {/* Only show detailed information for successful investments */}
                  {isSuccessful ? (
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        🆔 <span className="font-medium">ID:</span>{' '}
                        {investment_id}
                      </div>
                      {shares && (
                        <div className="flex items-center gap-1">
                          📈 <span className="font-medium">Shares:</span>{' '}
                          {shares}
                        </div>
                      )}
                      {percentage && (
                        <div className="flex items-center gap-1">
                          🎯 <span className="font-medium">Equity:</span>{' '}
                          {percentage}%
                        </div>
                      )}
                      {certificate && (
                        <div className="flex items-center gap-1">
                          🎖️ <span className="font-medium">Cert:</span>{' '}
                          {certificate}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Investment details will be available upon successful
                      completion
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                    ⏰{' '}
                    {investment.status === 'successful'
                      ? 'Invested'
                      : investment.status === 'committed'
                        ? 'Committed'
                        : 'Attempted'}{' '}
                    on {date}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default EquityInvestments;