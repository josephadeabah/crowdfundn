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
  } = useEquityCampaignContext();
  const { user } = useAuth();
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [certificateOperations, setCertificateOperations] = useState<{
    [key: string]: boolean;
  }>({});
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

  // Filter out pending investments for display purposes only
  const filterOutPendingInvestments = (investments: EquityInvestment[]) => {
    return investments.filter((investment) => investment.status !== 'pending');
  };

  const successfulInvestments = filterOutPendingInvestments(
    portfolio?.investments || [],
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

  // Calculate pagination data - Use the backend-provided portfolio data
  const totalItems =
    portfolio?.portfolio?.total_invested_count ||
    portfolio?.investments?.length ||
    0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items - Use the investments array from the portfolio response
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvestments =
    portfolio?.investments?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleViewCampaignDetails = (campaign: EquityInvestment) => {
    const identifier = campaign.campaign.slug;
    router.push(`/campaign/${identifier}?${generateRandomString()}`);
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300">
            No portfolio data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Equity Investments
        </h1>
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

      {/* Performance Charts Section - Use filtered investments for display only */}
      <PerformanceCharts
        investments={successfulInvestments}
        currency={user?.currency}
        currencySymbol={user?.currency_symbol}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8 mt-8">
        <div className="px-2 py-4">
          <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
          {portfolio.investments?.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                You haven't made any investments yet
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Invested
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Shares
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Return
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentInvestments.map((investment: EquityInvestment) => {
                      const investmentAmount = parseNumber(investment.amount);
                      const currentValue = parseNumber(
                        investment.current_value,
                        investmentAmount,
                      );
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

                      return (
                        <>
                          <tr
                            key={investment.id}
                            className="hover:bg-muted/50 transition-colors"
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
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {investment.campaign?.company_name ||
                                    `Campaign ${investment.campaign_id}`}
                                </div>
                              </div>
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
                              {formatCurrency(
                                currentValue,
                                investment.currency || user?.currency,
                                investment.currency_symbol ||
                                  user?.currency_symbol,
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span
                                  className={`font-medium ${
                                    investmentReturn >= 0
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
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
                                      ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
                                      : 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700'
                                  }`}
                                >
                                  {investmentReturn >= 0 ? '+' : ''}
                                  {returnPct.toFixed(2)}%
                                </Badge>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  investment.status === 'successful'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : investment.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}
                              >
                                {investment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                className="text-orange-600 hover:text-orange-900 dark:hover:text-orange-400 mr-4"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewCampaignDetails(investment)
                                }
                              >
                                View
                              </Button>
                              {investment.status === 'successful' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadCertificate(
                                      investment.id.toString(),
                                    )
                                  }
                                  disabled={isCertificateLoading}
                                  className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                >
                                  {isCertificateLoading
                                    ? 'Loading...'
                                    : hasCertificate
                                      ? 'Certificate'
                                      : 'Generate Certificate'}
                                </Button>
                              )}
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td
                                colSpan={7}
                                className="px-6 py-4 bg-gray-50 dark:bg-gray-700"
                              >
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
                                          {investment.company_info.headquarters || 'N/A'}
                                        </p>
                                        <p>
                                          <strong>Website:</strong>
                                          <a
                                            href={
                                              investment.company_info.website || '#'
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-500 hover:underline ml-1"
                                          >
                                            {investment.company_info.website || 'N/A'}
                                          </a>
                                        </p>
                                        <p>
                                          <strong>Contract Term:</strong>{' '}
                                          {
                                            investment.company_info
                                              .contract_term || 'N/A'
                                          }
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
                                              className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-600 rounded-lg"
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
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                  {member.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                  {member.role}
                                                </p>
                                                {member.equity_percentage >
                                                  0 && (
                                                  <p className="text-xs text-green-600 dark:text-green-400">
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

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {portfolio.investments
            ?.slice(0, 3)
            .map((investment: EquityInvestment) => (
              <div
                key={investment.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invested{' '}
                  {formatCurrency(
                    parseNumber(investment.amount),
                    investment.currency || user?.currency,
                    investment.currency_symbol || user?.currency_symbol,
                  )}{' '}
                  in{' '}
                  {investment.campaign?.title ||
                    `Campaign ${investment.campaign_id}`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {format(new Date(investment.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EquityInvestments;
