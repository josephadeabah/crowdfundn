// app/components/mentor/ViewAvailableRequests.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  Loader2,
  Award,
  Building,
  Globe,
  UserCheck,
  UserX,
  Mail,
  Sparkles,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ViewAvailableRequestsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface MentorRequest {
  id: number;
  campaign_id: number;
  entrepreneur_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  entrepreneur_notes?: string;
  mentor_notes?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  rating?: number;
  feedback?: string;
  campaign?: {
    id: number;
    title: string;
    description: string;
    goal_amount: number;
    current_amount: number;
    category: string;
    location: string;
    created_at: string;
    fundraiser: {
      id: number;
      full_name: string;
      profile?: {
        name?: string;
        description?: string;
      };
    };
  };
  entrepreneur?: {
    id: number;
    full_name: string;
    email: string;
    profile?: {
      name?: string;
      description?: string;
    };
  };
}

const ViewAvailableRequests: React.FC<ViewAvailableRequestsProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isScrolling, setIsScrolling] = useState(false);

  // Requests state
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MentorRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchMentorRequests();
  }, [token]);

  const fetchMentorRequests = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/my_mentor_assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const requestsList = data.assignments || [];

        // Transform the data to match our interface
        const transformedRequests = requestsList.map((req: any) => ({
          id: req.id,
          campaign_id: req.campaign?.id,
          entrepreneur_id: req.entrepreneur?.id,
          status: req.status,
          entrepreneur_notes: req.entrepreneur_notes,
          mentor_notes: req.mentor_notes,
          created_at: req.created_at,
          started_at: req.started_at,
          completed_at: req.completed_at,
          rating: req.rating,
          feedback: req.feedback,
          campaign: req.campaign
            ? {
                id: req.campaign.id,
                title: req.campaign.title,
                description: req.campaign.description,
                goal_amount: req.campaign.goal_amount,
                current_amount: req.campaign.current_amount,
                category: req.campaign.category,
                location: req.campaign.location,
                created_at: req.campaign.created_at,
                fundraiser: {
                  id: req.campaign.fundraiser?.id,
                  full_name: req.campaign.fundraiser?.full_name || 'Unknown',
                  profile: req.campaign.fundraiser?.profile,
                },
              }
            : undefined,
          entrepreneur: req.entrepreneur
            ? {
                id: req.entrepreneur.id,
                full_name: req.entrepreneur.full_name || 'Unknown',
                email: req.entrepreneur.email,
                profile: req.entrepreneur.profile,
              }
            : undefined,
        }));

        setRequests(transformedRequests);

        // Calculate stats
        const pending = transformedRequests.filter(
          (r: MentorRequest) => r.status === 'pending',
        ).length;
        const approved = transformedRequests.filter(
          (r: MentorRequest) => r.status === 'approved',
        ).length;
        const completed = transformedRequests.filter(
          (r: MentorRequest) => r.status === 'completed',
        ).length;
        const rejected = transformedRequests.filter(
          (r: MentorRequest) =>
            r.status === 'rejected' || r.status === 'cancelled',
        ).length;

        setStats({
          total: transformedRequests.length,
          pending,
          approved,
          completed,
          rejected,
        });

        // Set initial filtered requests (pending by default)
        setFilteredRequests(
          transformedRequests.filter(
            (r: MentorRequest) => r.status === 'pending',
          ),
        );
      } else {
        console.error('Failed to fetch mentor requests:', response.status);
      }
    } catch (error) {
      console.error('Error fetching mentor requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on active tab and search
  useEffect(() => {
    let result = requests;

    // Filter by status tab
    if (activeTab !== 'all') {
      if (activeTab === 'rejected') {
        result = result.filter(
          (r) => r.status === 'rejected' || r.status === 'cancelled',
        );
      } else {
        result = result.filter((r) => r.status === activeTab);
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (request) =>
          request.campaign?.title.toLowerCase().includes(query) ||
          request.entrepreneur?.full_name.toLowerCase().includes(query) ||
          request.entrepreneur_notes?.toLowerCase().includes(query) ||
          request.campaign?.category.toLowerCase().includes(query),
      );
    }

    setFilteredRequests(result);
  }, [searchQuery, activeTab, requests]);

  const handleRequestAction = async (
    requestId: number,
    action: 'approve' | 'reject',
    notes?: string,
  ) => {
    if (!token) return;

    try {
      const endpoint =
        action === 'approve' ? 'approve_assignment' : 'cancel_assignment';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/${requestId}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentor_notes: notes,
          }),
        },
      );

      if (response.ok) {
        // Refresh requests
        await fetchMentorRequests();
        onSuccess();
      } else {
        const error = await response.json();
        console.error(`Error ${action}ing request:`, error);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  const getProgressPercentage = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5">
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
            Completed
          </Badge>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5">
            Declined
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Mentorship Requests</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Review and manage mentorship requests from entrepreneurs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {stats.pending} Pending
          </Badge>
          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm hidden sm:flex"
          >
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {stats.approved} Active
          </Badge>
        </div>
      </div>

      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <Card className="col-span-1">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                {stats.total}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200 col-span-1">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-xs sm:text-sm text-yellow-700">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 col-span-1 sm:col-span-1 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <div className="text-xs sm:text-sm text-green-700">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200 col-span-1">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                {stats.completed}
              </div>
              <div className="text-xs sm:text-sm text-blue-700">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200 col-span-2 sm:col-span-1 lg:col-span-1">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600">
                {stats.rejected}
              </div>
              <div className="text-xs sm:text-sm text-gray-700">Declined</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs - Responsive */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>

            {/* Scrollable Tabs Container */}
            <div className="relative">
              {/* Scroll buttons for mobile */}
              <div className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-md"
                  onClick={() => scrollTabs('left')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-md"
                  onClick={() => scrollTabs('right')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList
                  className="tabs-container flex w-full overflow-x-auto pb-2 space-x-2 sm:space-x-0 sm:grid sm:grid-cols-5"
                  style={{ scrollbarWidth: 'thin' }}
                  onMouseEnter={() => setIsScrolling(true)}
                  onMouseLeave={() => setIsScrolling(false)}
                >
                  <TabsTrigger
                    value="all"
                    className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-gray-100 whitespace-nowrap"
                  >
                    All ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline-flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </span>
                    <span className="sm:hidden">Pending</span>
                    <span className="ml-1 sm:ml-2">({stats.pending})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="approved"
                    className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-green-100 data-[state=active]:text-green-800 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline-flex items-center">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Active
                    </span>
                    <span className="sm:hidden">Active</span>
                    <span className="ml-1 sm:ml-2">({stats.approved})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline-flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Completed
                    </span>
                    <span className="sm:hidden">Completed</span>
                    <span className="ml-1 sm:ml-2">({stats.completed})</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="rejected"
                    className="flex-shrink-0 px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-red-100 data-[state=active]:text-red-800 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline-flex items-center">
                      <UserX className="h-4 w-4 mr-2" />
                      Declined
                    </span>
                    <span className="sm:hidden">Declined</span>
                    <span className="ml-1 sm:ml-2">({stats.rejected})</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List - Responsive */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {filteredRequests.map((request) => {
            const progress = request.campaign
              ? getProgressPercentage(
                  request.campaign.current_amount,
                  request.campaign.goal_amount,
                )
              : 0;

            return (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header - Stack on mobile, row on desktop */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg truncate">
                          {request.campaign?.title || 'Campaign Not Available'}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              By {request.entrepreneur?.full_name || 'Unknown'}
                            </span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            <span>{formatDate(request.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        {getStatusBadge(request.status)}
                        {request.campaign && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                          >
                            {request.campaign.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Campaign Info */}
                    {request.campaign && (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">
                              {formatCurrency(request.campaign.current_amount)}{' '}
                              / {formatCurrency(request.campaign.goal_amount)}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex flex-col xs:flex-row xs:justify-between text-xs text-gray-500 gap-1">
                            <span>{progress.toFixed(1)}% funded</span>
                            {request.campaign.location && (
                              <span className="flex items-center">
                                <Globe className="h-3 w-3 mr-1" />
                                {request.campaign.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes Sections */}
                    <div className="space-y-3">
                      {/* Entrepreneur's Notes */}
                      {request.entrepreneur_notes && (
                        <div className="p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800 line-clamp-3">
                            <span className="font-semibold">
                              Founder's Message:
                            </span>{' '}
                            "{request.entrepreneur_notes}"
                          </p>
                        </div>
                      )}

                      {/* Mentor's Notes */}
                      {request.mentor_notes && (
                        <div className="p-3 bg-emerald-50 rounded-md">
                          <p className="text-sm text-emerald-800 line-clamp-3">
                            <span className="font-semibold">Your Notes:</span>{' '}
                            {request.mentor_notes}
                          </p>
                        </div>
                      )}

                      {/* Rating */}
                      {request.status === 'completed' && request.rating && (
                        <div className="p-3 bg-purple-50 rounded-md">
                          <div className="flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-purple-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-purple-800">
                              Rating: {request.rating}/5
                            </span>
                          </div>
                          {request.feedback && (
                            <p className="text-sm text-purple-700 mt-1 line-clamp-2">
                              "{request.feedback}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timeline - Mobile optimized */}
                    <div className="text-sm text-gray-600 space-y-1">
                      {request.started_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Started: {formatDate(request.started_at)}
                          </span>
                        </div>
                      )}
                      {request.completed_at && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Completed: {formatDate(request.completed_at)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Responsive */}
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4 border-t">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() =>
                              handleRequestAction(request.id, 'reject')
                            }
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                            onClick={() =>
                              handleRequestAction(request.id, 'approve')
                            }
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Accept Request
                          </Button>
                        </>
                      )}

                      {(request.status === 'approved' ||
                        request.status === 'completed') && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() =>
                              window.open(
                                `/campaigns/${request.campaign_id}`,
                                '_blank',
                              )
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Campaign
                          </Button>
                          {request.entrepreneur && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                (window.location.href = `/messages?user=${request.entrepreneur_id}`)
                              }
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          )}
                        </div>
                      )}

                      {request.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="w-full sm:w-auto bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      )}

                      {(request.status === 'rejected' ||
                        request.status === 'cancelled') && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="w-full sm:w-auto bg-gray-50 text-gray-600 border-gray-200"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Declined
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 sm:py-12 text-center">
            {activeTab === 'pending' ? (
              <>
                <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Pending Requests
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm sm:text-base">
                  You don't have any pending mentorship requests at the moment.
                  Entrepreneurs will send you requests through the mentor
                  marketplace.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    To increase your visibility to entrepreneurs:
                  </p>
                  <ul className="text-sm text-gray-600 text-left max-w-md mx-auto space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Keep your profile up-to-date</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Maintain "Available" status</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Encourage reviews from entrepreneurs</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <BarChart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Requests Found
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {activeTab === 'all'
                    ? "You haven't received any mentorship requests yet."
                    : `You don't have any ${activeTab} mentorship requests.`}
                </p>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setActiveTab('all')}
              className="w-full sm:w-auto"
            >
              View All Requests
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help Card - Responsive */}
      {activeTab === 'pending' && filteredRequests.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900 flex items-center text-sm sm:text-base">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                Quick Tips for Reviewing Requests
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    <strong>Review the campaign:</strong> Check if the venture
                    aligns with your expertise
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    <strong>Check your capacity:</strong> Ensure you have time
                    for new assignments
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    <strong>Read founder's message:</strong> Understand what
                    help they need
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    <strong>Respond promptly:</strong> Aim to reply within 48
                    hours
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions Footer - Responsive */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 sm:pt-6 border-t">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          <p>
            Need help?{' '}
            <a
              href="/help/mentors"
              className="text-emerald-600 hover:underline"
            >
              Visit mentor guide
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Close
          </Button>
          <Button
            onClick={() => window.open('/account#Find%20Mentor', '')}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 order-1 sm:order-2"
          >
            Browse Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewAvailableRequests;
