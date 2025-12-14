export interface DealDocument {
  id: string;
  name: string;
  type: string;
  files: Array<{
    url: string;
    filename: string;
    content_type: string;
    byte_size: number;
    human_size: string;
    uploaded_at: string;
  }>;
  required: boolean;
  uploaded_at: string;
}

export interface Deal {
  id: string;
  companyName: string;
  logo: string;
  tagline: string;
  industry: string;
  stage: string;
  targetRaise: number;
  currentRaise: number;
  minInvestment: number;
  valuation: number;
  investors: number;
  daysLeft: number;
  founderName: string;
  founderImage: string;
  founderTitle: string;
  highlights: string[];
  description: { body: string };
  metrics: {
    revenue?: number;
    growth?: number;
    users?: number;
    mrr?: number;
  };
  documents: DealDocument[];
  interested: number;
  meetings: number;
  status:
    | 'Active'
    | 'Closing Soon'
    | 'Funded'
    | 'New'
    | 'Closed'
    | 'Fully Funded';
  campaign?: {
    id: string;
    deal_room?: {
      id: string;
      name: string;
      member_count: number;
      is_member: boolean;
      can_join: boolean;
    };
  };
}

export interface DealRoomStats {
  totalDeals: number;
  activeDeals: number;
  totalRaised: number;
  avgDealSize: number;
  investorCount: number;
  successRate: number;
}

export interface ApiResponse<T> {
  deals?: T;
  data?: T;
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface DealRoomInfo {
  id: string;
  name: string;
  description: string;
  room_type: string;
  status: string;
  member_count: number;
  investor_count: number;
  interested_count: number;
  meetings_count: number;
  available_documents: number;
  conversations: number;
  is_member: boolean;
  can_join: boolean;
}

export interface DealRoomMember {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
  joined_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  meeting_type: string;
  status: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  duration_minutes: number;
  upcoming: boolean;
  ongoing: boolean;
  past: boolean;
  organizer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  participants: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    status: string;
    rsvp_at?: string;
  }>;
  can_edit: boolean;
  can_delete: boolean;
  participant_status?: string;
  deal_room_id: string;
  deal_room_name: string;
  formatted_start_time: string;
  formatted_end_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  all_day: boolean;
  color: string;
  meeting_type: string;
  status: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  formatted: string;
}

class DealRoomApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
      'http://localhost:3000/api/v1';
  }

  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getPublicDeals(
    token?: string,
    page: number = 1,
    perPage: number = 12,
    filters?: {
      industry?: string;
      stage?: string;
      search?: string;
    },
  ): Promise<ApiResponse<Deal[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(filters?.industry &&
        filters.industry !== 'All Industries' && {
          industry: filters.industry,
        }),
      ...(filters?.stage &&
        filters.stage !== 'All Stages' && { stage: filters.stage }),
      ...(filters?.search && { search: filters.search }),
    });

    const response = await fetch(
      `${this.baseUrl}/deal_rooms/public_deals?${params}`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }

    const data = await response.json();
    return {
      data: data.deals || [],
      current_page: data.current_page || 1,
      total_pages: data.total_pages || 1,
      total_count: data.total_count || 0,
    };
  }

  async getDealStats(token?: string): Promise<DealRoomStats> {
    const response = await fetch(`${this.baseUrl}/deal_rooms/stats`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deal stats');
    }

    return response.json();
  }

  async getIndustries(token?: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/deal_rooms/industries`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch industries');
    }

    const data = await response.json();
    return data.industries || [];
  }

  async getStages(token?: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/deal_rooms/stages`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stages');
    }

    const data = await response.json();
    return data.stages || [];
  }

  async getDealDetails(dealId: string, token?: string): Promise<Deal> {
    const response = await fetch(`${this.baseUrl}/deal_rooms/${dealId}`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch deal details');
    }

    const data = await response.json();
    return data;
  }

  async showInterest(
    dealId: string,
    token: string,
  ): Promise<{ message: string; interested: boolean }> {
    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/show_interest`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to show interest');
    }

    return response.json();
  }

  async joinDealRoom(
    dealId: string,
    token: string,
  ): Promise<{ message: string; membership: any }> {
    const response = await fetch(`${this.baseUrl}/deal_rooms/${dealId}/join`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to join deal room');
    }

    return response.json();
  }

  async getDealDocuments(dealId: string, token?: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/documents`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const data = await response.json();
    return data.documents || [];
  }

  async getDealConversations(dealId: string, token?: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/conversations`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    const data = await response.json();
    return data.conversations || [];
  }

  async createConversation(
    dealId: string,
    title: string,
    token: string,
    isPrivate: boolean = false,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/create_conversation`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ title, private: isPrivate }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    return response.json();
  }

  // Simplified function for getting meetings
  async getDealMeetings(
    dealId: string,
    token?: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/meetings?${params}`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }

    return response.json();
  }

  async getMeetingCalendar(
    dealId: string,
    startDate: string,
    endDate: string,
    token?: string,
  ): Promise<any> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });

    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/meetings/calendar?${params}`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch calendar');
    }

    return response.json();
  }

  async getMeetingAvailability(
    dealId: string,
    date: string,
    duration: number,
    participantIds: string[],
    token?: string,
  ): Promise<any> {
    const params = new URLSearchParams({
      date,
      duration: duration.toString(),
      participant_ids: participantIds.join(','),
    });

    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/meetings/availability?${params}`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    return response.json();
  }

  async createMeeting(
    meetingData: {
      deal_room_id: string;
      title: string;
      description?: string;
      meeting_type: string;
      start_time: string;
      end_time: string;
      meeting_link: string;
      notes?: string;
    },
    token: string,
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/deal_room_meetings`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ deal_room_meeting: meetingData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Failed to create meeting');
    }

    return response.json();
  }

  async updateMeeting(
    meetingId: string,
    meetingData: {
      title?: string;
      description?: string;
      meeting_type?: string;
      start_time?: string;
      end_time?: string;
      meeting_link?: string;
      notes?: string;
      participant_ids?: string[];
    },
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}`,
      {
        method: 'PUT',
        headers: this.getHeaders(token),
        body: JSON.stringify(meetingData),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Failed to update meeting');
    }

    return response.json();
  }

  async deleteMeeting(meetingId: string, token: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete meeting');
    }

    return response.json();
  }

  // Check your getDealRoomMembers method in DealRoomApi class:
  async getDealRoomMembers(
    dealId: string,
    token?: string,
    page: number = 1,
    perPage: number = 50,
  ): Promise<ApiResponse<DealRoomMember[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/members?${params}`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      // Log more details about the error
      console.error('Members endpoint error:', {
        status: response.status,
        statusText: response.statusText,
        url: `${this.baseUrl}/deal_rooms/${dealId}/members?${params}`
      });
      
      try {
        const errorData = await response.json();
        console.error('Error data:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
      
      throw new Error('Failed to fetch deal room members');
    }

    const data = await response.json();
    console.log('Members response:', data); // Add this for debugging
    
    // Make sure we're returning the right structure
    return {
      data: data.members || data.data || [],  // Try both 'members' and 'data' keys
      current_page: data.current_page || 1,
      total_pages: data.total_pages || 1,
      total_count: data.total_count || 0,
    };
  }

  async startMeeting(meetingId: string, token: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/start`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to start meeting');
    }

    return response.json();
  }

  async endMeeting(meetingId: string, token: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/end`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to end meeting');
    }

    return response.json();
  }

  async cancelMeeting(
    meetingId: string,
    reason: string,
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/cancel`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ reason }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to cancel meeting');
    }

    return response.json();
  }

  async rescheduleMeeting(
    meetingId: string,
    newStartTime: string,
    newEndTime: string,
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/reschedule`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({
          new_start_time: newStartTime,
          new_end_time: newEndTime,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to reschedule meeting');
    }

    return response.json();
  }

  async addMeetingParticipants(
    meetingId: string,
    participantIds: string[],
    participantEmails: string[] = [],
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/add_participants`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({
          participant_ids: participantIds,
          participant_emails: participantEmails,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to add participants');
    }

    return response.json();
  }

  async removeMeetingParticipant(
    meetingId: string,
    userId: string,
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/remove_participant/${userId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to remove participant');
    }

    return response.json();
  }

  async rsvpToMeeting(
    meetingId: string,
    status: 'accepted' | 'declined' | 'tentative',
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/rsvp`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to RSVP');
    }

    return response.json();
  }

  async getUpcomingMeetings(token: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/my/meetings/upcoming`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming meetings');
    }

    return response.json();
  }

  async updateMeetingAttendance(
    meetingId: string,
    attendance: Record<string, 'attended' | 'no_show'>,
    token: string,
  ): Promise<{ message: string; meeting: Meeting }> {
    const response = await fetch(
      `${this.baseUrl}/deal_room_meetings/${meetingId}/attendance`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ attendance }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update attendance');
    }

    return response.json();
  }
}

export const dealRoomApi = new DealRoomApi();
