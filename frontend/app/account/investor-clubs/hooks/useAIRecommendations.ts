import { useState } from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  AIRecommendation,
  aiRecommendationService,
} from '../aiRecommendationService';
import { AIRecommendationsState } from '../types/dashboardTypes';

export const useAIRecommendations = () => {
  const { token } = useAuth();
  const [state, setState] = useState<AIRecommendationsState>({
    recommendations: [],
    showAIRecommendations: false,
    loading: false,
    clubRiskProfile: null,
  });

  const loadAIRecommendations = async (clubId: string) => {
    if (!token) return;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      const response = await aiRecommendationService.getRecommendations(
        token,
        clubId,
        5,
      );
      if (response.success) {
        setState((prev) => ({
          ...prev,
          recommendations: response.recommendations,
          clubRiskProfile: response.club_risk_profile,
        }));
      }
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const loadClubRiskProfile = async (clubId: string) => {
    if (!token) return;

    try {
      const response = await aiRecommendationService.getRiskProfile(
        token,
        clubId,
      );
      if (response.success) {
        setState((prev) => ({
          ...prev,
          clubRiskProfile: response.risk_profile,
        }));
      }
    } catch (error) {
      console.error('Failed to load club risk profile:', error);
    }
  };

  const setShowAIRecommendations = (show: boolean) => {
    setState((prev) => ({ ...prev, showAIRecommendations: show }));
  };

  return {
    ...state,
    // Return loading instead of recommendationsLoading for consistency
    loadAIRecommendations,
    loadClubRiskProfile,
    setShowAIRecommendations,
  };
};
