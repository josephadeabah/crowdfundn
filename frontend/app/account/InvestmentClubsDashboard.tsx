// app/account/investor-clubs/page.tsx
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
import { AIRecommendationsSection } from './investor-clubs/components/AIRecommendations/AIRecommendationsSection';
import { ClubSummaryCard } from './investor-clubs/components/ClubSummary/ClubSummaryCard';
import { ActiveVotesSection } from './investor-clubs/components/Investments/ActiveVotesSection';
import { RecentInvestmentsSection } from './investor-clubs/components/Investments/RecentInvestmentsSection';
import { PortfolioSummary } from './investor-clubs/components/Sidebar/PortfolioSummary';
import { QuickActions } from './investor-clubs/components/Sidebar/QuickActions';
import { ClubStats } from './investor-clubs/components/Sidebar/ClubStats';
import { CreateClubCard } from './investor-clubs/components/Sidebar/CreateClubCard';
import ClubDetailsModal from './investor-clubs/club-details/ClubDetailsModal';
import { useAIRecommendations } from './investor-clubs/hooks/useAIRecommendations';
import { aiRecommendationService } from './investor-clubs/aiRecommendationService';
import { RecentContributionsSection } from './investor-clubs/components/Contribution/RecentContributionsSection';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from 'react-icons/fa';

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
    loading,
    mobileMenuOpen,
    token,
    loadUserClubs,
    loadClubDetails,
    setMobileMenuOpen,
    handleContributionPageChange,
    handleContributionPerPageChange,
  } = useClubData();

  const {
    recommendations,
    showAIRecommendations,
    loading: recommendationsLoading,
    clubRiskProfile,
    loadAIRecommendations,
    setShowAIRecommendations,
  } = useAIRecommendations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);

  // Separate alert states for different types of messages
  const [featureAlert, setFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [paymentAlert, setPaymentAlert] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [voteErrorAlert, setVoteErrorAlert] = useState(false);
  const [voteErrorMessage, setVoteErrorMessage] = useState('');
  const [explanationAlert, setExplanationAlert] = useState(false);
  const [explanationMessage, setExplanationMessage] = useState('');

  // Check for payment callback on component mount - FIXED
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference');
      const trxref = urlParams.get('trxref');

      // Only run if we have payment reference parameters
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
            await loadClubDetails(selectedClub);
            setPaymentMessage(
              'Your contribution has been processed successfully!',
            );
            setPaymentSuccess(true);
            setPaymentAlert(true);
          } else {
            const errorMsg =
              verificationResult.paystack_error ||
              verificationResult.transaction_status ||
              'Payment verification failed';
            setPaymentMessage(`Payment verification failed: ${errorMsg}`);
            setPaymentSuccess(false);
            setPaymentAlert(true);
          }

          // Clear URL parameters after processing
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch (error) {
          console.error('Payment verification failed:', error);
          setPaymentMessage(
            'Payment verification failed. Please contact support if the issue persists.',
          );
          setPaymentSuccess(false);
          setPaymentAlert(true);
        }
      }
    };

    checkPaymentStatus();
  }, [selectedClub, token, loadClubDetails]);

  const handleVote = async (investmentId: string, voteType: string) => {
    if (!selectedClub || !token) return;

    try {
      await investmentService.voteOnInvestment(
        token,
        selectedClub.slug,
        investmentId,
        voteType,
      );
      await loadClubDetails(selectedClub);
    } catch (error: any) {
      console.error('Failed to vote:', error);
      setVoteErrorMessage(error.message || 'Failed to vote. Please try again.');
      setVoteErrorAlert(true);
    }
  };

  const handleGetAIRecommendations = async () => {
    if (!selectedClub) return;
    setShowAIRecommendations(true);
    await loadAIRecommendations(selectedClub.slug);
  };

  const handleProposeInvestmentWithCampaign = (campaign: any) => {
    setFeatureMessage(
      `Propose investment for: ${campaign.title}\n\nAmount: ${formatCurrency(campaign.goal_amount, campaign.currency || selectedClub?.currency)}\n\nThis would open the investment proposal form with this campaign pre-selected.`,
    );
    setFeatureAlert(true);
  };

  const handleProposeInvestment = () => {
    setFeatureMessage(
      'Propose Investment feature would open here. This would allow you to suggest new investment opportunities for the club to consider.',
    );
    setFeatureAlert(true);
  };

  const handleViewAnalytics = () => {
    setFeatureMessage(
      'View Analytics feature would open here. This would show detailed performance metrics and investment analytics for the club.',
    );
    setFeatureAlert(true);
  };

  const handleExplainRecommendation = async (
    campaignId: string,
    campaignTitle: string,
  ) => {
    if (!selectedClub || !token) return;

    try {
      setExplanationMessage(
        `🔄 Generating AI analysis for "${campaignTitle}"...\n\nThis may take 30-60 seconds for detailed analysis.`,
      );
      setExplanationAlert(true);

      const response = await aiRecommendationService.getExplanation(
        token,
        selectedClub.slug,
        campaignId,
        90000,
      );

      if (response.success) {
        const explanationText = aiRecommendationService.extractExplanationText(
          response.explanation,
        );

        if (
          explanationText &&
          explanationText !== 'No explanation available.'
        ) {
          setExplanationMessage(explanationText);
        } else if (response.fallback_explanation) {
          setExplanationMessage(response.fallback_explanation);
        } else {
          setExplanationMessage(
            'Analysis complete. This campaign shows potential based on your club profile and risk tolerance.',
          );
        }
      } else {
        setExplanationMessage(
          response.fallback_explanation ||
            response.error ||
            'Analysis completed with limited details. Consider reviewing the campaign manually.',
        );
      }
    } catch (error: any) {
      console.error('Failed to get explanation:', error);
      setExplanationMessage(
        error.message ||
          'The analysis is taking longer than expected. Please try again or review the campaign details manually.',
      );
    } finally {
      setExplanationAlert(true);
    }
  };

  const handleClubCreated = () => {
    loadUserClubs();
  };

  const handleMakeContribution = () => {
    setIsContributionModalOpen(true);
  };

  const handleContributionSuccess = async () => {
    if (selectedClub) {
      await loadClubDetails(selectedClub);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

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
  const activeVotes = investments.filter((inv) => inv.status === 'voting');

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
              <AIRecommendationsSection
                showAIRecommendations={showAIRecommendations}
                recommendations={recommendations}
                loading={recommendationsLoading}
                clubRiskProfile={clubRiskProfile}
                currentClub={currentClub}
                formatCurrency={formatCurrency}
                onClose={() => setShowAIRecommendations(false)}
                onProposeInvestment={handleProposeInvestmentWithCampaign}
                onExplainRecommendation={handleExplainRecommendation}
              />

              <ClubSummaryCard
                club={currentClub}
                formatCurrency={formatCurrency}
              />

              {/* Add Recent Contributions Section */}
              <RecentContributionsSection
                contributions={contributions}
                pagination={contributionsPagination}
                loading={contributionsLoading}
                formatCurrency={formatCurrency}
                onPageChange={handleContributionPageChange}
                onPerPageChange={handleContributionPerPageChange}
              />

              <ActiveVotesSection
                activeVotes={activeVotes}
                onVote={handleVote}
                formatCurrency={formatCurrency}
              />

              <RecentInvestmentsSection
                investments={investments}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* Right Column - Stats and Quick Actions */}
            <div className="space-y-4 lg:space-y-6">
              <PortfolioSummary
                portfolio={portfolio}
                formatCurrency={formatCurrency}
              />

              <QuickActions
                showAIRecommendations={showAIRecommendations}
                onGetAIRecommendations={handleGetAIRecommendations}
                onMakeContribution={handleMakeContribution}
                onProposeInvestment={handleProposeInvestment}
                onViewAnalytics={handleViewAnalytics}
              />

              <ClubStats
                club={currentClub}
                investmentsCount={investments.length}
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
          />
        </>
      )}

      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onClubCreated={handleClubCreated}
      />

      {/* Alert Popups */}
      {/* Payment Success/Failure Alert */}
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

      {/* Feature Coming Soon Alert */}
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

      {/* Vote Failed Alert */}
      <AlertPopup
        title="Vote Failed"
        message={voteErrorMessage}
        isOpen={voteErrorAlert}
        setIsOpen={setVoteErrorAlert}
        onConfirm={() => setVoteErrorAlert(false)}
        confirmText="OK"
        icon={<FaExclamationTriangle className="w-6 h-6 text-red-600" />}
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />

      {/* AI Explanation Alert */}
      <AlertPopup
        title="AI Recommendation Explanation"
        message={explanationMessage}
        isOpen={explanationAlert}
        setIsOpen={setExplanationAlert}
        onConfirm={() => setExplanationAlert(false)}
        confirmText="Understood"
        icon={<FaInfoCircle className="w-6 h-6 text-orange-600" />}
        confirmButtonClass="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
      />
    </div>
  );
};

export default InvestmentClubsDashboard;
