// app/components/fundraising/MentorTab.tsx
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
  Clock,
  CheckCircle,
  MessageSquare,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useToast } from '@/app/components/ui/use-toast';

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

interface MentorAssignment {
  id: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  mentor: Mentor;
  started_at?: string;
  completed_at?: string;
  rating?: number;
  feedback?: string;
}

interface MentorTabProps {
  campaignId: number;
}

const MentorTab: React.FC<MentorTabProps> = ({ campaignId }) => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [expertiseTags, setExpertiseTags] = useState<string[]>([]);
  const [canRequestMentor, setCanRequestMentor] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    fetchMentorData();
  }, [campaignId, token]);

  const fetchMentorData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Fetch current assignments
      const assignmentsRes = await fetch(
        `${API_BASE_URL}/mentor/campaigns/${campaignId}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.assignments || []);
        setCanRequestMentor(assignmentsData.can_request_mentor || false);
      } else {
        console.error('Failed to fetch assignments:', assignmentsRes.status);
      }

      // Fetch available mentors with filters - Use the general mentors endpoint
      const params = new URLSearchParams();
      if (selectedExpertise) params.append('expertise', selectedExpertise);
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
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor data',
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
            notes: `Mentor request for campaign ${campaignId}`,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Mentor request sent successfully',
        });
        fetchMentorData(); // Refresh data
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
      !selectedExpertise ||
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
            {assignments.filter((a) => a.status === 'active').length} Active
            Mentors
          </Badge>
        </div>
      </div>

      {/* Current Assignments */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Mentor Assignments</CardTitle>
            <CardDescription>
              Mentors currently working with your venture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={assignment.mentor.user.profile?.avatar_url}
                      />
                      <AvatarFallback>
                        {assignment.mentor.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {assignment.mentor.user.full_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {assignment.mentor.professional_title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(
                          assignment.mentor.rating,
                          assignment.mentor.reviews_count,
                        )}
                        <Badge
                          className={
                            assignment.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : assignment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {assignment.status.charAt(0).toUpperCase() +
                            assignment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    {assignment.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <div className="flex space-x-2">
                <Select
                  value={selectedExpertise}
                  onValueChange={setSelectedExpertise}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>{' '}
                    {/* Changed from "" to "all" */}
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
                <Button variant="outline" onClick={fetchMentorData}>
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
          const isAlreadyAssigned = assignments.some(
            (a) =>
              a.mentor.id === mentor.id &&
              ['pending', 'active'].includes(a.status),
          );
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

                {/* Actions */}
                <div className="flex space-x-2 pt-4">
                  {canRequestMentor ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // View mentor details
                          window.location.href = `/mentors/${mentor.id}`;
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={isAlreadyAssigned || !isMentorAvailable}
                        onClick={() => requestMentor(mentor.id)}
                      >
                        {isAlreadyAssigned ? (
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
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        window.location.href = `/mentors/${mentor.id}`;
                      }}
                    >
                      View Mentor Profile
                    </Button>
                  )}
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
                setSelectedExpertise('');
                setMinRating(0);
                setMinExperience(0);
                fetchMentorData();
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
                  <strong>Request a Mentor:</strong> Founders can request up to
                  3 mentors per venture
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
                  <strong>Optimized Matching:</strong> Our system ensures
                  mentors aren't overloaded (max 5 ventures each)
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Flexible Engagement:</strong> Mentors provide guidance
                  on strategy, fundraising, and growth
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Performance Tracking:</strong> Rate your mentor after
                  each engagement to help others
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorTab;
