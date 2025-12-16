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
  Briefcase,
  MessageSquare,
  UserPlus,
  XCircle,
  CheckCircle,
  Globe,
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
import { useToast } from '@/app/components/ui/use-toast';
import { useRouter } from 'next/navigation';

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
  expertise?: string[]; // This might not come from API
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

const MentorMarketplace: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    fetchMentors();
  }, [token]);

  // Fetch mentor expertise separately since it's not in the main response
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

      // Fetch all available mentors
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

        // Use expertise tags from filters
        if (mentorsData.filters?.expertise_tags) {
          setAvailableTags(mentorsData.filters.expertise_tags);
        }

        // Fetch expertise for each mentor in parallel
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
        toast({
          title: 'Error',
          description: 'Failed to load mentors',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const requestMentor = async (mentorId: number) => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'You must be logged in to request a mentor',
        variant: 'destructive',
      });
      return;
    }

    try {
      // First, check if user has campaigns
      const campaignsRes = await fetch(
        `${API_BASE_URL}/fundraisers/campaigns/my_campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!campaignsRes.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const campaignsData = await campaignsRes.json();
      const activeCampaigns =
        campaignsData.campaigns?.filter((c: any) => c.status === 'active') ||
        [];

      if (activeCampaigns.length === 0) {
        toast({
          title: 'No Active Campaigns',
          description: 'You need an active campaign to request a mentor.',
          variant: 'destructive',
        });

        // Offer to create a campaign
        if (confirm('Would you like to create a campaign first?')) {
          router.push('/campaigns/create');
        }
        return;
      }

      // If multiple campaigns, let user choose
      let campaignId: number;
      if (activeCampaigns.length === 1) {
        campaignId = activeCampaigns[0].id;
      } else {
        // In a real app, you'd show a modal to choose campaign
        // For now, use the first active campaign
        campaignId = activeCampaigns[0].id;
      }

      const response = await fetch(
        `${API_BASE_URL}/mentor/campaigns/${campaignId}/assignments/request_mentor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentor_id: mentorId,
            notes: `Mentor request from ${user?.full_name}`,
          }),
        },
      );

      if (response.ok) {
        setRequestedMentors([...requestedMentors, mentorId]);
        toast({
          title: 'Success',
          description: 'Mentor request sent successfully',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to request mentor',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting mentor:', error);
      toast({
        title: 'Error',
        description: 'Failed to request mentor',
        variant: 'destructive',
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
        <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">
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
        <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">
          Highly Available
        </Badge>
      );
    } else if (availability >= 25) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">
          Limited Availability
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-0 text-xs">
          Fully Booked
        </Badge>
      );
    }
  };

  const renderStars = (rating: number | string, reviewsCount: number) => {
    const ratingValue =
      typeof rating === 'string' ? parseFloat(rating) : rating;

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 sm:h-4 sm:w-4 ${
              star <= Math.floor(ratingValue)
                ? 'text-yellow-400 fill-yellow-400'
                : star <= ratingValue
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-xs sm:text-sm text-gray-600">
          {ratingValue.toFixed(1)} ({reviewsCount} reviews)
        </span>
      </div>
    );
  };

  const getInitials = (title: string) => {
    // Get initials from professional title
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold">Mentor Marketplace</h2>
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

      {/* Search and Filters - Responsive */}
      <Card className="border-0 shadow-none">
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
              {/* Search Input - Full width on mobile, flex on desktop */}
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

              {/* Filters - Responsive grid */}
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

      {/* Mentors Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredMentors.map((mentor) => {
          const isRequested = requestedMentors.includes(mentor.id);
          const isMentorAvailable =
            mentor.max_assignments === undefined ||
            mentor.max_assignments === null ||
            mentor.current_assignments < mentor.max_assignments;

          const mentorExpertise = expertiseMap[mentor.id] || [];

          return (
            <Card
              key={mentor.id}
              className="border-0 shadow-none hover:bg-gray-50 transition-colors"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Mentor Header - Stack on mobile, row on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0">
                        <AvatarFallback className="bg-emerald-100 text-emerald-800">
                          {getInitials(mentor.professional_title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg truncate">
                          {mentor.professional_title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span>
                            {formatExperience(mentor.years_of_experience)}{' '}
                            experience
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-between sm:justify-start items-start sm:items-end gap-2">
                      {getAvailabilityBadge(mentor)}
                      <div className="text-xs text-gray-500 sm:text-right">
                        <div className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {mentor.current_assignments}/
                          {mentor.max_assignments || '∞'} slots
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  {renderStars(mentor.rating, mentor.reviews_count)}

                  {/* Expertise - Now shows actual expertise */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        Areas of Expertise
                      </h4>
                      <span className="text-xs text-gray-500">
                        {mentorExpertise.length} areas
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentorExpertise.length > 0 ? (
                        <>
                          {mentorExpertise.slice(0, 4).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200 capitalize"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {mentorExpertise.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              +{mentorExpertise.length - 4} more
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
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {mentor.bio}
                      </p>
                    </div>
                  )}

                  {/* LinkedIn Profile with proper link icon */}
                  {mentor.linkedin_profile && (
                    <div className="pt-2 border-t">
                      <a
                        href={mentor.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 group"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        <span className="flex-1">LinkedIn Profile</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  )}

                  {/* Actions - Responsive buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs sm:text-sm"
                      onClick={() => {
                        router.push(`/mentors/${mentor.id}`);
                      }}
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-9 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700"
                      disabled={isRequested || !isMentorAvailable}
                      onClick={() => requestMentor(mentor.id)}
                    >
                      {isRequested ? (
                        <>
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Requested</span>
                          <span className="sm:hidden">Sent</span>
                        </>
                      ) : !isMentorAvailable ? (
                        <>
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Unavailable</span>
                          <span className="sm:hidden">Full</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Request Mentor
                          </span>
                          <span className="sm:hidden">Request</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMentors.length === 0 && (
        <Card className="border-0 shadow-none">
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

      {/* Information Card - Updated with emerald colors */}
      <Card className="border-0 bg-emerald-50">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-emerald-900 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              How Mentor Assignments Work
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-emerald-800">
                  <strong>Request a Mentor:</strong> Founders with active
                  campaigns can request mentors
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-emerald-800">
                  <strong>Mentor Acceptance:</strong> Mentors review requests
                  and choose which ventures to support
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-emerald-800">
                  <strong>Capacity Limits:</strong> Mentors can support up to 5
                  ventures simultaneously
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-emerald-800">
                  <strong>Become a Mentor:</strong> Verified users can apply to
                  become mentors via Account → Settings → KYC
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
  );
};

export default MentorMarketplace;
