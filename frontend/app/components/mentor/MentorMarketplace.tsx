// app/components/mentor/MentorMarketplace.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import {
  Search,
  Filter,
  Star,
  Users,
  UserPlus,
  XCircle,
  CheckCircle,
  Building,
  ExternalLink,
  Calendar,
  Target,
  Award,
  Loader2,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Modal from '@/app/components/modal/Modal';
import ToastComponent from '@/app/components/toast/Toast';

interface Mentor {
  id: number;
  user_id: number;
  professional_title: string;
  years_of_experience: number;
  rating: number | string;
  reviews_count: number;
  current_assignments: number;
  max_assignments?: number;
  bio?: string;
  linkedin_profile?: string;
  status: string;
  created_at: string;
  updated_at: string;
  expertise?: string[];
}

interface MentorResponse {
  mentors: Mentor[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  filters?: {
    expertise_tags: string[];
    max_rating: number;
    max_experience: number;
  };
}

interface Campaign {
  id: number;
  title: string;
  status: string;
  [key: string]: any;
}

interface ToastState {
  isOpen: boolean;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning';
}

interface RequestingState {
  [mentorId: number]: {
    loading: boolean;
    campaignId?: number;
  };
}

// Star Rating Component
const StarRating = ({ 
  rating, 
  size = "sm",
  showNumber = true,
  showReviewsCount = false,
  reviewsCount = 0 
}: { 
  rating: number | string; 
  size?: "xs" | "sm" | "md" | "lg";
  showNumber?: boolean;
  showReviewsCount?: boolean;
  reviewsCount?: number;
}) => {
  const ratingNum = typeof rating === 'string' ? parseFloat(rating) : rating;
  const sizeMap = {
    xs: "h-2 w-2",
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeMap[size]} ${
              star <= Math.floor(ratingNum || 0)
                ? 'text-yellow-400 fill-yellow-400'
                : star <= (ratingNum || 0)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className={`ml-1 font-semibold ${
          size === 'lg' ? 'text-lg' : 
          size === 'md' ? 'text-base' : 'text-xs'
        }`}>
          {ratingNum?.toFixed(1) || '0.0'}
        </span>
      )}
      {showReviewsCount && reviewsCount > 0 && (
        <span className={`ml-1 text-gray-500 ${
          size === 'lg' ? 'text-base' : 
          size === 'md' ? 'text-sm' : 'text-xs'
        }`}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};

const MentorMarketplace: React.FC = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [requestedMentors, setRequestedMentors] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [expertiseMap, setExpertiseMap] = useState<Record<number, string[]>>(
    {},
  );
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });
  const [requestingState, setRequestingState] = useState<RequestingState>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    fetchMentors();
    fetchCampaigns();
  }, [token]);

  const showToast = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning' = 'success',
  ) => {
    setToast({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchCampaigns = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/fundraisers/campaigns/my_campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const activeCampaigns =
          data.campaigns?.filter((c: Campaign) => c.status === 'active') || [];
        setCampaigns(activeCampaigns);

        if (activeCampaigns.length > 0) {
          setSelectedCampaignId(activeCampaigns[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchMentorExpertise = async (mentorId: number) => {
    if (!token) return [];

    try {
      const response = await fetch(
        `${API_BASE_URL}/mentor/mentors/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.expertise || [];
      }
    } catch (error) {
      console.error(`Error fetching expertise for mentor ${mentorId}:`, error);
    }
    return [];
  };

  const fetchMentors = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedExpertise !== 'all')
        params.append('expertise', selectedExpertise);
      if (minRating > 0) params.append('min_rating', minRating.toString());
      if (minExperience > 0)
        params.append('min_experience', minExperience.toString());

      const mentorsRes = await fetch(
        `${API_BASE_URL}/mentor/mentors?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (mentorsRes.ok) {
        const mentorsData: MentorResponse = await mentorsRes.json();
        setMentors(mentorsData.mentors || []);

        if (mentorsData.filters?.expertise_tags) {
          setAvailableTags(mentorsData.filters.expertise_tags);
        }

        // Fetch expertise for each mentor
        const expertisePromises = mentorsData.mentors.map(async (mentor) => {
          const expertise = await fetchMentorExpertise(mentor.id);
          return { mentorId: mentor.id, expertise };
        });

        const expertiseResults = await Promise.all(expertisePromises);
        const newExpertiseMap: Record<number, string[]> = {};
        expertiseResults.forEach(({ mentorId, expertise }) => {
          newExpertiseMap[mentorId] = expertise;
        });
        setExpertiseMap(newExpertiseMap);
      } else {
        console.error('Failed to fetch mentors:', mentorsRes.status);
        showToast('Error', 'Failed to load mentors', 'error');
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      showToast('Error', 'Failed to load mentors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const requestMentor = async (mentorId: number) => {
    if (!token) {
      showToast('Error', 'You must be logged in to request a mentor', 'error');
      return;
    }

    if (!selectedCampaignId) {
      showToast(
        'Error',
        'Please select a campaign to assign the mentor to',
        'error',
      );
      return;
    }

    // Set loading state for this specific mentor
    setRequestingState((prev) => ({
      ...prev,
      [mentorId]: { loading: true, campaignId: selectedCampaignId },
    }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/mentor/campaigns/${selectedCampaignId}/assignments/request_mentor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentor_id: mentorId,
            notes: `Mentor request from ${user?.full_name} for campaign ${selectedCampaignId}`,
          }),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        setRequestedMentors((prev) => [...prev, mentorId]);
        showToast(
          'Success',
          `Mentor request sent successfully for campaign #${selectedCampaignId}`,
        );
      } else if (response.status === 409) {
        // Handle conflict - mentor already assigned
        showToast(
          'Already Requested',
          responseData.error ||
            'This mentor has already been requested for this campaign',
          'warning',
        );
        // Still add to requested mentors since it's already requested
        if (!requestedMentors.includes(mentorId)) {
          setRequestedMentors((prev) => [...prev, mentorId]);
        }
      } else if (response.status === 403) {
        showToast(
          'Permission Denied',
          responseData.error ||
            'You do not have permission to request mentors for this campaign',
          'error',
        );
      } else if (response.status === 422) {
        showToast(
          'Mentor Unavailable',
          responseData.error || 'Mentor is not available for new assignments',
          'error',
        );
      } else {
        showToast(
          'Error',
          responseData.error || 'Failed to request mentor',
          'error',
        );
      }
    } catch (error) {
      console.error('Error requesting mentor:', error);
      showToast(
        'Error',
        'Failed to request mentor. Please try again.',
        'error',
      );
    } finally {
      // Clear loading state
      setRequestingState((prev) => {
        const newState = { ...prev };
        delete newState[mentorId];
        return newState;
      });
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    const mentorExpertise = expertiseMap[mentor.id] || [];
    const matchesSearch =
      searchQuery === '' ||
      mentor.professional_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (mentor.bio &&
        mentor.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mentorExpertise.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesExpertise =
      selectedExpertise === 'all' ||
      mentorExpertise.includes(selectedExpertise);

    const ratingValue =
      typeof mentor.rating === 'string'
        ? parseFloat(mentor.rating)
        : mentor.rating;

    const matchesRating = ratingValue >= minRating;
    const matchesExperience = mentor.years_of_experience >= minExperience;

    return (
      matchesSearch && matchesExpertise && matchesRating && matchesExperience
    );
  });

  const getAvailabilityBadge = (mentor: Mentor) => {
    if (
      mentor.max_assignments === undefined ||
      mentor.max_assignments === null
    ) {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 text-xs px-2 py-0.5">
          Available
        </Badge>
      );
    }

    const availability =
      ((mentor.max_assignments - mentor.current_assignments) /
        mentor.max_assignments) *
      100;

    if (availability >= 50) {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 text-xs px-2 py-0.5">
          Available
        </Badge>
      );
    } else if (availability >= 25) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs px-2 py-0.5">
          Limited
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-0 text-xs px-2 py-0.5">
          Booked
        </Badge>
      );
    }
  };

  const getInitials = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return title.charAt(0).toUpperCase();
  };

  const formatExperience = (years: number) => {
    if (years === 1) return '1 year';
    return `${years} years`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewProfile = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsProfileModalOpen(true);
  };

  const isCurrentUserMentor = (mentor: Mentor) => {
    return user?.id === mentor.user_id;
  };

  // Campaign Selection Modal
  const CampaignSelectionModal = () => {
    if (campaigns.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Campaign</h3>
        <p className="text-sm text-gray-600">
          Choose which active campaign to assign this mentor to:
        </p>

        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedCampaignId === campaign.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCampaignId(campaign.id)}
            >
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full mr-3 ${
                    selectedCampaignId === campaign.id
                      ? 'bg-emerald-500'
                      : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{campaign.title}</p>
                  <p className="text-xs text-gray-500">ID: {campaign.id}</p>
                </div>
                {selectedCampaignId === campaign.id && (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedMentor(null);
              setIsProfileModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              if (selectedMentor) {
                requestMentor(selectedMentor.id);
                setIsProfileModalOpen(false);
              }
            }}
            disabled={!selectedCampaignId}
          >
            Request Mentor
          </Button>
        </div>
      </div>
    );
  };

  // Mentor Profile Modal Content
  const MentorProfileModal = () => {
    if (!selectedMentor) return null;

    const mentorExpertise = expertiseMap[selectedMentor.id] || [];
    const isCurrentUser = isCurrentUserMentor(selectedMentor);

    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gray-100 text-gray-800 text-lg">
                {getInitials(selectedMentor.professional_title)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">
                {selectedMentor.professional_title}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatExperience(selectedMentor.years_of_experience)}{' '}
                  experience
                </span>
              </div>
            </div>
          </div>
          {getAvailabilityBadge(selectedMentor)}
        </div>

        {/* Rating - UPDATED with StarRating component */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Rating & Reviews</h4>
            <div className="flex items-center">
              <StarRating 
                rating={selectedMentor.rating} 
                size="md" 
                showNumber={true}
                showReviewsCount={false}
              />
              <Badge variant="outline" className="ml-2">
                {selectedMentor.reviews_count || 0} reviews
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Joined {formatDate(selectedMentor.created_at)}
          </p>
        </div>

        {/* Current Load */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Current Availability</h4>
            <span className="text-sm text-gray-600">
              {selectedMentor.current_assignments} of{' '}
              {selectedMentor.max_assignments || '∞'} slots filled
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{
                width: `${(selectedMentor.current_assignments / (selectedMentor.max_assignments || 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Expertise */}
        {mentorExpertise.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Areas of Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {mentorExpertise.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 border-gray-200 capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {selectedMentor.bio && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">About</h4>
            <p className="text-gray-700">{selectedMentor.bio}</p>
          </div>
        )}

        {/* LinkedIn Profile */}
        {selectedMentor.linkedin_profile && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Connect</h4>
            <a
              href={selectedMentor.linkedin_profile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-emerald-600 hover:text-emerald-700"
            >
              <Building className="h-5 w-5 mr-2" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        )}

        {/* Campaign Selection */}
        {!isCurrentUser && campaigns.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Assign to Campaign</h4>
            <Select
              value={selectedCampaignId?.toString() || ''}
              onValueChange={(value) => setSelectedCampaignId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id.toString()}>
                    {campaign.title} (ID: {campaign.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Modal Actions */}
        <div className="border-t pt-4 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsProfileModalOpen(false);
              setSelectedMentor(null);
            }}
          >
            Close
          </Button>
          {!isCurrentUser && campaigns.length > 0 && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => requestMentor(selectedMentor.id)}
              disabled={
                requestedMentors.includes(selectedMentor.id) ||
                !selectedCampaignId ||
                requestingState[selectedMentor.id]?.loading
              }
            >
              {requestingState[selectedMentor.id]?.loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Requesting...
                </>
              ) : requestedMentors.includes(selectedMentor.id) ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Request Sent
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Request Mentor
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold">
              Mentor Marketplace
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Find experienced mentors to guide your venture
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Badge
              variant="outline"
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm justify-center"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {mentors.length} Verified Mentors
            </Badge>
            <Button
              variant="outline"
              onClick={() => router.push('/account#Settings')}
              className="text-xs sm:text-sm h-9"
            >
              Become a Mentor
            </Button>
          </div>
        </div>

        {/* Campaign Info Card */}
        {campaigns.length > 0 && (
          <Card className="border shadow-sm bg-emerald-50 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Active Campaign{campaigns.length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-emerald-700">
                      {campaigns.length > 1
                        ? `Select a campaign to assign mentors to. Currently viewing ${campaigns[0].title}`
                        : `Assign mentors to: ${campaigns[0].title}`}
                    </p>
                  </div>
                </div>
                {campaigns.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    onClick={() => setSelectedCampaignId(campaigns[0].id)}
                  >
                    Change Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">
                  Find a Mentor
                </h3>
                <p className="text-sm text-gray-600">
                  Browse available mentors by expertise, rating, and experience
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search mentors by title, bio, or expertise..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  <Select
                    value={selectedExpertise}
                    onValueChange={setSelectedExpertise}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="All Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs sm:text-sm">
                        All Expertise
                      </SelectItem>
                      {availableTags.map((tag) => (
                        <SelectItem
                          key={tag}
                          value={tag}
                          className="text-xs sm:text-sm capitalize"
                        >
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Updated Rating Filter */}
                  <Select
                    value={minRating.toString()}
                    onValueChange={(v) => setMinRating(parseFloat(v))}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Min Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="text-xs sm:text-sm">
                        Any Rating
                      </SelectItem>
                      <SelectItem value="1" className="text-xs sm:text-sm">
                        1+ Stars
                      </SelectItem>
                      <SelectItem value="2" className="text-xs sm:text-sm">
                        2+ Stars
                      </SelectItem>
                      <SelectItem value="3" className="text-xs sm:text-sm">
                        3+ Stars
                      </SelectItem>
                      <SelectItem value="4" className="text-xs sm:text-sm">
                        4+ Stars
                      </SelectItem>
                      <SelectItem value="4.5" className="text-xs sm:text-sm">
                        4.5+ Stars
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={minExperience.toString()}
                    onValueChange={(v) => setMinExperience(parseInt(v))}
                  >
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Min Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" className="text-xs sm:text-sm">
                        Any Experience
                      </SelectItem>
                      <SelectItem value="5" className="text-xs sm:text-sm">
                        5+ Years
                      </SelectItem>
                      <SelectItem value="10" className="text-xs sm:text-sm">
                        10+ Years
                      </SelectItem>
                      <SelectItem value="15" className="text-xs sm:text-sm">
                        15+ Years
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={fetchMentors}
                    className="h-9 text-xs sm:text-sm"
                  >
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMentors.map((mentor) => {
            const isRequested = requestedMentors.includes(mentor.id);
            const isMentorAvailable =
              mentor.max_assignments === undefined ||
              mentor.max_assignments === null ||
              mentor.current_assignments < mentor.max_assignments;
            const isCurrentUser = isCurrentUserMentor(mentor);
            const mentorExpertise = expertiseMap[mentor.id] || [];
            const isRequesting = requestingState[mentor.id]?.loading;

            return (
              <Card
                key={mentor.id}
                className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Mentor Header - UPDATED with rating display */}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                        <AvatarFallback className="bg-gray-100 text-gray-800">
                          {getInitials(mentor.professional_title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg truncate">
                              {mentor.professional_title}
                            </h3>
                            {/* ADDED: Rating display directly under the title */}
                            <div className="flex items-center mt-1">
                              <StarRating 
                                rating={mentor.rating} 
                                size="sm" 
                                showNumber={true}
                                showReviewsCount={true}
                                reviewsCount={mentor.reviews_count || 0}
                              />
                            </div>
                          </div>
                          {getAvailabilityBadge(mentor)}
                        </div>
                      </div>
                    </div>

                    {/* Current Load - Updated to be more compact */}
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {mentor.current_assignments} of {mentor.max_assignments || '∞'} slots
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {formatExperience(mentor.years_of_experience)}
                        </span>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          Areas of Expertise
                        </h4>
                        <span className="text-xs text-gray-500">
                          {mentorExpertise.length} areas
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                        {mentorExpertise.length > 0 ? (
                          <>
                            {mentorExpertise.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border-gray-200 capitalize max-w-full truncate"
                                title={tag}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {mentorExpertise.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5"
                              >
                                +{mentorExpertise.length - 3} more
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            Expertise information loading...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio Preview */}
                    {mentor.bio && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 line-clamp-3 overflow-hidden">
                          {mentor.bio}
                        </p>
                      </div>
                    )}

                    {/* LinkedIn Profile */}
                    {mentor.linkedin_profile && (
                      <div className="pt-2 border-t">
                        <a
                          href={mentor.linkedin_profile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 group"
                        >
                          <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate flex-1">
                            LinkedIn Profile
                          </span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-row gap-2 pt-4 border-t mt-auto min-h-[36px]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-xs sm:text-sm min-w-0 basis-1/2 flex items-center justify-center"
                        onClick={() => handleViewProfile(mentor)}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">View Profile</span>
                      </Button>

                      {/* Show request button only if not current user's own profile */}
                      {!isCurrentUser && campaigns.length > 0 && (
                        <Button
                          size="sm"
                          className="flex-1 h-9 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 min-w-0 basis-1/2 flex items-center justify-center"
                          disabled={
                            isRequested ||
                            !isMentorAvailable ||
                            !selectedCampaignId ||
                            isRequesting
                          }
                          onClick={() => requestMentor(mentor.id)}
                        >
                          {isRequesting ? (
                            <>
                              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 animate-spin" />
                              <span className="truncate">Requesting...</span>
                            </>
                          ) : isRequested ? (
                            <>
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">Requested</span>
                            </>
                          ) : !isMentorAvailable ? (
                            <>
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">Unavailable</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">Request</span>
                            </>
                          )}
                        </Button>
                      )}

                      {/* No campaigns message */}
                      {!isCurrentUser && campaigns.length === 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-9 text-xs sm:text-sm min-w-0 basis-1/2 flex items-center justify-center"
                          onClick={() => {
                            showToast(
                              'No Active Campaigns',
                              'You need an active campaign to request a mentor. Create a campaign first.',
                              'error',
                            );
                            router.push('/campaigns/create');
                          }}
                        >
                          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">
                            Create Campaign First
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMentors.length === 0 && (
          <Card className="border shadow-sm">
            <CardContent className="py-8 sm:py-12 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm sm:text-base">
                {mentors.length === 0
                  ? 'No mentors are currently available. Check back soon!'
                  : 'Try adjusting your search filters to find mentors.'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExpertise('all');
                  setMinRating(0);
                  setMinExperience(0);
                  fetchMentors();
                }}
                className="text-xs sm:text-sm"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="border shadow-sm bg-gray-50">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-emerald-600" />
                How Mentor Assignments Work
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>Request a Mentor:</strong> Founders with active
                    campaigns can request mentors
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>Mentor Acceptance:</strong> Mentors review requests
                    and choose which ventures to support
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>Capacity Limits:</strong> Mentors can support up to
                    5 ventures simultaneously
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>Become a Mentor:</strong> Verified users can apply
                    to become mentors via Account → Settings → KYC
                  </span>
                </li>
              </ul>
              <div className="pt-2">
                <Button
                  variant="link"
                  className="text-emerald-600 hover:text-emerald-700 p-0 h-auto text-sm"
                  onClick={() => router.push('/help/mentorship')}
                >
                  Learn more about mentorship
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentor Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedMentor(null);
        }}
        size="large"
      >
        {selectedMentor &&
          (campaigns.length > 1 ? (
            <CampaignSelectionModal />
          ) : (
            <MentorProfileModal />
          ))}
      </Modal>

      {/* Toast Component */}
      <ToastComponent
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        description={toast.description}
        type={toast.type}
      />
    </>
  );
};

export default MentorMarketplace;