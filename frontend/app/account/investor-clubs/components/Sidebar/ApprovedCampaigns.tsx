import React, { useState } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  List,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  PieChart,
  ExternalLink,
  Vote,
  Trash2,
} from 'lucide-react';
import Pagination from '@/app/components/pagination/Pagination';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { ApprovedCampaign, Club } from '../../clubTypes';
import ToastComponent from '@/app/components/toast/Toast';

interface ApprovedCampaignsProps {
  club: Club;
  approvedCampaigns: ApprovedCampaign[];
  loading?: boolean;
  onRefresh?: () => void;
}

// Safe number formatting helper
const safeToLocaleString = (
  value: number | undefined | null,
  fallback: string = '0',
): string => {
  if (value === undefined || value === null) return fallback;
  return value.toLocaleString();
};

// Safe date formatting helper
const safeDateToLocaleString = (
  dateString: string | undefined | null,
  fallback: string = 'N/A',
): string => {
  if (!dateString) return fallback;
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return fallback;
  }
};

// Safe progress calculation
const calculateProgressPercentage = (
  current: number | undefined,
  goal: number | undefined,
): number => {
  if (!current || !goal || goal === 0) return 0;
  return Math.min(100, (current / goal) * 100);
};

const ApprovedCampaigns: React.FC<ApprovedCampaignsProps> = ({
  club,
  approvedCampaigns = [],
  loading = false,
  onRefresh,
}) => {
  const { user, token } = useAuth();
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(
    new Set(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(3);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<ApprovedCampaign | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'warning'
  });

  // Show toast function
  const showToast = (title: string, description: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({
      isOpen: true,
      title,
      description,
      type
    });
  };

  // Calculate paginated campaigns
  const totalPages = Math.ceil(approvedCampaigns.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCampaigns = approvedCampaigns.slice(
    startIndex,
    startIndex + perPage,
  );

  // Navigate to campaign
  const handleNavigateToCampaign = (slug: string) => {
    if (slug) {
      window.open(`/campaign/${slug}`, '_blank');
    }
  };

  const toggleCampaignExpansion = (campaignId: string) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteCampaign = async (campaign: ApprovedCampaign) => {
    setSelectedCampaign(campaign);
    setDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!selectedCampaign || !club || !token) {
      showToast('Error', 'Missing authentication token', 'error');
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/investment_clubs/${club.slug}/approved_campaigns/${selectedCampaign.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        showToast('Success', 'Campaign removed successfully');
        // Refresh the list after successful deletion
        if (onRefresh) {
          onRefresh();
        }
        setDeleteAlert(false);
        setSelectedCampaign(null);
      } else {
        console.error('Failed to delete approved campaign:', data.error);
        showToast(
          'Error', 
          `Failed to remove approved campaign: ${data.error || 'Unknown error'}`,
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting approved campaign:', error);
      showToast(
        'Error',
        'Error deleting approved campaign. Please try again.',
        'error'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = club?.is_admin;

  // Approved Campaigns Section - Hamburger List Design
  const ApprovedCampaignsSection = () => {
    if (!approvedCampaigns || !Array.isArray(approvedCampaigns)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Approved Campaigns</CardTitle>
            <CardDescription>
              Campaigns that have been approved by club members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Unable to load approved campaigns
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Approved Campaigns</CardTitle>
              <CardDescription>
                Campaigns that have been approved by club members for investment
                {isAdmin && ' - You can remove campaigns as admin'}
              </CardDescription>
            </div>
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : approvedCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Approved Campaigns
              </h3>
              <p className="text-sm text-muted-foreground">
                Approved campaigns will appear here after successful voting.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {paginatedCampaigns?.map((campaign) => {
                  if (!campaign?.id) return null;

                  const isExpanded = expandedCampaigns.has(campaign.id);
                  const campaignData = campaign.campaign || {};
                  const clubInvestment = campaign.club_investment || {};
                  const votingStats = clubInvestment.voting_stats || {};

                  const progressPercentage = calculateProgressPercentage(
                    campaignData.transferred_amount,
                    campaignData.goal_amount,
                  );

                  return (
                    <div
                      key={campaign?.id}
                      className="rounded-sm bg-green-50/50 hover:bg-green-50 transition-colors"
                    >
                      {/* Campaign Header - Always Visible */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleCampaignExpansion(campaign.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-green-600" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {campaignData?.title || 'Untitled Campaign'}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {campaignData?.slug && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigateToCampaign(
                                          campaignData.slug,
                                        );
                                      }}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {isAdmin && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCampaign(campaign);
                                      }}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {campaignData.category || 'Uncategorized'}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 border-green-300 text-xs"
                                >
                                  Approved
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="text-right">
                              <div className="font-medium text-green-600">
                                {votingStats.approval_percentage || 0}% Yes
                              </div>
                              <div className="text-xs">
                                {safeDateToLocaleString(campaign.approved_at)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>
                              Raised: {campaignData.currency || '$'}
                              {safeToLocaleString(
                                campaignData.transferred_amount,
                              )}
                            </span>
                            <span>
                              Goal: {campaignData.currency || '$'}
                              {safeToLocaleString(campaignData.goal_amount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-green-200 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Campaign Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  Campaign Details
                                </h4>
                                <div className="text-sm text-gray-600">
                                  {campaignData.description?.body ? (
                                    <div
                                      className="prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{
                                        __html: campaignData.description.body,
                                      }}
                                    />
                                  ) : (
                                    'No description available.'
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Fundraiser:
                                  </span>
                                  <span className="font-medium">
                                    {campaignData.fundraiser?.name || 'Unknown'}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Category:
                                  </span>
                                  <Badge variant="outline">
                                    {campaignData.category || 'Uncategorized'}
                                  </Badge>
                                </div>
                                {campaignData.slug && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Slug:</span>
                                    <span className="font-medium">
                                      {campaignData.slug}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Investment Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                  <PieChart className="h-4 w-4 mr-2" />
                                  Investment Details
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      Proposed Amount:
                                    </span>
                                    <span className="font-medium">
                                      {club?.currency_symbol || '$'}
                                      {safeToLocaleString(
                                        clubInvestment.proposed_amount,
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                      Share Percentage:
                                    </span>
                                    <span className="font-medium">
                                      {safeToLocaleString(
                                        clubInvestment.proposed_share_percentage,
                                      )}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Voting Stats */}
                              {votingStats && (
                                <div>
                                  <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center">
                                    <Vote className="h-4 w-4 mr-2" />
                                    Voting Results
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">
                                        Yes Votes:
                                      </span>
                                      <span className="font-medium text-green-600">
                                        {safeToLocaleString(
                                          votingStats.yes_votes,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">
                                        No Votes:
                                      </span>
                                      <span className="font-medium text-red-600">
                                        {safeToLocaleString(
                                          votingStats.no_votes,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">
                                        Total Votes:
                                      </span>
                                      <span className="font-medium">
                                        {safeToLocaleString(
                                          votingStats.total_votes,
                                        )}{' '}
                                        / {votingStats.total_members || '?'}{' '}
                                        members
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Approval Date */}
                              <div className="flex justify-between text-sm pt-2 border-t">
                                <span className="text-gray-600 flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Approved Date:
                                </span>
                                <span className="font-medium">
                                  {safeDateToLocaleString(
                                    campaign.approved_at,
                                    'Not available',
                                  )}
                                </span>
                              </div>

                              {/* View Campaign Button */}
                              {campaignData.slug && (
                                <div className="pt-2">
                                  <Button
                                    onClick={() =>
                                      handleNavigateToCampaign(
                                        campaignData.slug,
                                      )
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Campaign Details
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {approvedCampaigns.length > perPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={approvedCampaigns.length}
                  perPage={perPage}
                  onPageChange={handlePageChange}
                  showPerPageSelector={false}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!club) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8 text-muted-foreground">
          <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
          <p>Unable to load club information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ApprovedCampaignsSection />

      {/* Delete Confirmation Alert */}
      <AlertPopup
        title="Remove Approved Campaign"
        message={`Are you sure you want to remove "${selectedCampaign?.campaign?.title}" from approved campaigns? This action cannot be undone.`}
        isOpen={deleteAlert}
        setIsOpen={setDeleteAlert}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteAlert(false);
          setSelectedCampaign(null);
        }}
        confirmText={deleteLoading ? 'Removing...' : 'Yes, Remove'}
        cancelText="Nope"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        isLoading={deleteLoading}
      />

      {/* Toast Component */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
    </div>
  );
};

export default ApprovedCampaigns;