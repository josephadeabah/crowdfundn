// app/account/investor-clubs/club-details/types/club-details-types.ts
import {
  Club,
  ClubInvestmentPortfolio,
  Member,
  Membership,
} from '../../clubTypes';

export interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  portfolio: ClubInvestmentPortfolio | null;
  members: Member[];
  onMembershipUpdate?: () => void;
}

export interface MembershipHookReturn {
  myMembership: Membership | null;
  loading: boolean;
  actionLoading: string | null;
  message: { type: 'success' | 'error'; text: string } | null;
  loadMyMembership: () => Promise<void>;
  handleJoinClub: () => Promise<void>;
  handleLeaveClub: () => Promise<void>;
  handleCancelRequest: () => Promise<void>;
  handleDeleteClub: () => Promise<void>;
  handleApproveMember: (memberId: string) => Promise<void>;
  handleRejectMember: (memberId: string, memberName: string) => Promise<void>;
  setMessage: (
    message: { type: 'success' | 'error'; text: string } | null,
  ) => void;
  setActionLoading: (loading: string | null) => void;
}

export interface TabComponentProps {
  club: Club;
  members: Member[];
  myMembership: Membership | null;
  loading: boolean;
  actionLoading: string | null;
  message: { type: 'success' | 'error'; text: string } | null;
  portfolio: ClubInvestmentPortfolio | null;
  onMembershipUpdate?: () => void;
  onFeatureClick: (featureName: string) => void;
  onTabChange?: (tab: 'about' | 'members' | 'actions') => void;
  onMakeContribution?: () => void;
  onProposeInvestment?: () => void;
  onJoinClub?: () => void;
  onLeaveClub?: () => void;
  onCancelRequest?: () => void;
  onDeleteClub?: () => void;
  onApproveMember?: (memberId: string) => void;
  onRejectMember?: (memberId: string, memberName: string) => void;
}

// Specific props for MembersTab
export interface MembersTabProps
  extends Omit<TabComponentProps, 'onFeatureClick'> {
  onJoinClub: () => void;
  onApproveMember: (memberId: string) => void;
  onRejectMember: (memberId: string, memberName: string) => void;
}

// Specific props for ActionsTab
export interface ActionsTabProps extends TabComponentProps {
  onJoinClub: () => void;
  onLeaveClub: () => void;
  onCancelRequest: () => void;
  onDeleteClub: () => void;
  onProposeInvestment?: () => void;
}
