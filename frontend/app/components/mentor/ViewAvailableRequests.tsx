// app/components/mentor/ViewAvailableRequests.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
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
} from 'lucide-react';

interface ViewAvailableRequestsProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Campaign {
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
}

interface MentorRequest {
  id: number;
  campaign_id: number;
  entrepreneur_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  entrepreneur_notes?: string;
  created_at: string;
  campaign?: Campaign;
  entrepreneur?: {
    id: number;
    full_name: string;
    profile?: {
      name?: string;
      description?: string;
    };
  };
}

const ViewAvailableRequests: React.FC<ViewAvailableRequestsProps> = ({
  onSuccess,
  onCancel
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [activeTab, setActiveTab] = useState('campaigns');
  
  // Campaigns state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Requests state
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MentorRequest[]>([]);
  const [requestSearchQuery, setRequestSearchQuery] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalRequests: 0,
    pendingRequests: 0,
    activeCampaigns: 0
  });

  // Categories and locations from campaigns
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      
      // Fetch campaigns
      const campaignsRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        const campaignsList = campaignsData.campaigns || [];
        setCampaigns(campaignsList);
        setFilteredCampaigns(campaignsList);

        // Extract unique categories and locations
        const uniqueCategories = Array.from(new Set(campaignsList.map((c: Campaign) => c.category).filter(Boolean)));
        const uniqueLocations = Array.from(new Set(campaignsList.map((c: Campaign) => c.location).filter(Boolean)));
        
        setCategories(uniqueCategories as string[]);
        setLocations(uniqueLocations as string[]);
      }

      // Fetch mentor requests
      await fetchMentorRequests();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorRequests = async () => {
    if (!token) return;

    try {
      setLoadingRequests(true);
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
        setRequests(requestsList);
        setFilteredRequests(requestsList);

        // Update stats
        const pendingReqs = requestsList.filter((r: MentorRequest) => r.status === 'pending').length;
        setStats({
          totalCampaigns: campaigns.length,
          totalRequests: requestsList.length,
          pendingRequests: pendingReqs,
          activeCampaigns: campaigns.length
        });
      }
    } catch (error) {
      console.error('Error fetching mentor requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Filter campaigns
  useEffect(() => {
    let result = campaigns;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(campaign =>
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.fundraiser.full_name.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(campaign => campaign.category === selectedCategory);
    }

    if (selectedLocation !== 'all') {
      result = result.filter(campaign => campaign.location === selectedLocation);
    }

    setFilteredCampaigns(result);
  }, [searchQuery, selectedCategory, selectedLocation, campaigns]);

  // Filter requests
  useEffect(() => {
    let result = requests;

    if (requestSearchQuery) {
      const query = requestSearchQuery.toLowerCase();
      result = result.filter(request =>
        request.campaign?.title.toLowerCase().includes(query) ||
        request.entrepreneur?.full_name.toLowerCase().includes(query) ||
        request.entrepreneur_notes?.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(result);
  }, [requestSearchQuery, requests]);

  const requestMentorship = async (campaignId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/request_mentor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            entrepreneur_notes: "I'd like to request mentorship for this campaign"
          }),
        },
      );

      if (response.ok) {
        // Refresh requests
        await fetchMentorRequests();
      } else {
        const error = await response.json();
        console.error('Error requesting mentorship:', error);
      }
    } catch (error) {
      console.error('Error requesting mentorship:', error);
    }
  };

  const handleRequestAction = async (requestId: number, action: 'approve' | 'reject') => {
    if (!token) return;

    try {
      const endpoint = action === 'approve' ? 'approve_assignment' : 'cancel_assignment';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/${requestId}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        // Refresh requests
        await fetchMentorRequests();
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
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          <h2 className="text-2xl font-bold">Available Requests</h2>
          <p className="text-gray-600">
            Browse campaigns seeking mentorship and manage your requests
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {stats.activeCampaigns} Active Campaigns
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {stats.pendingRequests} Pending Requests
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
            <Briefcase className="h-4 w-4 mr-2" />
            Browse Campaigns
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
            <MessageSquare className="h-4 w-4 mr-2" />
            My Requests ({requests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Campaign Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search campaigns by title, description, or founder..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location, index) => (
                      <SelectItem key={index} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => {
              const progress = getProgressPercentage(campaign.current_amount, campaign.goal_amount);
              const hasExistingRequest = requests.some(r => r.campaign_id === campaign.id);

              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{campaign.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          {campaign.fundraiser.full_name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{campaign.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Campaign Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {campaign.description.replace(/<[^>]*>/g, '')}
                    </p>

                    {/* Funding Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Raised</span>
                        <span className="font-semibold">
                          {formatCurrency(campaign.current_amount)} of {formatCurrency(campaign.goal_amount)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{progress.toFixed(1)}% funded</span>
                        <span>{formatDate(campaign.created_at)}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      {campaign.location}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`/campaigns/${campaign.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Campaign
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={hasExistingRequest}
                        onClick={() => requestMentorship(campaign.id)}
                      >
                        {hasExistingRequest ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Requested
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request Mentorship
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCampaigns.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                <p className="text-gray-600 mb-4">
                  {campaigns.length === 0
                    ? 'No active campaigns are available at the moment.'
                    : 'Try adjusting your search filters to find campaigns.'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {/* Requests Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests by campaign, founder, or notes..."
                  value={requestSearchQuery}
                  onChange={(e) => setRequestSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requests List */}
          {loadingRequests ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {request.campaign?.title || 'Campaign Not Found'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Requested by {request.entrepreneur?.full_name || 'Unknown'}
                              </p>
                            </div>
                            <Badge
                              className={`
                                ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                ${request.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                              `}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>

                          {request.entrepreneur_notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Founder's Notes:</span>{' '}
                                {request.entrepreneur_notes}
                              </p>
                            </div>
                          )}

                          <div className="mt-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Requested on {formatDate(request.created_at)}
                            </div>
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
                              onClick={() => handleRequestAction(request.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleRequestAction(request.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Request
                            </Button>
                          </>
                        )}

                        {request.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/campaigns/${request.campaign_id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Campaign
                          </Button>
                        )}

                        {request.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                          >
                            <Award className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mentorship requests</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any mentorship requests yet. Browse campaigns to request mentorship.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('campaigns')}
                >
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Close
        </Button>
        <Button
          onClick={() => window.open('/mentor/marketplace', '_blank')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          View Full Marketplace
        </Button>
      </div>
    </div>
  );
};

export default ViewAvailableRequests;