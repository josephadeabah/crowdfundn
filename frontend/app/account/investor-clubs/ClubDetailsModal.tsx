'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/app/components/modal/Modal';
import { Club, Member, Membership } from './clubTypes';
import { clubService, membershipService } from './clubservice';
import { useAuth } from '@/app/context/auth/AuthContext';
import { deslugify } from '@/app/utils/helpers/categories';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club;
  members: Member[];
  onMembershipUpdate?: () => void;
}

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  club,
  members,
  onMembershipUpdate,
}) => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'members' | 'actions'>(
    'about',
  );
  const [myMembership, setMyMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Alert Popup States
  const [leaveClubAlert, setLeaveClubAlert] = useState(false);
  const [rejectMemberAlert, setRejectMemberAlert] = useState(false);
  const [cancelRequestAlert, setCancelRequestAlert] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(
    null,
  );
  const [featureAlert, setFeatureAlert] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [deleteClubAlert, setDeleteClubAlert] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      loadMyMembership();
    }
  }, [isOpen, token, club.slug]);

  // Safe number formatting functions
  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return 0;
    }
    return Number(value);
  };

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

          const existingMember = members.find(m => Number(m.user.id) === user?.id);
          
          setMyMembership({
            id: existingMember?.id || 'unknown',
            status: 'active',
            role: 'member',
            user: fallbackUser,
            total_contributed: 0,
            current_share: 0,
            joined_at: new Date().toISOString(),
            can_manage: false,
            can_vote: true,
            can_contribute: true,
            estimated_share_value: 0,
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

    setActionLoading(true);
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

        setActiveTab('actions');
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
      setActionLoading(false);
    }
  };

  // FIXED: Direct API call functions for immediate actions
  const handleLeaveClub = async () => {
    if (!token || !myMembership) return;

    setActionLoading(true);
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

        setTimeout(() => {
          onClose();
        }, 1500);
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
      setActionLoading(false);
    }
  };

  const handleRejectMember = async (memberId: string, memberName: string) => {
    if (!token) return;

    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!token || !myMembership) return;

    setActionLoading(true);
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
          text: response.message || 'Membership request cancelled successfully!',
        });

        setMyMembership(null);
        onMembershipUpdate?.();

        setTimeout(() => {
          onClose();
        }, 1500);
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
      setActionLoading(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!token) return;

    setDeleteLoading(true);
    setMessage(null);

    try {
      const response = await clubService.deleteClub(token, club.slug);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Club deleted successfully!',
        });
        onMembershipUpdate?.();
        setTimeout(() => {
          onClose();
        }, 2000);
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
      setDeleteLoading(false);
    }
  };

  const handleApproveMember = async (memberId: string) => {
    if (!token) return;

    setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  // FIXED: These functions now just set the alert state for confirmation dialogs
  const showLeaveClubConfirmation = () => {
    setLeaveClubAlert(true);
  };

  const showRejectMemberConfirmation = (memberId: string, memberName: string) => {
    setSelectedMemberId(memberId);
    setSelectedMemberName(memberName);
    setRejectMemberAlert(true);
  };

  const showCancelRequestConfirmation = () => {
    setCancelRequestAlert(true);
  };

  const showDeleteClubConfirmation = () => {
    setDeleteClubAlert(true);
  };

  const handleFeatureClick = (featureName: string) => {
    setFeatureMessage(`${featureName} feature would open here`);
    setFeatureAlert(true);
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(safeNumber(amount));
  };

  const getMemberInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const isAdmin =
    club.is_admin ||
    myMembership?.role === 'admin' ||
    myMembership?.role === 'creator';
  const isCreator = club.is_creator || myMembership?.role === 'creator';
  const pendingMembers = members.filter((m) => m.status === 'pending');

  // Render content based on active tab and membership status
  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About This Club
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {club.mission || 'No description available.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Club Balance</div>
                <div className="text-xl font-bold text-emerald-700">
                  {formatCurrency(club.financials.current_balance)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  Minimum Contribution
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(club.minimum_monthly_contribution)}
                  /month
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Members</div>
                <div className="text-xl font-bold text-gray-900">
                  {club.current_members_count}/{club.max_members}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Invested</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(club.financials.total_invested)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Investment Focus
              </h4>
              <p className="text-gray-700">
                {deslugify(club.investment_focus) || 'General investments'}
              </p>
            </div>
          </div>
        );

      case 'members':
        if (!myMembership && club.club_type === 'private') {
          return (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Members</h3>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-orange-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-orange-800">
                      Private Club Membership Required
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      This is a private club with {club.current_members_count}{' '}
                      members. Request to join to see the full members list and
                      connect with other investors.
                    </p>
                    <button
                      onClick={handleJoinClub}
                      disabled={actionLoading}
                      className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading ? 'Requesting...' : 'Request to Join'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {club.current_members_count}
                </div>
                <div className="text-gray-600">Active Members</div>
                <div className="text-sm text-gray-500 mt-2">
                  Join the club to see member details and connect with the
                  community
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Members ({members.length})
              </h3>
              {pendingMembers.length > 0 && isAdmin && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  {pendingMembers.length} pending
                </span>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg divide-y">
              {members.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No members found
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                        {getMemberInitials(member.user.full_name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {member.user.full_name}
                          {member.user.id === String(user?.id) && (
                            <span className="ml-2 text-xs text-emerald-600">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.role === 'creator'
                                ? 'bg-purple-100 text-purple-800'
                                : member.role === 'admin'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {formatRole(member.role)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : member.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {member.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(member.total_contributed)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {safeToFixed(member.current_share, 1)}% share
                        </div>
                      </div>

                      {isAdmin && member.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveMember(member.id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                          >
                            {actionLoading ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectMember(
                              member.id,
                              member.user.full_name,
                            )}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'actions':
        if (!myMembership) {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Club Actions
              </h3>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Become a Member
                </h4>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    {club.club_type === 'public'
                      ? 'Join this public club to start collaborating with other investors and participate in investment decisions.'
                      : 'Request to join this private club. Your request will be reviewed by club admins.'}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleJoinClub}
                      disabled={actionLoading}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50"
                    >
                      {actionLoading
                        ? club.club_type === 'public'
                          ? 'Joining...'
                          : 'Requesting...'
                        : club.club_type === 'public'
                          ? 'Join Club Now'
                          : 'Request to Join'}
                    </button>

                    {club.club_type === 'private' && (
                      <button
                        onClick={() => setActiveTab('about')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Learn More
                      </button>
                    )}
                  </div>

                  {club.club_type === 'private' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg
                          className="h-5 w-5 text-orange-400 mt-0.5 mr-3 flex-shrink-0"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-orange-700">
                            After requesting to join, club admins will review
                            your application. You'll receive a notification once
                            your membership is approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
                  <div className="font-semibold text-gray-900">
                    Make Contributions
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Add funds to the club pool (Members only)
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
                  <div className="font-semibold text-gray-900">
                    Propose Investments
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Suggest new investment opportunities (Members only)
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
                  <div className="font-semibold text-gray-900">
                    Vote on Decisions
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Participate in club voting (Members only)
                  </div>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg text-left">
                  <div className="font-semibold text-gray-900">
                    View Analytics
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Access detailed performance reports (Members only)
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Club Actions
            </h3>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Membership</h4>

              {myMembership.status === 'pending' ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Membership Pending Approval
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Your membership request is pending approval from
                            club admins. You'll be able to access all club
                            features once approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* FIXED: Now calls the actual API function directly */}
                  <button
                    onClick={handleCancelRequest}
                    disabled={actionLoading}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50"
                  >
                    {actionLoading ? 'Canceling...' : 'Cancel Request'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Your Share:</span>
                      <div className="font-semibold">
                        {safeToFixed(myMembership.current_share, 2)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Contributed:</span>
                      <div className="font-semibold">
                        {formatCurrency(myMembership.total_contributed)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Estimated Value:</span>
                      <div className="font-semibold">
                        {formatCurrency(myMembership.estimated_share_value)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <div className="font-semibold capitalize">
                        {myMembership.role}
                      </div>
                    </div>
                  </div>

                  {/* FIXED: Now calls the actual API function directly */}
                  <button
                    onClick={handleLeaveClub}
                    disabled={actionLoading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                  >
                    {actionLoading ? 'Leaving...' : 'Leave Club'}
                  </button>

                  {isCreator && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        As the club creator, you have additional administrative
                        privileges.
                      </p>
                      {/* FIXED: Now calls the actual API function directly */}
                      <button
                        onClick={handleDeleteClub}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 text-sm"
                      >
                        Delete Club
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {myMembership?.status === 'active' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleFeatureClick('Make Contribution')}
                  className="p-4 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="font-semibold text-emerald-900">
                    Make Contribution
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Add funds to the club pool
                  </div>
                </button>

                <button
                  onClick={() => handleFeatureClick('Propose Investment')}
                  className="p-4 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-left"
                >
                  <div className="font-semibold text-emerald-900">
                    Propose Investment
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Suggest a new investment opportunity
                  </div>
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => handleFeatureClick('Manage Club')}
                      className="p-4 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left"
                    >
                      <div className="font-semibold text-orange-900">
                        Manage Club
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Update club settings and members
                      </div>
                    </button>

                    <button
                      onClick={() => handleFeatureClick('View Analytics')}
                      className="p-4 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-left"
                    >
                      <div className="font-semibold text-orange-900">
                        View Analytics
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Detailed performance reports
                      </div>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnBackdropClick={false}
        size="xxxlarge"
        customStyles={{ padding: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full overflow-hidden max-h-[90vh] flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-emerald-900">
                {club.name}
              </h2>
              <p className="text-gray-600 mt-1">{club.mission}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    club.club_type === 'public'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {club.club_type} Club
                </span>
                {myMembership && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      myMembership.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {myMembership.status === 'active' ? 'Member' : 'Pending'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mx-6 mt-4 p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['about', 'members', 'actions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>
        </motion.div>
      </Modal>

      {/* Alert Popups - Only for actions that need confirmation */}
      <AlertPopup
        title="Reject Membership Request"
        message={
          <div>
            <p className="mb-2">
              Are you sure you want to reject {selectedMemberName}'s membership
              request?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>
          </div>
        }
        isOpen={rejectMemberAlert}
        setIsOpen={setRejectMemberAlert}
        onConfirm={() => selectedMemberId && selectedMemberName && handleRejectMember(selectedMemberId, selectedMemberName)}
        confirmText={actionLoading ? 'Rejecting...' : 'Reject Request'}
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        loading={actionLoading}
        confirmDisabled={actionLoading}
      />
      
      <AlertPopup
        title="Feature Coming Soon"
        message={featureMessage}
        isOpen={featureAlert}
        setIsOpen={setFeatureAlert}
        onConfirm={() => setFeatureAlert(false)}
        confirmText="Got it"
        confirmButtonClass="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
      />
    </>
  );
};

export default ClubDetailsModal;