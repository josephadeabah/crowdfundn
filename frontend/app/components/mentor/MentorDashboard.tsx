// app/components/mentor/MentorDashboard.tsx
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
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import {
  Users,
  Briefcase,
  Star,
  Clock,
  CheckCircle,
  MessageSquare,
  Calendar,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';
import { useToast } from '@/app/components/ui/use-toast';

interface MentorDashboardProps {
  mentorId?: number;
}

const MentorDashboard: React.FC<MentorDashboardProps> = ({ mentorId }) => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  useEffect(() => {
    fetchDashboardData();
  }, [mentorId, token]);

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/mentor/mentors/my_mentor_profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor dashboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMaxAssignments = async (newMax: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/mentor/mentors/update_availability`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            max_assignments: newMax,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Maximum assignments updated successfully',
        });
        fetchDashboardData();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update maximum assignments',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating max assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to update maximum assignments',
        variant: 'destructive',
      });
    }
  };

  const toggleAvailability = async () => {
    if (!token || !dashboardData?.mentor) return;

    const newStatus =
      dashboardData.mentor.status === 'approved' ? 'inactive' : 'approved';

    try {
      const response = await fetch(
        `${API_BASE_URL}/mentor/mentors/update_availability`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Status updated to ${newStatus === 'approved' ? 'Available' : 'Unavailable'}`,
        });
        fetchDashboardData();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update availability',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Not a Mentor Yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't applied to become a mentor yet.
          </p>
          <Button
            onClick={() => {
              window.location.href = '/kyc?type=mentor';
            }}
          >
            Apply to Become a Mentor
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { mentor, assignments, statistics } = dashboardData;

  const activeAssignments = assignments.filter(
    (a: any) => a.status === 'active',
  );
  const pendingRequests = assignments.filter(
    (a: any) => a.status === 'pending',
  );
  const completedAssignments = assignments.filter(
    (a: any) => a.status === 'completed',
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mentor Dashboard</h2>
          <p className="text-gray-600">
            Manage your mentorship assignments and profile
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="px-3 py-1 bg-blue-100 text-blue-800">
            <Award className="h-4 w-4 mr-1" />
            {mentor.rating.toFixed(1)} Rating
          </Badge>
          <Button
            variant="outline"
            onClick={() => {
              // Navigate to profile edit
              window.location.href = '/mentor/profile/edit';
            }}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Assignments
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  {activeAssignments.length}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Capacity</span>
                <span>
                  {mentor.current_assignments}/{mentor.max_assignments || '∞'}
                </span>
              </div>
              <Progress
                value={
                  (mentor.current_assignments / (mentor.max_assignments || 1)) *
                  100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Requests
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  {pendingRequests.length}
                </h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Navigate to pending requests
                  window.location.href = '/mentor/requests';
                }}
              >
                Review Requests
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <h3 className="text-2xl font-bold mt-2">
                  {completedAssignments.length}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>Average Rating: {mentor.rating.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Impact
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  {statistics.total_assignments}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Ventures mentored</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Mentorships</CardTitle>
          <CardDescription>Ventures you're currently mentoring</CardDescription>
        </CardHeader>
        <CardContent>
          {activeAssignments.length > 0 ? (
            <div className="space-y-4">
              {activeAssignments.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {assignment.campaign.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Founder: {assignment.campaign.fundraiser_name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Started:{' '}
                          {new Date(assignment.started_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        // Complete assignment
                        window.location.href = `/mentor/assignment/${assignment.id}/complete`;
                      }}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">No Active Assignments</h4>
              <p className="text-gray-600 mb-4">
                You don't have any active mentorship assignments.
              </p>
              <Button variant="outline">View Available Requests</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {completedAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>
              Feedback from your completed mentorships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedAssignments
                .filter((a: any) => a.rating)
                .slice(0, 3)
                .map((assignment: any) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {assignment.campaign.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {assignment.campaign.fundraiser_name}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= assignment.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {assignment.feedback && (
                      <p className="text-gray-600 mt-2 text-sm">
                        "{assignment.feedback}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Completed on{' '}
                      {new Date(assignment.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability Management */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>
            Control your mentorship capacity and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">
                  Maximum Concurrent Assignments
                </h4>
                <p className="text-sm text-gray-600">
                  Set how many ventures you can mentor at once
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">
                  {mentor.max_assignments || 'Unlimited'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Update max assignments
                    const newMax = prompt(
                      'Enter maximum concurrent assignments:',
                      mentor.max_assignments?.toString() || '5',
                    );
                    if (newMax) {
                      const parsedMax = parseInt(newMax);
                      if (!isNaN(parsedMax) && parsedMax > 0) {
                        updateMaxAssignments(parsedMax);
                      } else {
                        toast({
                          title: 'Error',
                          description: 'Please enter a valid positive number',
                          variant: 'destructive',
                        });
                      }
                    }
                  }}
                >
                  Change
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Mentor Status</h4>
                <p className="text-sm text-gray-600">
                  {mentor.status === 'approved'
                    ? 'Available for new assignments'
                    : 'Not accepting new assignments'}
                </p>
              </div>
              <Button
                variant={mentor.status === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleAvailability}
              >
                {mentor.status === 'approved'
                  ? 'Set as Unavailable'
                  : 'Set as Available'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDashboard;
