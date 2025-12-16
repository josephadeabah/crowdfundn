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
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useToast } from '@/app/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface Mentor {
  id: number;
  user: {
    id: number;
    full_name: string;
    profile?: {
      avatar_url?: string;
    };
  };
  professional_title: string;
  years_of_experience: number;
  rating: number;
  reviews_count: number;
  current_assignments: number;
  max_assignments?: number;
  expertise: string[];
  bio?: string;
  linkedin_profile?: string;
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
  const [expertiseTags, setExpertiseTags] = useState<string[]>([]);
  const [requestedMentors, setRequestedMentors] = useState<number[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    fetchMentors();
  }, [token]);

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
        const mentorsData = await mentorsRes.json();
        setMentors(mentorsData.mentors || []);

        // Extract unique expertise tags
        const allTags = new Set<string>();
        mentorsData.mentors?.forEach((mentor: Mentor) => {
          mentor.expertise?.forEach((tag) => allTags.add(tag));
        });
        setExpertiseTags(Array.from(allTags));
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
    const matchesSearch =
      searchQuery === '' ||
      mentor.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.professional_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesExpertise =
      selectedExpertise === 'all' ||
      mentor.expertise.includes(selectedExpertise);
    const matchesRating = mentor.rating >= minRating;
    const matchesExperience = mentor.years_of_experience >= minExperience;

    return (
      matchesSearch && matchesExpertise && matchesRating && matchesExperience
    );
  });

  const getAvailabilityBadge = (mentor: Mentor) => {
    if (mentor.max_assignments === undefined) {
      return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    }

    const availability =
      ((mentor.max_assignments - mentor.current_assignments) /
        mentor.max_assignments) *
      100;

    if (availability >= 50) {
      return (
        <Badge className="bg-green-100 text-green-800">Highly Available</Badge>
      );
    } else if (availability >= 25) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          Limited Availability
        </Badge>
      );
    } else {
      return <Badge className="bg-red-100 text-red-800">Fully Booked</Badge>;
    }
  };

  const renderStars = (rating: number, reviewsCount: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({reviewsCount} reviews)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mentor Marketplace</h2>
          <p className="text-gray-600">
            Find experienced mentors to guide your venture
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {mentors.length} Verified Mentors
          </Badge>
          <Button
            variant="outline"
            onClick={() => router.push('/account/settings#KYC')}
          >
            Become a Mentor
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find a Mentor</CardTitle>
          <CardDescription>
            Browse available mentors by expertise, rating, and experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search mentors by name, title, or expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={selectedExpertise}
                  onValueChange={setSelectedExpertise}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>
                    {expertiseTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={minRating.toString()}
                  onValueChange={(v) => setMinRating(parseFloat(v))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={minExperience.toString()}
                  onValueChange={(v) => setMinExperience(parseInt(v))}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Min Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Experience</SelectItem>
                    <SelectItem value="5">5+ Years</SelectItem>
                    <SelectItem value="10">10+ Years</SelectItem>
                    <SelectItem value="15">15+ Years</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchMentors}>
                  <Filter className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => {
          const isRequested = requestedMentors.includes(mentor.id);
          const isMentorAvailable =
            mentor.max_assignments === undefined ||
            mentor.current_assignments < mentor.max_assignments;

          return (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.user.profile?.avatar_url} />
                      <AvatarFallback>
                        {mentor.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {mentor.user.full_name}
                      </CardTitle>
                      <CardDescription>
                        {mentor.professional_title}
                      </CardDescription>
                    </div>
                  </div>
                  {getAvailabilityBadge(mentor)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                {renderStars(mentor.rating, mentor.reviews_count)}

                {/* Experience */}
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {mentor.years_of_experience}+ years experience
                </div>

                {/* Current Load */}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {mentor.current_assignments} of{' '}
                  {mentor.max_assignments || '∞'} active assignments
                </div>

                {/* Expertise */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bio Preview */}
                {mentor.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {mentor.bio}
                  </p>
                )}

                {/* LinkedIn Profile */}
                {mentor.linkedin_profile && (
                  <div className="flex items-center text-sm text-blue-600">
                    <Building className="h-4 w-4 mr-2" />
                    <a
                      href={mentor.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // View mentor details
                      router.push(`/mentors/${mentor.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={isRequested || !isMentorAvailable}
                    onClick={() => requestMentor(mentor.id)}
                  >
                    {isRequested ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Requested
                      </>
                    ) : !isMentorAvailable ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Unavailable
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Request Mentor
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMentors.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No mentors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search filters or check back later for new
              mentors.
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
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-900">
              How Mentor Assignments Work
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Request a Mentor:</strong> Founders with active
                  campaigns can request mentors
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Mentor Acceptance:</strong> Mentors review requests
                  and choose which ventures to support
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Capacity Limits:</strong> Mentors can support up to 5
                  ventures simultaneously
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Become a Mentor:</strong> Verified users can apply to
                  become mentors via Account → Settings → KYC
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorMarketplace;
