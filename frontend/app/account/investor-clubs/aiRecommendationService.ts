// app/account/investor-clubs/aiRecommendationService.ts
export interface AIRecommendation {
  campaign: {
    id: string;
    title: string;
    category: string;
    description: string;
    goal_amount: number;
    current_amount: number;
    performance_percentage: number;
    currency: string;
    location: string;
    status: string;
    ai_deal_score: number | null;
    ai_risk_score: number | null;
    ai_risk_category: string | null;
    fundraiser: {
      id: string;
      name: string;
      kyc_verified: boolean;
    };
    media_url: string | null;
    total_donors: number;
    remaining_days: number;
  };
  match_score: number;
  reasoning: string;
  key_alignment_factors: string[];
  potential_concerns: string[];
  ai_analysis_available: boolean;
  quick_assessment: {
    risk_alignment: string;
    strategic_fit: string;
    financial_suitability: string;
  };
}

export interface ExplanationResponse {
  success: boolean;
  explanation:
    | string
    | {
        explanation: string;
        alignment_summary?: {
          risk_alignment: string;
          strategic_fit: string;
          financial_fit: string;
        };
        key_considerations?: string[];
        recommendation_strength?: string;
      };
  club_alignment?: any;
  key_factors?: string[];
  campaign?: any;
  error?: string;
  fallback_explanation?: string;
}

export interface RiskProfile {
  name: string;
  mission: string;
  investment_focus: string;
  risk_tolerance: string;
  mission_alignment: any;
  historical_investments: any;
  member_preferences: any;
  financial_constraints: any;
}

class AIRecommendationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';
  }

  async getRecommendations(
    token: string,
    clubId: string,
    limit: number = 10,
    riskTolerance?: string,
    investmentFocus?: string,
  ): Promise<{
    success: boolean;
    recommendations: AIRecommendation[];
    matching_criteria: any;
    total_considered: number;
    club_risk_profile: RiskProfile;
  }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(riskTolerance && { risk_tolerance: riskTolerance }),
        ...(investmentFocus && { investment_focus: investmentFocus }),
      });

      const response = await fetch(
        `${this.baseUrl}/investment_clubs/${clubId}/ai_recommendations?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Recommendation API Error:', errorText);
        throw new Error(
          `Failed to fetch AI recommendations: ${response.status}`,
        );
      }

      const data = await response.json();

      // DEBUG: Log what we received
      console.log('AI Recommendations Response:', data);

      if (data.success && data.recommendations) {
        // Verify we have campaign data
        data.recommendations.forEach((rec: any, index: number) => {
          if (!rec.campaign || !rec.campaign.title) {
            console.error(`Invalid recommendation at index ${index}:`, rec);
          } else {
            console.log(
              `Recommendation ${index}:`,
              rec.campaign.title,
              rec.campaign.category,
            );
          }
        });
      }

      return data;
    } catch (error) {
      console.error('AI Recommendation Service Error:', error);
      throw error;
    }
  }

  async getExplanation(
    token: string,
    clubId: string,
    campaignId: string,
    timeoutMs: number = 45000, // 45 second timeout
  ): Promise<ExplanationResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(`Fetching explanation for campaign ${campaignId}...`);

      const response = await fetch(
        `${this.baseUrl}/investment_clubs/${clubId}/ai_recommendations/explain?campaign_id=${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `Explanation API error: ${response.status} ${response.statusText}`,
        );
        throw new Error(`Failed to fetch explanation: ${response.status}`);
      }

      const data = await response.json();
      console.log('Explanation API response:', data);

      // Handle different response structures
      if (data.success) {
        // Case 1: explanation is a string
        if (typeof data.explanation === 'string') {
          return {
            success: true,
            explanation: {
              explanation: data.explanation,
              alignment_summary: data.club_alignment,
              key_considerations: data.key_factors,
              recommendation_strength: 'moderate',
            },
            club_alignment: data.club_alignment,
            key_factors: data.key_factors,
            campaign: data.campaign,
          };
        }
        // Case 2: explanation is an object
        else if (
          typeof data.explanation === 'object' &&
          data.explanation.explanation
        ) {
          return data;
        }
        // Case 3: malformed response but has fallback
        else if (data.fallback_explanation) {
          return {
            success: false,
            explanation: {
              explanation: data.fallback_explanation,
            },
            fallback_explanation: data.fallback_explanation,
            error: 'Malformed explanation response',
          };
        }
      }

      // If we get here, the response wasn't as expected
      throw new Error('Unexpected response format from explanation API');
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Error fetching explanation:', error);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout - explanation generation took too long',
          fallback_explanation:
            'The AI explanation is taking longer than expected to generate. Please try again in a moment.',
          explanation: {
            explanation:
              'The AI explanation is taking longer than expected to generate. Please try again in a moment.',
          },
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to fetch explanation',
        fallback_explanation:
          'Unable to generate detailed analysis at this time. Please try again later.',
        explanation: {
          explanation:
            'Unable to generate detailed analysis at this time. Please try again later.',
        },
      };
    }
  }

  async getRiskProfile(
    token: string,
    clubId: string,
  ): Promise<{
    success: boolean;
    risk_profile: RiskProfile;
    club: any;
  }> {
    const response = await fetch(
      `${this.baseUrl}/investment_clubs/${clubId}/ai_recommendations/risk_profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch risk profile');
    }

    return await response.json();
  }

  // Helper method to format match score for display
  formatMatchScore(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  // Helper method to get color for match score
  getMatchScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  // Helper method to format risk alignment
  formatRiskAlignment(alignment: string): string {
    const mapping: { [key: string]: string } = {
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk',
      unknown: 'Risk Unknown',
    };
    return mapping[alignment] || alignment;
  }

  // Extract explanation text from various response formats
  extractExplanationText(
    explanationData: ExplanationResponse['explanation'],
  ): string {
    if (typeof explanationData === 'string') {
      return explanationData;
    } else if (
      explanationData &&
      typeof explanationData === 'object' &&
      explanationData.explanation
    ) {
      return explanationData.explanation;
    }
    return 'No explanation available.';
  }
}

export const aiRecommendationService = new AIRecommendationService();
