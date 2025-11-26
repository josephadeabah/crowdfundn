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
import {
  Club,
  ClubInvestment,
  ClubInvestmentPortfolio,
} from './investor-clubs/clubTypes';
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
import { InvestmentDetailsModal } from './investor-clubs/components/Investments/InvestmentDetailsModal';
import { AnalyticsModal } from './investor-clubs/components/Analytics/AnalyticsModal';
import { useKYCStatus } from '@/app/hooks/useKYCStatus';
import { useRouter } from 'next/navigation';

// Enhanced formatCurrency function to handle null/undefined values and string numbers
const formatCurrency = (
  amount: number | string | null | undefined,
  currency: string = 'USD',
  currencySymbol: string = '$',
): string => {
  // Handle null/undefined amount
  if (amount === null || amount === undefined) {
    return `${currencySymbol}0.00`;
  }

  // Convert string amount to number
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle NaN after conversion
  if (isNaN(numericAmount)) {
    return `${currencySymbol}0.00`;
  }

  // Handle null/undefined/empty currency
  const safeCurrency = currency || 'USD';
  const safeSymbol = currencySymbol || '$';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: safeCurrency,
    }).format(numericAmount);
  } catch (error) {
    console.warn(
      `Invalid currency code: ${safeCurrency}, using symbol fallback`,
    );
    return `${safeSymbol}${numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};

// Enhanced date formatting function
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

// Default empty portfolio
const defaultPortfolio: ClubInvestmentPortfolio = {
  total_invested: 0,
  total_value: 0,
  total_return: 0,
  return_percentage: 0,
  active_investments: 0,
  investments: [],
  campaigns_invested: 0,
  successful_count: 0,
};

// NEW: Global payment verification hook - Single Source of Truth
const useGlobalPaymentVerification = (
  token: string | null,
  loadClubDetails: (club: Club) => Promise<void>,
) => {
  const [paymentAlert, setPaymentAlert] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  // Check if we're on the correct route for payment verification
  const isOnVerificationRoute = () => {
    if (typeof window === 'undefined') return false;
    return window.location.hash === '#Your%20Clubs';
  };

  // Redirect to the verification route
  const redirectToVerificationRoute = (paymentRef: string) => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const verificationUrl = `${currentPath}?reference=${paymentRef}#Your%20Clubs`;

    console.log('Redirecting to verification route:', verificationUrl);
    window.location.href = verificationUrl;
  };

  const verifyPayment = async (club: Club, paymentRef: string) => {
    if (!token) return false;

    try {
      const verificationResult = await contributionService.verifyContribution(
        token,
        club.slug,
        paymentRef,
      );

      if (verificationResult.success) {
        let successMessage =
          'Your contribution has been processed successfully!';

        if (verificationResult.membership) {
          const { total_contributed, contributed_share } =
            verificationResult.membership;
          successMessage += `\n\nYour total contributions: ${formatCurrency(total_contributed, club.currency)}\nYour club share: ${contributed_share}%`;
        }

        if (verificationResult.processed_by_webhook) {
          successMessage += '\n\n✅ Processed Successfully';
        } else if (verificationResult.already_processed) {
          successMessage += '\n\n✅ Payment was already processed';
        }

        setPaymentMessage(successMessage);
        setPaymentSuccess(true);
        setPaymentAlert(true);

        await loadClubDetails(club);
        return true;
      } else {
        const errorMsg =
          verificationResult.paystack_error ||
          verificationResult.transaction_status ||
          'Payment verification failed';
        setPaymentMessage(`Payment verification failed: ${errorMsg}`);
        setPaymentSuccess(false);
        setPaymentAlert(true);
        return false;
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setPaymentMessage(
        'Payment verification failed. Please check your contributions list.',
      );
      setPaymentSuccess(false);
      setPaymentAlert(true);
      return false;
    }
  };

  return {
    paymentAlert,
    paymentMessage,
    paymentSuccess,
    setPaymentAlert,
    verifyPayment,
    isOnVerificationRoute,
    redirectToVerificationRoute,
  };
};

