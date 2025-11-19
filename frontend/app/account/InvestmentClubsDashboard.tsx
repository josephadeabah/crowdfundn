'use client';
import React, { useState, useEffect } from 'react';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useClubData } from './investor-clubs/hooks/useClubData';
import {
  investmentService,
  contributionService,
} from './investor-clubs/clubservice';
import CreateClubModal from './investor-clubs/CreateClubModal';
import { ContributionModal } from './investor-clubs/components/Contribution/ContributionModal';
import { LoadingState } from './investor-clubs/components/Loading/LoadingState';
import { MobileHeader } from './investor-clubs/components/ClubHeader/MobileHeader';
import { ClubHeader } from './investor-clubs/components/ClubHeader/ClubHeader';
import { ClubSummaryCard } from './investor-clubs/components/ClubSummary/ClubSummaryCard';
import { RecentInvestmentsSection } from './investor-clubs/components/Investments/RecentInvestmentsSection';
import { PortfolioSummary } from './investor-clubs/components/Sidebar/PortfolioSummary';
import { QuickActions } from './investor-clubs/components/Sidebar/QuickActions';
import { ClubStats } from './investor-clubs/components/Sidebar/ClubStats';
import { CreateClubCard } from './investor-clubs/components/Sidebar/CreateClubCard';
import ClubDetailsModal from './investor-clubs/club-details/ClubDetailsModal';
import { RecentContributionsSection } from './investor-clubs/components/Contribution/RecentContributionsSection';
import { useAuth } from '../context/auth/AuthContext';
import { ClubInvestment } from './investor-clubs/clubTypes';
import { ShareChangesSection } from './investor-clubs/components/ShareChanges/ShareChangesSection';
import TransferClubBalanceModal from './investor-clubs/components/Transfers/TransferClubBalanceModal';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';
import CreateClubInvestmentModal from './investor-clubs/components/CreateClubInvestmentModal';
import MemberInvestmentProposalModal from './investor-clubs/components/VotingPanel/MemberInvestmentProposalModal';
import ApprovedCampaigns from './investor-clubs/components/Sidebar/ApprovedCampaigns';

// FIXED: Enhanced formatCurrency function to handle null/undefined values
const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'USD',
): string => {
  // Handle null/undefined amount
  if (amount === null || amount === undefined) {
    return '$0.00';
  }

  // Convert string amount to number
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle NaN after conversion
  if (isNaN(numericAmount)) {
    return '$0.00';
  }

  // Handle null/undefined/empty currency
  const safeCurrency = currency || 'USD';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
    }).format(numericAmount);
  } catch (error) {
    console.warn(`Invalid currency code: ${safeCurrency}, using USD fallback`);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  }
};

// FIXED: Enhanced date formatting function
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? 'N/A'
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  } catch (error) {
    return 'N/A';
  }
};

// FIXED: Transform API investment data to match frontend expectations
const transformInvestmentData = (apiInvestment: any): ClubInvestment => {
  return {
    id: apiInvestment.id?.toString() || '',
    investment_amount: parseFloat(apiInvestment.proposed_amount) || 0,
    shares: apiInvestment.shares ? parseFloat(apiInvestment.shares) : undefined,
    percentage: apiInvestment.percentage
      ? parseFloat(apiInvestment.percentage)
      : undefined,
    status: apiInvestment.status || 'pending',
    certificate_url: apiInvestment.certificate_url || undefined,
    certificate_number: apiInvestment.certificate_number || undefined,
    investment_date: apiInvestment.investment_date || undefined,
    current_value: apiInvestment.current_value
      ? parseFloat(apiInvestment.current_value)
      : undefined,
    total_returns: apiInvestment.total_returns
      ? parseFloat(apiInvestment.total_returns)
      : undefined,
    roi: apiInvestment.roi ? parseFloat(apiInvestment.roi) : undefined,
    currency: 'USD', // Default currency since API returns null
    currency_symbol: '$', // Default symbol since API returns null
    campaign: {
      id: apiInvestment.campaign_id?.toString() || '',
      title: apiInvestment.company || 'Unknown Company',
      company_name: apiInvestment.company || 'Unknown Company',
      valuation: 0, // Not provided in API
      equity_offered: 0, // Not provided in API
      currency: 'USD',
      currency_symbol: '$',
      category: apiInvestment.sector || undefined,
      goal_amount: apiInvestment.proposed_amount
        ? parseFloat(apiInvestment.proposed_amount)
        : undefined,
      current_amount: apiInvestment.current_value
        ? parseFloat(apiInvestment.current_value)
        : undefined,
      company_info: {
        name: apiInvestment.company || 'Unknown Company',
      },
    },
    created_at: apiInvestment.investment_date || new Date().toISOString(),
    updated_at: apiInvestment.investment_date || new Date().toISOString(),
    is_equity_investment: apiInvestment.is_equity_investment || false,
    transaction_reference: undefined,
    equity_investment_id: apiInvestment.club_investment_id || undefined,
  };
};

