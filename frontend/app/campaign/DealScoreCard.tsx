// app/components/campaign/DealScoreCard.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisHistoryModal } from './AnalysisHistoryModal';
import { SimilarDealsModal } from './SimilarDealsModal';
import { DealScoreChart } from './DealScoreChart';
import { useAuth } from '../context/auth/AuthContext';
import { usePremium } from '../context/premium/PremiumContext';

interface DealScoreCardProps {
  campaignId: string;
  currentUser?: any;
}

interface AnalysisData {
  current_scores: {
    deal_score: number;
    risk_score: number;
    risk_category: string;
    sentiment_analysis: string;
    team_assessment: string;
    market_opportunity: string;
    funding_potential: string;
    timing_assessment: string;
    competitive_advantage: string;
    exit_potential: string;
    updated_at: string;
  };
  analysis_history: Array<{
    id: string;
    analysis_type: string;
    deal_score: number;
    risk_score: number;
    risk_category: string;
    analyzed_at: string;
    downside_risks: string[];
    upside_potential: string[];
    strengths: string[];
    sentiment_analysis: string;
    team_assessment: string;
    market_opportunity: string;
    investment_thesis: string;
    funding_potential: string;
    timing_assessment: string;
    competitive_advantage: string;
    exit_potential: string;
    scalability_assessment: string;
    product_market_fit: string;
    technology_assessment: string;
    regulatory_risks: string[];
    market_trends: string[];
    investor_alignment: string;
    social_impact: string;
    sustainability_score: number;
  }>;
  latest_analysis?: {
    downside_risks: string[];
    upside_potential: string[];
    strengths: string[];
    sentiment_analysis: string;
    team_assessment: string;
    market_opportunity: string;
    investment_thesis: string;
    funding_potential: string;
    timing_assessment: string;
    competitive_advantage: string;
    exit_potential: string;
    scalability_assessment: string;
    product_market_fit: string;
    technology_assessment: string;
    regulatory_risks: string[];
    market_trends: string[];
    investor_alignment: string;
    social_impact: string;
    sustainability_score: number;
  };
}

