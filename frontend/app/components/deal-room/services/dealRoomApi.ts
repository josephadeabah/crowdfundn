// app/services/dealRoomApi.ts
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
  description: string;
  metrics: {
    revenue?: number;
    growth?: number;
    users?: number;
    mrr?: number;
  };
  documents: DealDocument[];  // Changed from {name: string, type: string}[]
  interested: number;
  meetings: number;
  status: 'Active' | 'Closing Soon' | 'Funded' | 'New';
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

  async getDealMeetings(dealId: string, token?: string): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/meetings`,
      {
        headers: this.getHeaders(token),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch meetings');
    }

    const data = await response.json();
    return data.meetings || [];
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

  async createMeeting(
    dealId: string,
    meetingData: {
      title: string;
      description: string;
      meeting_type: string;
      start_time: string;
      end_time: string;
      meeting_link?: string;
      notes?: string;
      participant_ids?: string[];
    },
    token: string,
  ): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/deal_rooms/${dealId}/create_meeting`,
      {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(meetingData),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to create meeting');
    }

    return response.json();
  }
}

export const dealRoomApi = new DealRoomApi();
