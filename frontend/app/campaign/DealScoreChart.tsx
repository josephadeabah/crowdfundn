// app/components/campaign/DealScoreChart.tsx
'use client';
import React from 'react';

interface DealScoreChartProps {
  score: number;
}

export const DealScoreChart: React.FC<DealScoreChartProps> = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#FBBF24';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 120 120" className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#E5E7EB"
        strokeWidth="8"
        fill="none"
      />
      
      {/* Progress circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke={getScoreColor(score)}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-1000 ease-out"
      />
      
      {/* Score text */}
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dy="0.3em"
        transform="rotate(90 60 60)"
        className="fill-current text-2xl font-bold"
        style={{ color: getScoreColor(score) }}
      >
        {score}
      </text>
    </svg>
  );
};