import {
  Club,
  Member,
  ClubInvestment,
  ClubContribution,
  ShareChange,
} from '../clubTypes';

export interface DashboardState {
  clubs: Club[];
  selectedClub: Club | null;
  members: Member[];
  investments: ClubInvestment[];
  contributions: ClubContribution[];
  shareChanges: ShareChange[]; // Add this line
  portfolio: any;
  loading: boolean;
  mobileMenuOpen: boolean;
  token?: string;
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
  handleMakeContribution: () => void;
  handleProposeInvestment: () => void;
  handleViewAnalytics: () => void;
  handleClubCreated: () => void;
  loadClubDetails: (club: Club) => Promise<void>;
  refreshClubData: () => Promise<void>; // Add this new method
}
