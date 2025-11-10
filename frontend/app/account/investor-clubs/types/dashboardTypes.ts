import { Club, Member, ClubInvestment } from '../clubTypes';
import { AIRecommendation } from '../aiRecommendationService';

export interface DashboardState {
  clubs: Club[];
  selectedClub: Club | null;
  members: Member[];
  investments: ClubInvestment[];
  portfolio: any;
  loading: boolean;
  mobileMenuOpen: boolean;
  token?: string;
}

export interface AIRecommendationsState {
  recommendations: AIRecommendation[];
  showAIRecommendations: boolean;
  loading: boolean; // This should be 'loading' not 'recommendationsLoading'
  clubRiskProfile: any;
}

export interface AlertState {
  featureAlert: boolean;
  featureMessage: string;
  voteErrorAlert: boolean;
  voteErrorMessage: string;
  explanationAlert: boolean;
  explanationMessage: string;
}

export interface ClubActions {
  handleVote: (investmentId: string, voteType: string) => Promise<void>;
  handleGetAIRecommendations: () => Promise<void>;
  handleProposeInvestmentWithCampaign: (campaign: any) => void;
  handleExplainRecommendation: (
    campaignId: string,
    campaignTitle: string,
  ) => Promise<void>;
  handleMakeContribution: () => void;
  handleProposeInvestment: () => void;
  handleViewAnalytics: () => void;
  handleClubCreated: () => void;
  loadClubDetails: (club: Club) => Promise<void>;
  refreshClubData: () => Promise<void>; // Add this new method
}