const InvestmentClubsDashboard: React.FC = () => {
  const {
    clubs,
    selectedClub,
    members,
    investments,
    contributions,
    contributionsPagination,
    contributionsLoading,
    portfolio,
    approvedCampaigns,
    approvedCampaignsLoading,
    loading,
    mobileMenuOpen,
    token,
    loadUserClubs,
    loadClubDetails,
    setMobileMenuOpen,
    handleContributionPageChange,
    handleContributionPerPageChange,
    loadInvestments,
    loadPortfolio,
    refreshApprovedCampaigns,
  } = useClubData();

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isCreateInvestmentModalOpen, setIsCreateInvestmentModalOpen] =
    useState(false);
  const [isTransfersModalOpen, setIsTransfersModalOpen] = useState(false);
  const [isInvestmentProposalModalOpen, setIsInvestmentProposalModalOpen] =
    useState(false);
    const [error, setError] = useState<string | null>(null);

  // Alert states
  const [featureAlert, setFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [paymentAlert, setPaymentAlert] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [investmentAlert, setInvestmentAlert] = useState(false);
  const [investmentMessage, setInvestmentMessage] = useState('');
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  // FIXED: Transform investments when they change
  const [transformedInvestments, setTransformedInvestments] = useState<
    ClubInvestment[]
  >([]);

  useEffect(() => {
    if (investments && investments.length > 0) {
      const transformed = investments.map(transformInvestmentData);
      setTransformedInvestments(transformed);
    } else {
      setTransformedInvestments([]);
    }
  }, [investments]);

  // Auto-load previously selected club
  useEffect(() => {
    if (clubs.length > 0) {
      const savedSlug = localStorage.getItem('selectedClubSlug');
      const savedClub = clubs.find((c) => c.slug === savedSlug);
      if (savedClub) {
        loadClubDetails(savedClub);
      } else {
        loadClubDetails(clubs[0]);
      }
    }
  }, [clubs]);

  // Save current club selection
  useEffect(() => {
    if (selectedClub?.slug) {
      localStorage.setItem('selectedClubSlug', selectedClub.slug);
    }
  }, [selectedClub]);

  // Check for payment callback on component mount
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference');
      const trxref = urlParams.get('trxref');

      if ((reference || trxref) && selectedClub && token) {
        const paymentRef = (reference || trxref)!;

        try {
          const verificationResult =
            await contributionService.verifyContribution(
              token,
              selectedClub.slug,
              paymentRef,
            );

          if (verificationResult.success) {
            let successMessage =
              'Your contribution has been processed successfully!';

            if (verificationResult.membership) {
              const { total_contributed, contributed_share } =
                verificationResult.membership;
              successMessage += `\n\nYour total contributions: ${formatCurrency(total_contributed, selectedClub.currency)}\nYour club share: ${contributed_share}%`;
            }

            if (verificationResult.processed_by_webhook) {
              successMessage += '\n\n✅ Processed Successfully';
            } else if (verificationResult.already_processed) {
              successMessage += '\n\n✅ Payment was already processed';
            }

            setPaymentMessage(successMessage);
            setPaymentSuccess(true);
            setPaymentAlert(true);

            await loadClubDetails(selectedClub);
          } else {
            const errorMsg =
              verificationResult.paystack_error ||
              verificationResult.transaction_status ||
              'Payment verification failed';
            setPaymentMessage(`Payment verification failed: ${errorMsg}`);
            setPaymentSuccess(false);
            setPaymentAlert(true);
          }

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch (error) {
          console.error('Payment verification failed:', error);
          setPaymentMessage(
            'Payment verification failed. Please check your contributions list.',
          );
          setPaymentSuccess(false);
          setPaymentAlert(true);
        }
      }
    };

    checkPaymentStatus();
  }, [selectedClub, token, loadClubDetails]);

  useEffect(() => {
  const handleError = (error: ErrorEvent) => {
    console.error('Global error caught:', error);
    setError(error.message);
  };

  window.addEventListener('error', handleError);
  return () => window.removeEventListener('error', handleError);
}, []);

  // Add debugging for portfolio
  useEffect(() => {
    console.log('🔄 Portfolio Data:', {
      portfolio,
      hasPortfolio: !!portfolio,
      totalInvested: portfolio?.total_invested,
      returnPercentage: portfolio?.return_percentage,
      typeOfReturnPercentage: typeof portfolio?.return_percentage
    });
  }, [portfolio]);

  const handleContributionSuccess = async () => {
    if (selectedClub) {
      await loadClubDetails(selectedClub);
    }
  };

  const handleTransferFunds = () => {
    setIsTransfersModalOpen(true);
  };

  const handleTransferSuccess = async () => {
    if (selectedClub) {
      await loadClubDetails(selectedClub);
    }
  };

  const handleProposeInvestment = () => {
    setIsInvestmentProposalModalOpen(true);
  };

  const handleCreateInvestment = () => {
    setIsCreateInvestmentModalOpen(true);
  };

  const handleViewAnalytics = () => {
    setFeatureMessage(
      'View Analytics feature would open here. This would show detailed performance metrics and investment analytics for the club.',
    );
    setFeatureAlert(true);
  };

  const handleClubCreated = () => {
    loadUserClubs();
  };

  const handleMakeContribution = () => {
    setIsContributionModalOpen(true);
  };

  // Investment action handlers
  const handleViewInvestment = (investment: ClubInvestment) => {
    setFeatureMessage(
      `Viewing investment details for: ${investment.campaign.title}\nAmount: ${formatCurrency(investment.investment_amount, investment.currency_symbol)}\nStatus: ${investment.status}`,
    );
    setFeatureAlert(true);
  };

  // Handle executing pending investments
  const handleExecuteInvestment = async (investmentId: string) => {
    if (!selectedClub || !token) return;

    try {
      const result = await investmentService.executeInvestment(
        token,
        selectedClub.slug,
        investmentId,
      );

      if (result.success && result.authorization_url) {
        // Redirect to payment page
        window.location.href = result.authorization_url;
      } else if (result.success) {
        setInvestmentMessage('Investment executed successfully!');
        setInvestmentSuccess(true);
        setInvestmentAlert(true);
        await loadInvestments(selectedClub.slug);
        await loadPortfolio(selectedClub.slug);
      } else {
        setInvestmentMessage(result.error || 'Failed to execute investment');
        setInvestmentSuccess(false);
        setInvestmentAlert(true);
      }
    } catch (error: any) {
      setInvestmentMessage(error.message || 'Failed to execute investment');
      setInvestmentSuccess(false);
      setInvestmentAlert(true);
    }
  };

  const handleDownloadCertificate = async (investment: ClubInvestment) => {
    if (!selectedClub || !token) return;

    try {
      await investmentService.downloadCertificate(
        token,
        selectedClub.slug,
        investment.id,
      );
      setInvestmentMessage('Certificate downloaded successfully!');
      setInvestmentSuccess(true);
      setInvestmentAlert(true);
    } catch (error: any) {
      setInvestmentMessage(error.message || 'Failed to download certificate');
      setInvestmentSuccess(false);
      setInvestmentAlert(true);
    }
  };

  const handleInvestmentCreated = async () => {
    if (selectedClub) {
      await loadInvestments(selectedClub.id);
      await loadPortfolio(selectedClub.id);
      await refreshApprovedCampaigns();
      setIsCreateInvestmentModalOpen(false);
    }
  };

  const getCurrentUserShare = () => {
    if (!selectedClub || !user || !members.length) return undefined;
    const currentUserMembership = members.find((member) => {
      const memberUserId = Number(member.user.id);
      const currentUserId = Number(user.id);
      return memberUserId === currentUserId;
    });
    return currentUserMembership?.contributed_share;
  };

  const currentUserShare = getCurrentUserShare();

  if (loading) {
    return <LoadingState />;
  }

  // Show error message if there's an error
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Page</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

  if (clubs.length === 0) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <main className="flex-1 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-sm p-6 md:p-12">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-3xl">👥</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                No Investment Clubs Yet
              </h2>
              <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                Create an investment club to start collaborating with other
                investors and make collective investment decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm md:text-base"
                >
                  Create Your First Club
                </button>
              </div>
            </div>
          </div>
        </main>

        <CreateClubModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onClubCreated={handleClubCreated}
        />
      </div>
    );
  }

  const currentClub = selectedClub || clubs[0];
  const isAdmin = currentClub?.is_admin;

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <main className="flex-1 p-4">
        <MobileHeader
          clubs={clubs}
          currentClub={currentClub}
          mobileMenuOpen={mobileMenuOpen}
          onClubChange={loadClubDetails}
          onOpenClubDetails={() => setIsModalOpen(true)}
          onCreateClub={() => setIsCreateModalOpen(true)}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="max-w-7xl mx-auto">
          <ClubHeader
            clubs={clubs}
            currentClub={currentClub}
            onClubChange={loadClubDetails}
            onOpenClubDetails={() => setIsModalOpen(true)}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Left Column - Club Info and Members */}
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              <ClubSummaryCard
                club={currentClub}
                formatCurrency={formatCurrency}
              />

              <ApprovedCampaigns
                club={currentClub}
                approvedCampaigns={approvedCampaigns}
                loading={approvedCampaignsLoading}
                onRefresh={refreshApprovedCampaigns}
              />

              <ShareChangesSection
                club={currentClub}
                formatCurrency={formatCurrency}
                currentUserShare={currentUserShare}
              />

              <RecentContributionsSection
                contributions={contributions}
                pagination={contributionsPagination}
                loading={contributionsLoading}
                formatCurrency={formatCurrency}
                onPageChange={handleContributionPageChange}
                onPerPageChange={handleContributionPerPageChange}
              />

              {/* FIXED: Use transformed investments with proper data */}
              <RecentInvestmentsSection
                investments={transformedInvestments}
                formatCurrency={formatCurrency}
                onViewInvestment={handleViewInvestment}
                onExecuteInvestment={handleExecuteInvestment}
                onDownloadCertificate={handleDownloadCertificate}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:space-y-6">
              <PortfolioSummary
                portfolio={portfolio}
                formatCurrency={formatCurrency}
              />

              <QuickActions
                onMakeContribution={handleMakeContribution}
                onProposeInvestment={handleProposeInvestment}
                onViewAnalytics={handleViewAnalytics}
                onTransferFunds={handleTransferFunds}
                onCreateInvestment={handleCreateInvestment}
                isAdmin={isAdmin}
              />

              <ClubStats
                club={currentClub}
                investmentsCount={transformedInvestments.length}
                formatCurrency={formatCurrency}
              />

              <CreateClubCard onCreateClub={() => setIsCreateModalOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {currentClub && (
        <>
          <ClubDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            club={currentClub}
            members={members}
          />

          <ContributionModal
            isOpen={isContributionModalOpen}
            onClose={() => setIsContributionModalOpen(false)}
            onContributionSuccess={handleContributionSuccess}
            club={currentClub}
            token={token}
            formatCurrency={formatCurrency}
            showSuccess={true}
          />

          <CreateClubInvestmentModal
            isOpen={isCreateInvestmentModalOpen}
            onClose={() => setIsCreateInvestmentModalOpen(false)}
            club={currentClub}
            approvedCampaigns={approvedCampaigns}
            token={token}
            onSuccess={handleInvestmentCreated}
          />

          <MemberInvestmentProposalModal
            isOpen={isInvestmentProposalModalOpen}
            onClose={() => setIsInvestmentProposalModalOpen(false)}
            club={currentClub}
          />

          <TransferClubBalanceModal
            isOpen={isTransfersModalOpen}
            onClose={() => setIsTransfersModalOpen(false)}
            club={currentClub}
            formatCurrency={formatCurrency}
            onTransferSuccess={handleTransferSuccess}
          />
        </>
      )}

      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClubCreated={handleClubCreated}
      />

      {/* Alerts */}
      <AlertPopup
        title={paymentSuccess ? 'Payment Successful' : 'Payment Failed'}
        message={paymentMessage}
        isOpen={paymentAlert}
        setIsOpen={setPaymentAlert}
        onConfirm={() => setPaymentAlert(false)}
        confirmText="Got it"
        icon={
          paymentSuccess ? (
            <FaCheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <FaExclamationTriangle className="w-6 h-6 text-red-600" />
          )
        }
        confirmButtonClass={
          paymentSuccess
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        }
      />

      <AlertPopup
        title={investmentSuccess ? 'Investment Success' : 'Investment Action'}
        message={investmentMessage}
        isOpen={investmentAlert}
        setIsOpen={setInvestmentAlert}
        onConfirm={() => setInvestmentAlert(false)}
        confirmText="Got it"
        icon={
          investmentSuccess ? (
            <FaCheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <FaInfoCircle className="w-6 h-6 text-blue-600" />
          )
        }
        confirmButtonClass={
          investmentSuccess
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
      />

      <AlertPopup
        title="Feature Coming Soon"
        message={featureMessage}
        isOpen={featureAlert}
        setIsOpen={setFeatureAlert}
        onConfirm={() => setFeatureAlert(false)}
        confirmText="Got it"
        icon={<FaInfoCircle className="w-6 h-6 text-blue-600" />}
        confirmButtonClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      />
    </div>
  );
};

export default InvestmentClubsDashboard;
