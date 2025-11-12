// app/account/investor-clubs/club-details/hooks/useClubMembership.ts
import { useState, useEffect } from 'react';
import { Club, Member, Membership } from '../../clubTypes';
import { clubService, membershipService } from '../../clubservice';
import { useAuth } from '@/app/context/auth/AuthContext';
import { MembershipHookReturn } from '../types/club-details-types';

export const useClubMembership = (
  club: Club,
  members: Member[],
  isOpen: boolean,
  onMembershipUpdate?: () => void,
): MembershipHookReturn => {
  const { token, user } = useAuth();
  const [myMembership, setMyMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && token) {
      loadMyMembership();
    }
  }, [isOpen, token, club.slug]);

  const loadMyMembership = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await clubService.getMyMembershipStatus(
        token,
        club.slug,
      );

      if (response.success && response.membership) {
        setMyMembership(response.membership);
      } else if (response.is_member) {
        try {
          const fullResponse = await membershipService.getMyMembership(
            token,
            club.slug,
          );
          if (fullResponse.membership) {
            setMyMembership(fullResponse.membership);
          }
        } catch (error) {
          const fallbackUser = user
            ? {
                id: (user as any).id,
                full_name: (user as any).full_name,
                email: (user as any).email ?? '',
                avatar_url: (user as any).avatar_url ?? null,
              }
            : {
                id: 'unknown',
                full_name: 'Unknown',
                email: '',
                avatar_url: null,
              };

          const existingMember = members.find(
            (m) => Number(m.user.id) === user?.id,
          );

          setMyMembership({
            id: existingMember?.id || 'unknown',
            status: 'active',
            role: 'member',
            user: fallbackUser,
            total_contributed: 0,
            contributed_share: 0, // CHANGED: current_share → contributed_share
            joined_at: new Date().toISOString(),
            can_manage: false,
            can_vote: true,
            can_contribute: true,
          } as Membership);
        }
      } else {
        setMyMembership(null);
      }
    } catch (error) {
      setMyMembership(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    if (!token) return;

    setActionLoading('join');
    setMessage(null);

    try {
      const response = await clubService.joinClub(token, club.slug);

      if (response.success || response.is_member) {
        setMessage({
          type: 'success',
          text: response.message || 'Successfully joined the club!',
        });

        await loadMyMembership();
        onMembershipUpdate?.();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to join club',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to join club',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveClub = async () => {
    if (!token || !myMembership) return;

    setActionLoading('leave');
    setMessage(null);

    try {
      let response;

      if (myMembership.id && myMembership.id !== 'unknown') {
        response = await membershipService.leaveClub(
          token,
          club.slug,
          myMembership.id,
        );
      } else {
        response = await clubService.leaveClub(token, club.slug);
      }

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Successfully left the club!',
        });

        setMyMembership(null);
        onMembershipUpdate?.();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to leave club',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to leave club. Please try again.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRequest = async () => {
    if (!token || !myMembership) return;

    setActionLoading('cancel');
    setMessage(null);

    try {
      let response;

      if (myMembership.id && myMembership.id !== 'unknown') {
        response = await membershipService.cancelRequest(
          token,
          club.slug,
          myMembership.id,
        );
      } else {
        response = await clubService.leaveClub(token, club.slug);
      }

      if (response.success) {
        setMessage({
          type: 'success',
          text:
            response.message || 'Membership request cancelled successfully!',
        });

        setMyMembership(null);
        onMembershipUpdate?.();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to cancel request',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to cancel request. Please try again.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClub = async () => {
    if (!token) return;

    setActionLoading('delete');
    setMessage(null);
    try {
      const response = await clubService.deleteClub(token, club.slug);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Club deleted successfully!',
        });
        onMembershipUpdate?.();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to delete club',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete club. Please try again.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectMember = async (memberId: string, memberName: string) => {
    if (!token) return;

    setActionLoading(`reject-${memberId}`);
    try {
      const response = await membershipService.rejectMember(
        token,
        club.slug,
        memberId,
      );

      if (response.success) {
        setMessage({
          type: 'success',
          text: `Membership request for ${memberName} has been rejected`,
        });

        onMembershipUpdate?.();
        await loadMyMembership();
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Failed to reject member request',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to reject member. Please try again.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveMember = async (memberId: string) => {
    if (!token) return;

    setActionLoading(`approve-${memberId}`);
    try {
      const response = await membershipService.approveMember(
        token,
        club.slug,
        memberId,
      );

      if (response.success) {
        setMessage({ type: 'success', text: 'Member approved successfully' });
        onMembershipUpdate?.();
        await loadMyMembership();
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to approve member',
        });
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to approve member',
      });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    myMembership,
    loading,
    actionLoading,
    message,
    loadMyMembership,
    handleJoinClub,
    handleLeaveClub,
    handleCancelRequest,
    handleDeleteClub,
    handleApproveMember,
    handleRejectMember,
    setMessage,
    setActionLoading,
  };
};
