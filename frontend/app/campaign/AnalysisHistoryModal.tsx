// app/components/campaign/AnalysisHistoryModal.tsx
'use client';
import React from 'react';
import {
  Accordion,
  AccordionItemWrapper,
  AccordionTriggerWrapper,
  AccordionContentWrapper,
} from '@/app/components/accordion/Accordion';

interface AnalysisHistory {
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
}

interface AnalysisHistoryModalProps {
  history: AnalysisHistory[];
  onClose: () => void;
}

export const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({
  history,
  onClose,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAnalysisTypeLabel = (type: string): string => {
    const labels = {
      initial: 'Initial Analysis',
      weekly: 'Weekly Update',
      monthly: 'Monthly Review',
      manual: 'Manual Analysis',
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Analysis History Timeline
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Click on each analysis to view detailed insights
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No analysis history available. Run an analysis first.
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {sortedHistory.map((analysis, index) => (
                <AccordionItemWrapper key={analysis.id} value={analysis.id}>
                  <AccordionTriggerWrapper>
                    <div className="flex flex-col items-start text-left space-y-2">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAnalysisTypeClass(analysis.analysis_type)}`}
                        >
                          {getAnalysisTypeLabel(analysis.analysis_type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(analysis.analyzed_at)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getScoreBadgeClass(analysis.deal_score)}`}
                        >
                          Deal: {analysis.deal_score}
                        </div>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRiskBadgeClass(analysis.risk_score)}`}
                        >
                          Risk: {analysis.risk_score}
                        </div>
                        <div className="text-xs text-gray-500">
                          Risk Category: {analysis.risk_category}
                        </div>
                      </div>
                    </div>
                  </AccordionTriggerWrapper>
                  <AccordionContentWrapper>
                    {/* Quick Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">Sentiment</div>
                        <div
                          className={`text-lg font-semibold ${getSentimentColorClass(analysis.sentiment_analysis)}`}
                        >
                          {analysis.sentiment_analysis || 'N/A'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Team Assessment
                        </div>
                        <div
                          className={`text-lg font-semibold ${getTeamAssessmentColorClass(analysis.team_assessment)}`}
                        >
                          {analysis.team_assessment || 'N/A'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Market Opportunity
                        </div>
                        <div
                          className={`text-lg font-semibold ${getMarketOpportunityColorClass(analysis.market_opportunity)}`}
                        >
                          {analysis.market_opportunity || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Comprehensive Analysis Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Upside Potential */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <span className="text-green-500 mr-2">↑</span>
                          Upside Potential
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {analysis.upside_potential?.map((potential, index) => (
                            <li
                              key={index}
                              className="flex items-start p-2 bg-green-50 rounded"
                            >
                              <span className="text-green-500 mr-2">•</span>
                              {potential}
                            </li>
                          ))}
                          {(!analysis.upside_potential ||
                            analysis.upside_potential.length === 0) && (
                            <li className="text-gray-400 p-2">
                              No upside factors identified
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Downside Risks */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <span className="text-red-500 mr-2">↓</span>
                          Downside Risks
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {analysis.downside_risks?.map((risk, index) => (
                            <li
                              key={index}
                              className="flex items-start p-2 bg-red-50 rounded"
                            >
                              <span className="text-red-500 mr-2">•</span>
                              {risk}
                            </li>
                          ))}
                          {(!analysis.downside_risks ||
                            analysis.downside_risks.length === 0) && (
                            <li className="text-gray-400 p-2">
                              No risks identified
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Strengths
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          {analysis.strengths?.map((strength, index) => (
                            <li
                              key={index}
                              className="flex items-start p-2 bg-blue-50 rounded"
                            >
                              <span className="text-blue-500 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                          {(!analysis.strengths ||
                            analysis.strengths.length === 0) && (
                            <li className="text-gray-400 p-2">
                              No strengths identified
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">
                          Key Insights
                        </h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="p-2 bg-yellow-50 rounded">
                            <strong>Sentiment:</strong> {analysis.sentiment_analysis || 'Not analyzed'}
                          </div>
                          <div className="p-2 bg-yellow-50 rounded">
                            <strong>Team:</strong> {analysis.team_assessment || 'Not assessed'}
                          </div>
                          <div className="p-2 bg-yellow-50 rounded">
                            <strong>Market:</strong> {analysis.market_opportunity || 'Not assessed'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Investment Thesis */}
                    {analysis.investment_thesis && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Investment Thesis
                        </h4>
                        <div className="p-4 bg-purple-50 rounded text-sm text-gray-600 border-l-4 border-purple-500">
                          {analysis.investment_thesis}
                        </div>
                      </div>
                    )}
                  </AccordionContentWrapper>
                </AccordionItemWrapper>
              ))}
            </Accordion>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {sortedHistory.length} analysis record{sortedHistory.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAnalysisTypeClass = (type: string): string => {
  switch (type) {
    case 'initial':
      return 'bg-blue-100 text-blue-800';
    case 'weekly':
      return 'bg-purple-100 text-purple-800';
    case 'monthly':
      return 'bg-green-100 text-green-800';
    case 'manual':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getScoreBadgeClass = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getRiskBadgeClass = (score: number): string => {
  if (score <= 30) return 'bg-green-100 text-green-800';
  if (score <= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
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