export const DealScoreCard: React.FC<DealScoreCardProps> = ({
  campaignId,
  currentUser,
}) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSimilarDeals, setShowSimilarDeals] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [partialAnalysis, setPartialAnalysis] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const { subscription, fetchSubscription } = usePremium();
  const hasPremium = subscription?.has_premium;
  const { token, user } = useAuth();

  useEffect(() => {
    if (campaignId) {
      loadAnalysis();
      fetchSubscription();
    }
  }, [campaignId, fetchSubscription]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/ai_scoring/deal_scoring/analysis_history?campaign_id=${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (err) {
      setError('Failed to load analysis');
      console.error('Error loading analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/ai_scoring/deal_scoring/analyze`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campaign_id: campaignId }),
        },
      );

      const result = await response.json();

      if (result.success) {
        await loadAnalysis(); // Reload to get updated data
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to run analysis');
      console.error('Error running analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const runStreamingAnalysis = async () => {
    try {
      setLoading(true);
      setIsStreaming(true);
      setStreamedContent('');
      setPartialAnalysis(null);
      setError(null);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/ai_scoring/deal_scoring/streaming_analyze?campaign_id=${campaignId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last incomplete line

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix
              if (data.trim() === '') continue; // Skip empty lines
              
              try {
                const parsed = JSON.parse(data);
                
                switch (parsed.type) {
                  case 'chunk':
                    setStreamedContent(prev => prev + parsed.content);
                    break;
                    
                  case 'complete':
                    setIsStreaming(false);
                    setLoading(false);
                    setPartialAnalysis(parsed.data);
                    loadAnalysis();
                    break;
                    
                  case 'error':
                    setIsStreaming(false);
                    setLoading(false);
                    setError(parsed.message);
                    break;
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError, 'Data:', data);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Streaming analysis was cancelled');
      } else {
        setIsStreaming(false);
        setLoading(false);
        setError('Failed to start streaming analysis');
        console.error('Error starting streaming analysis:', err);
      }
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setLoading(false);
  };

  // Update the analysis button to use streaming
  const handleRunAnalysis = () => {
    if (isStreaming) {
      stopStreaming();
    } else {
      runStreamingAnalysis();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sign In Required
          </h3>
          <p className="text-gray-500 mb-4">
            Please sign in to view AI-powered insights and market analysis —
            whether you're exploring this campaign as an investor, supporter or
            managing it as a fundraiser. Understand the deal score, risk score,
            performance trends, and key opportunities to invest, support or
            improve.
          </p>
          <button
            onClick={() => (window.location.href = '/auth/login')}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading && !analysis && !isStreaming) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border p-6 mb-3">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentScores = analysis?.current_scores;
  const latestAnalysis = analysis?.latest_analysis;

  return (
    <div className="bg-white rounded-3xl shadow-sm border p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          The Hive Mind (AI Analyzer)
        </h3>
        {currentScores?.updated_at && (
          <span className="text-sm text-gray-500">
            Updated {formatTimeAgo(currentScores.updated_at)}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!currentScores ? (
        // No analysis state
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No AI analysis available yet</p>
          <button
            onClick={handleRunAnalysis}
            disabled={loading && !isStreaming}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isStreaming ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : loading ? (
              'Preparing...'
            ) : (
              'Run Comprehensive Analysis'
            )}
          </button>
          
          {/* Show streaming content */}
          {isStreaming && streamedContent && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">AI Analysis in progress:</div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">
                {streamedContent}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Analysis present state
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deal Score Chart */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <DealScoreChart score={currentScores.deal_score} />
              </div>
              <div className="mt-2 text-center">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getScoreBadgeClass(currentScores.deal_score)}`}
                >
                  {getDealGrade(currentScores.deal_score)} Grade
                </span>
              </div>
            </div>

            {/* Risk Assessment & Core Metrics */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Risk Assessment
                </h4>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${currentScores.risk_score}%`,
                        backgroundColor: getRiskColor(currentScores.risk_score),
                      }}
                    ></div>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getRiskColor(currentScores.risk_score) }}
                  >
                    {currentScores.risk_score}%
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {getRiskLevel(currentScores.risk_score)} Risk
                </span>
              </div>

              {/* Core Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sentiment:</span>
                  <span
                    className={`font-medium ${getSentimentColorClass(currentScores.sentiment_analysis)}`}
                  >
                    {currentScores.sentiment_analysis || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Team:</span>
                  <span
                    className={`font-medium ${getTeamAssessmentColorClass(currentScores.team_assessment)}`}
                  >
                    {currentScores.team_assessment || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Market:</span>
                  <span
                    className={`font-medium ${getMarketOpportunityColorClass(currentScores.market_opportunity)}`}
                  >
                    {currentScores.market_opportunity || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Funding Potential:</span>
                  <span
                    className={`font-medium ${getFundingPotentialColorClass(currentScores.funding_potential)}`}
                  >
                    {currentScores.funding_potential || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center space-y-3">
              <button
                onClick={handleRunAnalysis}
                disabled={loading && !isStreaming}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 bg-gray-600 text-white hover:bg-gray-700`}
              >
                {isStreaming ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Stop
                  </div>
                ) : loading ? (
                  'Re-analyzing...'
                ) : (
                  'Re-analyze'
                )}
              </button>
              <button
                onClick={() => setShowSimilarDeals(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Similar Deals
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View History
              </button>
            </div>
          </div>

          {/* Additional Investment Metrics */}
          {latestAnalysis && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Timing</div>
                  <div
                    className={`text-lg font-semibold ${getTimingAssessmentColorClass(latestAnalysis.timing_assessment)}`}
                  >
                    {latestAnalysis.timing_assessment || 'N/A'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Competitive Edge</div>
                  <div
                    className={`text-lg font-semibold ${getCompetitiveAdvantageColorClass(latestAnalysis.competitive_advantage)}`}
                  >
                    {latestAnalysis.competitive_advantage || 'N/A'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Exit Potential</div>
                  <div
                    className={`text-lg font-semibold ${getExitPotentialColorClass(latestAnalysis.exit_potential)}`}
                  >
                    {latestAnalysis.exit_potential || 'N/A'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Sustainability</div>
                  <div className="text-lg font-semibold text-gray-700">
                    {latestAnalysis.sustainability_score || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Expandable Sections */}
              <div className="space-y-4">
                {/* Investment Thesis */}
                {latestAnalysis.investment_thesis && (
                  <div className="border rounded-lg">
                    <button
                      onClick={() => toggleSection('thesis')}
                      className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <span className="text-blue-500 mr-2">📊</span>
                        Investment Thesis
                      </h4>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          expandedSection === 'thesis' ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedSection === 'thesis' && (
                      <div className="px-4 pb-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {latestAnalysis.investment_thesis}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Upside Potential */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection('upside')}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <span className="text-green-500 mr-2">↑</span>
                      Upside Potential & Strengths
                    </h4>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedSection === 'upside' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === 'upside' && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            Key Strengths
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {latestAnalysis.strengths?.map(
                              (strength, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  {strength}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            Growth Opportunities
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {latestAnalysis.upside_potential?.map(
                              (potential, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {potential}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Downside Risks */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection('risks')}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <span className="text-red-500 mr-2">↓</span>
                      Downside Risks & Challenges
                    </h4>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedSection === 'risks' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === 'risks' && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            Major Risks
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {latestAnalysis.downside_risks?.map(
                              (risk, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-red-500 mr-2">•</span>
                                  {risk}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            Regulatory & Market Risks
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {latestAnalysis.regulatory_risks?.map(
                              (risk, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-orange-500 mr-2">
                                    •
                                  </span>
                                  {risk}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Market & Technology Insights */}
                <div className="border rounded-lg">
                  <button
                    onClick={() => toggleSection('insights')}
                    className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <h4 className="font-medium text-gray-700">
                      Market & Technology Insights
                    </h4>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedSection === 'insights' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === 'insights' && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            Market Trends
                          </h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {latestAnalysis.market_trends?.map(
                              (trend, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-purple-500 mr-2">
                                    •
                                  </span>
                                  {trend}
                                </li>
                              ),
                            )}
                          </ul>
                          {latestAnalysis.technology_assessment && (
                            <>
                              <h5 className="text-sm font-medium text-gray-600 mt-3 mb-2">
                                Technology Assessment
                              </h5>
                              <p className="text-sm text-gray-700">
                                {latestAnalysis.technology_assessment}
                              </p>
                            </>
                          )}
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">
                            Investor Alignment
                          </h5>
                          <p className="text-sm text-gray-700 mb-3">
                            {latestAnalysis.investor_alignment}
                          </p>
                          {latestAnalysis.social_impact && (
                            <>
                              <h5 className="text-sm font-medium text-gray-600 mb-2">
                                Social Impact
                              </h5>
                              <p className="text-sm text-gray-700">
                                {latestAnalysis.social_impact}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showSimilarDeals && (
        <SimilarDealsModal
          campaignId={campaignId}
          onClose={() => setShowSimilarDeals(false)}
        />
      )}

      {showHistory && (
        <AnalysisHistoryModal
          history={analysis?.analysis_history || []}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

// Enhanced helper functions
const getDealGrade = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

const getScoreBadgeClass = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  if (score >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

const getRiskColor = (score: number): string => {
  if (score <= 20) return '#10B981';
  if (score <= 40) return '#34D399';
  if (score <= 60) return '#FBBF24';
  if (score <= 80) return '#F59E0B';
  return '#EF4444';
};

const getRiskLevel = (score: number): string => {
  if (score <= 20) return 'Very Low';
  if (score <= 40) return 'Low';
  if (score <= 60) return 'Medium';
  if (score <= 80) return 'High';
  return 'Very High';
};

const getSentimentColorClass = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-600';
    case 'neutral':
      return 'text-yellow-600';
    case 'negative':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getTeamAssessmentColorClass = (assessment: string): string => {
  switch (assessment) {
    case 'strong':
      return 'text-green-600';
    case 'adequate':
      return 'text-yellow-600';
    case 'weak':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getMarketOpportunityColorClass = (opportunity: string): string => {
  switch (opportunity) {
    case 'large':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'small':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getFundingPotentialColorClass = (potential: string): string => {
  switch (potential) {
    case 'high':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getTimingAssessmentColorClass = (timing: string): string => {
  switch (timing) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-yellow-600';
    case 'average':
      return 'text-orange-600';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getCompetitiveAdvantageColorClass = (advantage: string): string => {
  switch (advantage) {
    case 'strong':
      return 'text-green-600';
    case 'moderate':
      return 'text-yellow-600';
    case 'weak':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getExitPotentialColorClass = (potential: string): string => {
  switch (potential) {
    case 'high':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};