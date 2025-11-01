// app/components/campaign/AnalysisHistoryModal.tsx
'use client';
import React from 'react';

interface AnalysisHistory {
  id: string;
  analysis_type: string;
  deal_score: number;
  risk_score: number;
  risk_category: string;
  analyzed_at: string;
  key_risks: string[];
  strengths: string[];
}

interface AnalysisHistoryModalProps {
  history: AnalysisHistory[];
  onClose: () => void;
}

export const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({ 
  history, 
  onClose 
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Analysis History</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No analysis history available. Run an analysis first.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAnalysisTypeClass(analysis.analysis_type)}`}>
                        {analysis.analysis_type.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDate(analysis.analyzed_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeClass(analysis.deal_score)}`}>
                        Deal: {analysis.deal_score}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeClass(analysis.risk_score)}`}>
                        Risk: {analysis.risk_score}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Key Risks</h4>
                      <ul className="text-gray-600 space-y-1">
                        {analysis.key_risks?.map((risk, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {risk}
                          </li>
                        ))}
                        {(!analysis.key_risks || analysis.key_risks.length === 0) && (
                          <li className="text-gray-400">No risks identified</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Strengths</h4>
                      <ul className="text-gray-600 space-y-1">
                        {analysis.strengths?.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                        {(!analysis.strengths || analysis.strengths.length === 0) && (
                          <li className="text-gray-400">No strengths identified</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getAnalysisTypeClass = (type: string): string => {
  switch (type) {
    case 'initial': return 'bg-blue-100 text-blue-800';
    case 'weekly': return 'bg-purple-100 text-purple-800';
    case 'manual': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
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