const InvestmentClubsDashboard: React.FC = () => {
  const {
    clubs,
    selectedClub,
    members,
    investments,
    investmentsPagination,
    investmentsLoading,
    contributions,
    contributionsPagination,
    contributionsLoading,
    portfolio,
    approvedCampaigns,
    approvedCampaignsLoading,
    loading,
    mobileMenuOpen,
    initialLoadComplete,
    token,
    loadUserClubs,
    loadClubDetails,
    setMobileMenuOpen,
    handleContributionPageChange,
    handleContributionPerPageChange,
    loadInvestments,
    loadPortfolio,
    refreshApprovedCampaigns,
    handleInvestmentPageChange,
    handleInvestmentPerPageChange,
  } = useClubData();

  const { user } = useAuth();
  const { kycStatus, loading: kycLoading } = useKYCStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isCreateInvestmentModalOpen, setIsCreateInvestmentModalOpen] =
    useState(false);
  const [isTransfersModalOpen, setIsTransfersModalOpen] = useState(false);
  const [isInvestmentProposalModalOpen, setIsInvestmentProposalModalOpen] =
    useState(false);
  const [isInvestmentDetailsModalOpen, setIsInvestmentDetailsModalOpen] =
    useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<ClubInvestment | null>(null);

  // Alert states
  const [featureAlert, setFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [investmentAlert, setInvestmentAlert] = useState(false);
  const [investmentMessage, setInvestmentMessage] = useState('');
  const [investmentSuccess, setInvestmentSuccess] = useState(false);
  const [kycAlert, setKycAlert] = useState(false);
  const [kycMessage, setKycMessage] = useState('');

  // NEW: Use the global payment verification hook - Single Source of Truth
  const {
    paymentAlert,
    paymentMessage,
    paymentSuccess,
    setPaymentAlert,
    verifyPayment,
    isOnVerificationRoute,
    redirectToVerificationRoute,
  } = useGlobalPaymentVerification(token, loadClubDetails);

  // Use portfolio data directly with proper fallback
  const portfolioData = portfolio || defaultPortfolio;

  // NEW: Get saved club slug for immediate display
  const getSavedClubSlug = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedClubSlug');
    }
    return null;
  };

  // NEW: Enhanced club selection logic
  const getCurrentClub = (): Club | null => {
    // If we have a selected club, use it
    if (selectedClub) return selectedClub;

    // If clubs are loaded but no selected club yet, try to find the saved one
    if (clubs.length > 0 && initialLoadComplete) {
      const savedSlug = getSavedClubSlug();
      const savedClub = clubs.find((c) => c.slug === savedSlug);
      return savedClub || clubs[0];
    }

    return null;
  };

  const currentClub = getCurrentClub();

  // NEW: Global Payment Verification - Single Source of Truth
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference');
      const trxref = urlParams.get('trxref');
      const paymentRef = reference || trxref;

      if (!paymentRef || !token) return;

      // If we're not on the verification route, redirect to it
      if (!isOnVerificationRoute()) {
        console.log('Not on verification route, redirecting...');
        redirectToVerificationRoute(paymentRef);
        return;
      }

      // We're on the correct route, proceed with verification
      console.log('On verification route, processing payment...');

      // Try to get club from localStorage first
      const savedClubSlug = localStorage.getItem('selectedClubSlug');
      let clubToUse = currentClub;

      // If we don't have a current club but have a saved slug, try to find the club
      if (!clubToUse && savedClubSlug && clubs.length > 0) {
        clubToUse = clubs.find((c) => c.slug === savedClubSlug) || clubs[0];
      }

      if (!clubToUse) {
        console.warn('No club available for payment verification');
        return;
      }

      console.log('Processing payment verification for club:', clubToUse.name);

      const success = await verifyPayment(clubToUse, paymentRef);

      if (success) {
        // Clear URL parameters after successful verification but keep the hash
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.hash,
        );
      }
    };

    checkPaymentStatus();
  }, [
    token,
    currentClub,
    clubs,
    verifyPayment,
    isOnVerificationRoute,
    redirectToVerificationRoute,
  ]);

  const handleContributionSuccess = async () => {
    if (currentClub) {
      await loadClubDetails(currentClub);
    }
  };

  const handleTransferFunds = () => {
    setIsTransfersModalOpen(true);
  };

  const handleTransferSuccess = async () => {
    if (currentClub) {
      await loadClubDetails(currentClub);
    }
  };

  const handleProposeInvestment = () => {
    setIsInvestmentProposalModalOpen(true);
  };

  // UPDATED: Handle create investment with validation checks
  const handleCreateInvestment = () => {
    if (!kycStatus?.verified) {
      setInvestmentMessage(
        'Please complete KYC verification before making investments',
      );
      setInvestmentSuccess(false);
      setInvestmentAlert(true);
      return;
    }

    setIsCreateInvestmentModalOpen(true);
  };

  // NEW: Handle create club with KYC check
  const handleCreateClub = () => {
    if (!kycStatus?.verified) {
      setKycMessage(
        'You must complete KYC verification before creating investment clubs',
      );
      setKycAlert(true);
      return;
    }

    setIsCreateModalOpen(true);
  };

  const handleViewAnalytics = () => {
    setIsAnalyticsModalOpen(true);
  };

  const handleClubCreated = () => {
    loadUserClubs();
  };

  const handleMakeContribution = () => {
    setIsContributionModalOpen(true);
  };

  // Investment action handlers
  const handleViewInvestment = (investment: ClubInvestment) => {
    setSelectedInvestment(investment);
    setIsInvestmentDetailsModalOpen(true);
  };

  // Handle cancelling investments
  const handleCancelInvestment = async (
    investmentId: string,
    reason?: string,
  ) => {
    if (!currentClub || !token) return;

    try {
      const result = await investmentService.cancelInvestment(
        token,
        currentClub.slug,
        investmentId,
        { reason },
      );

      if (result.success) {
        setInvestmentMessage(
          'Investment cancelled successfully! Amount refunded to club balance.',
        );
        setInvestmentSuccess(true);
        setInvestmentAlert(true);

        // Refresh investments and portfolio
        await loadInvestments(currentClub.slug);
        await loadPortfolio(currentClub.slug);
        await loadClubDetails(currentClub); // Refresh club balance
      } else {
        setInvestmentMessage(result.error || 'Failed to cancel investment');
        setInvestmentSuccess(false);
        setInvestmentAlert(true);
      }
    } catch (error: any) {
      setInvestmentMessage(error.message || 'Failed to cancel investment');
      setInvestmentSuccess(false);
      setInvestmentAlert(true);
    }
  };

  const handleDownloadCertificate = async (investment: ClubInvestment) => {
    if (!currentClub || !token) return;

    try {
      await investmentService.downloadCertificate(
        token,
        currentClub.slug,
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
    if (currentClub) {
      await loadInvestments(currentClub.slug);
      await loadPortfolio(currentClub.slug);
      await refreshApprovedCampaigns();
      setIsCreateInvestmentModalOpen(false);
    }
  };

  // FIXED: Enhanced current user share calculation
  const getCurrentUserShare = () => {
    if (!currentClub || !user || !members.length) return undefined;

    // Ensure we're comparing numbers by converting to Number
    const currentUserId = Number(user.id);

    // Find the current user's membership
    const currentUserMembership = members.find((member) => {
      const memberUserId = Number(member.user.id);
      return memberUserId === currentUserId;
    });

    if (currentUserMembership) {
      const share = currentUserMembership.contributed_share;
      // Validate the share value
      if (share === null || share === undefined || isNaN(Number(share))) {
        console.warn('Invalid share value for current user:', share);
        return 0;
      }
      return Number(share);
    }

    return 0; // Default to 0 if no membership found
  };

  const currentUserShare = getCurrentUserShare();

  // FIXED: Add share validation and debugging
  useEffect(() => {
    if (currentClub && members.length > 0 && currentUserShare !== undefined) {
      console.log('Share Debug Info:', {
        club: currentClub.name,
        totalContributions: currentClub.financials?.total_contributions,
        currentUserShare,
        allMembers: members.map((m) => ({
          name: m.user.full_name,
          contributed: m.total_contributed,
          share: m.contributed_share,
        })),
      });
    }
  }, [currentClub, members, currentUserShare]);

  if (loading) {
    return <LoadingState />;
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
                {kycStatus?.verified
                  ? 'Create an investment club to start collaborating with other investors and make collective investment decisions.'
                  : 'Complete your KYC verification to create investment clubs and start collaborating with other investors.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCreateClub}
                  disabled={!kycStatus?.verified}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {kycStatus?.verified
                    ? 'Create Your First Club'
                    : 'KYC Verification Required'}
                </button>
                {!kycStatus?.verified && (
                  <button
                    onClick={() => {
                      setKycMessage(
                        'Please complete your KYC verification in your account settings to create investment clubs.',
                      );
                      setKycAlert(true);
                    }}
                    className="px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 border border-gray-100 font-medium text-sm md:text-base"
                  >
                    Learn About KYC
                  </button>
                )}
              </div>

              {/* KYC Notice */}
              {!kycStatus?.verified && !kycLoading && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>KYC verification required:</strong> You must
                    complete identity verification before creating investment
                    clubs. This helps ensure a secure investment environment for
                    all members.
                  </p>
                </div>
              )}
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

  const isAdmin = currentClub?.is_admin;

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <main className="flex-1 p-4">
        <MobileHeader
          clubs={clubs}
          currentClub={currentClub || clubs[0]}
          mobileMenuOpen={mobileMenuOpen}
          onClubChange={loadClubDetails}
          onOpenClubDetails={() => setIsModalOpen(true)}
          onCreateClub={handleCreateClub}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="max-w-7xl mx-auto">
          <ClubHeader
            clubs={clubs}
            currentClub={currentClub || clubs[0]}
            onClubChange={loadClubDetails}
            onOpenClubDetails={() => setIsModalOpen(true)}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Left Column - Club Info and Members */}
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              <ClubSummaryCard
                club={currentClub || clubs[0]}
                formatCurrency={formatCurrency}
              />

              <ApprovedCampaigns
                club={currentClub || clubs[0]}
                approvedCampaigns={approvedCampaigns}
                loading={approvedCampaignsLoading}
                onRefresh={refreshApprovedCampaigns}
              />

              <ShareChangesSection
                club={currentClub || clubs[0]}
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

              <RecentInvestmentsSection
                investments={investments}
                formatCurrency={formatCurrency}
                onViewInvestment={handleViewInvestment}
                onCancelInvestment={handleCancelInvestment}
                onDownloadCertificate={handleDownloadCertificate}
                currentPage={investmentsPagination?.current_page || 1}
                totalPages={investmentsPagination?.total_pages || 1}
                totalCount={
                  investmentsPagination?.total_count || investments.length
                }
                perPage={investmentsPagination?.per_page || 5}
                onPageChange={handleInvestmentPageChange}
                onPerPageChange={handleInvestmentPerPageChange}
                showPagination={true}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:space-y-6">
              <PortfolioSummary
                portfolio={portfolioData}
                formatCurrency={formatCurrency}
                clubCurrency={currentClub?.currency}
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
                club={currentClub || clubs[0]}
                investmentsCount={investments.length}
                portfolio={portfolioData}
                formatCurrency={formatCurrency}
              />

              <CreateClubCard onCreateClub={handleCreateClub} />
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
            portfolio={portfolioData}
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

          <InvestmentDetailsModal
            isOpen={isInvestmentDetailsModalOpen}
            onClose={() => {
              setIsInvestmentDetailsModalOpen(false);
              setSelectedInvestment(null);
            }}
            investment={selectedInvestment}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onCancelInvestment={handleCancelInvestment}
            onDownloadCertificate={handleDownloadCertificate}
          />

          <AnalyticsModal
            isOpen={isAnalyticsModalOpen}
            onClose={() => setIsAnalyticsModalOpen(false)}
            club={currentClub}
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
            <FaInfoCircle className="w-6 h-6 text-blue-400" />
          )
        }
        confirmButtonClass={
          investmentSuccess
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-blue-300 hover:bg-blue-400 focus:ring-blue-500'
        }
      />

      <AlertPopup
        title="KYC Verification Required"
        message={kycMessage}
        isOpen={kycAlert}
        setIsOpen={setKycAlert}
        onConfirm={() => setKycAlert(false)}
        confirmText="Got it"
        icon={<FaInfoCircle className="w-6 h-6 text-yellow-600" />}
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
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
