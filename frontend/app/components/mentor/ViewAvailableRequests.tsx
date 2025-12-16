// app/components/mentor/ViewAvailableRequests.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Search,
  Filter,
  Briefcase,
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Loader2,
  Award,
  Target,
  Building,
  Globe,
  UserCheck,
  UserX,
  Mail,
  Sparkles,
  BarChart,
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
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        );
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'rejected':
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mentorship Requests</h2>
          <p className="text-gray-600">
            Review and manage mentorship requests from entrepreneurs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            {stats.pending} Pending
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <UserCheck className="h-4 w-4 mr-1" />
            {stats.approved} Active
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-yellow-700">Pending Review</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <div className="text-sm text-green-700">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.completed}
              </div>
              <div className="text-sm text-blue-700">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {stats.rejected}
              </div>
              <div className="text-sm text-gray-700">Declined</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests by campaign, founder, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gray-100"
                >
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Active ({stats.approved})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Declined ({stats.rejected})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
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
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {request.campaign?.title ||
                                'Campaign Not Available'}
                            </h3>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <Building className="h-4 w-4 mr-2" />
                              <span>
                                Requested by{' '}
                                {request.entrepreneur?.full_name || 'Unknown'}
                              </span>
                              <span className="mx-2">•</span>
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{formatDate(request.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(request.status)}
                            {request.campaign && (
                              <Badge variant="outline">
                                {request.campaign.category}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Campaign Info */}
                        {request.campaign && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Campaign Progress
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency(
                                    request.campaign.current_amount,
                                  )}{' '}
                                  of{' '}
                                  {formatCurrency(request.campaign.goal_amount)}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex justify-between text-xs text-gray-500">
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

                        {/* Entrepreneur's Notes */}
                        {request.entrepreneur_notes && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                              <span className="font-semibold">
                                Founder's Message:
                              </span>{' '}
                              "{request.entrepreneur_notes}"
                            </p>
                          </div>
                        )}

                        {/* Mentor's Notes (if any) */}
                        {request.mentor_notes && (
                          <div className="mb-4 p-3 bg-emerald-50 rounded-md">
                            <p className="text-sm text-emerald-800">
                              <span className="font-semibold">Your Notes:</span>{' '}
                              {request.mentor_notes}
                            </p>
                          </div>
                        )}

                        {/* Rating (for completed requests) */}
                        {request.status === 'completed' && request.rating && (
                          <div className="mb-4 p-3 bg-purple-50 rounded-md">
                            <div className="flex items-center">
                              <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                              <span className="text-sm font-semibold text-purple-800">
                                Rating: {request.rating}/5
                              </span>
                            </div>
                            {request.feedback && (
                              <p className="text-sm text-purple-700 mt-1">
                                "{request.feedback}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Timeline */}
                        <div className="text-sm text-gray-600 space-y-1">
                          {request.started_at && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>
                                Mentorship started:{' '}
                                {formatDate(request.started_at)}
                              </span>
                            </div>
                          )}
                          {request.completed_at && (
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-2" />
                              <span>
                                Completed: {formatDate(request.completed_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions based on status */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRequestAction(request.id, 'reject')
                            }
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
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
                        <>
                          <Button
                            variant="outline"
                            size="sm"
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
                              onClick={() =>
                                (window.location.href = `/messages?user=${request.entrepreneur_id}`)
                              }
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Message Founder
                            </Button>
                          )}
                        </>
                      )}

                      {request.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="bg-blue-50 text-blue-700 border-blue-200"
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
                          className="bg-gray-50 text-gray-600 border-gray-200"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Request Declined
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
          <CardContent className="py-12 text-center">
            {activeTab === 'pending' ? (
              <>
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Pending Requests
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
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
                      <span>
                        Keep your profile up-to-date with your expertise
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Maintain an "Available" status in your dashboard
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Encourage entrepreneurs to leave reviews after
                        completing mentorships
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Requests Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all'
                    ? "You haven't received any mentorship requests yet."
                    : `You don't have any ${activeTab} mentorship requests.`}
                </p>
              </>
            )}
            <Button variant="outline" onClick={() => setActiveTab('all')}>
              View All Requests
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      {activeTab === 'pending' && filteredRequests.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Quick Tips for Reviewing Requests
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Review the campaign:</strong> Check if the venture
                    aligns with your expertise
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Check your capacity:</strong> Ensure you have time
                    to take on new assignments
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Read founder's message:</strong> Understand what
                    specific help they're seeking
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Respond promptly:</strong> Entrepreneurs appreciate
                    timely responses (within 48 hours)
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t">
        <div className="text-sm text-gray-600">
          <p>
            Need help with mentorship requests?{' '}
            <a
              href="/help/mentors"
              className="text-emerald-600 hover:underline"
            >
              Visit our mentor guide
            </a>
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
          <Button
            onClick={() => window.open('/account#Find%20Mentor', '')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Browse Mentor Marketplace
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewAvailableRequests;
