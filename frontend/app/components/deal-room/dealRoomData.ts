export interface Deal {
  id: string;
  companyName: string;
  logo: string;
  tagline: string;
  industry: string;
  stage: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B';
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
    mrr?: number;
    growth?: number;
    users?: number;
    revenue?: number;
  };
  documents: {
    name: string;
    type: string;
  }[];
  interested: number;
  meetings: number;
  status: 'Active' | 'Closing Soon' | 'Funded' | 'New';
}

export const deals: Deal[] = [
  {
    id: '1',
    companyName: 'EcoVolt Energy',
    logo: '⚡',
    tagline: 'Revolutionary battery technology for sustainable transportation',
    industry: 'CleanTech',
    stage: 'Series A',
    targetRaise: 5000000,
    currentRaise: 3750000,
    minInvestment: 25000,
    valuation: 25000000,
    investors: 47,
    daysLeft: 12,
    founderName: 'Sarah Chen',
    founderImage: 'SC',
    founderTitle: 'CEO & Co-founder',
    highlights: [
      'Patent-pending solid-state battery tech',
      '3x energy density vs lithium-ion',
      'Partnership with 2 major automakers',
    ],
    description:
      'EcoVolt is developing next-generation solid-state batteries that deliver 3x the energy density of traditional lithium-ion at half the cost. Our technology is positioned to revolutionize electric vehicle range and charging times.',
    metrics: {
      mrr: 180000,
      growth: 42,
      revenue: 2100000,
    },
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Financial Model', type: 'XLSX' },
      { name: 'Technical White Paper', type: 'PDF' },
    ],
    interested: 128,
    meetings: 34,
    status: 'Active',
  },
  {
    id: '2',
    companyName: 'MedAI Diagnostics',
    logo: '🏥',
    tagline: 'AI-powered early disease detection saving lives',
    industry: 'HealthTech',
    stage: 'Seed',
    targetRaise: 2000000,
    currentRaise: 1840000,
    minInvestment: 10000,
    valuation: 10000000,
    investors: 89,
    daysLeft: 3,
    founderName: 'Dr. Michael Torres',
    founderImage: 'MT',
    founderTitle: 'CEO & Chief Medical Officer',
    highlights: [
      '98.5% accuracy in early cancer detection',
      'FDA Breakthrough Device designation',
      '15 hospital partnerships secured',
    ],
    description:
      'MedAI uses proprietary machine learning algorithms to detect cancer and other diseases up to 4 years earlier than traditional methods, dramatically improving patient outcomes and reducing healthcare costs.',
    metrics: {
      users: 45000,
      growth: 156,
      revenue: 890000,
    },
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Clinical Trial Results', type: 'PDF' },
      { name: 'FDA Documentation', type: 'PDF' },
    ],
    interested: 234,
    meetings: 67,
    status: 'Closing Soon',
  },
  {
    id: '3',
    companyName: 'FinFlow',
    logo: '💳',
    tagline: 'Embedded finance infrastructure for modern businesses',
    industry: 'FinTech',
    stage: 'Series A',
    targetRaise: 8000000,
    currentRaise: 4200000,
    minInvestment: 50000,
    valuation: 40000000,
    investors: 32,
    daysLeft: 28,
    founderName: 'James Wright',
    founderImage: 'JW',
    founderTitle: 'CEO & Founder',
    highlights: [
      '$2B+ transaction volume processed',
      '200+ enterprise clients',
      'SOC 2 Type II certified',
    ],
    description:
      'FinFlow provides embedded banking, payments, and lending APIs that enable any company to offer financial services. Our platform powers payments for leading marketplaces, SaaS platforms, and e-commerce companies.',
    metrics: {
      mrr: 420000,
      growth: 89,
      revenue: 5040000,
    },
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Financial Model', type: 'XLSX' },
      { name: 'Security Audit Report', type: 'PDF' },
    ],
    interested: 87,
    meetings: 23,
    status: 'Active',
  },
  {
    id: '4',
    companyName: 'AgriSense',
    logo: '🌱',
    tagline: 'Precision agriculture through IoT and AI',
    industry: 'AgTech',
    stage: 'Pre-Seed',
    targetRaise: 750000,
    currentRaise: 225000,
    minInvestment: 5000,
    valuation: 3000000,
    investors: 18,
    daysLeft: 45,
    founderName: 'Elena Rodriguez',
    founderImage: 'ER',
    founderTitle: 'CEO & Co-founder',
    highlights: [
      '30% water reduction for farmers',
      'Pilot programs with 3 major farms',
      'Backed by leading AgTech accelerator',
    ],
    description:
      "AgriSense combines soil sensors, satellite imagery, and AI to help farmers optimize irrigation, reduce waste, and increase crop yields by up to 25%. We're making sustainable farming profitable.",
    metrics: {
      users: 150,
      growth: 200,
    },
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Pilot Results', type: 'PDF' },
    ],
    interested: 42,
    meetings: 11,
    status: 'New',
  },
  {
    id: '5',
    companyName: 'CyberShield',
    logo: '🛡️',
    tagline: 'Zero-trust security for the modern enterprise',
    industry: 'Cybersecurity',
    stage: 'Series B',
    targetRaise: 20000000,
    currentRaise: 20000000,
    minInvestment: 100000,
    valuation: 150000000,
    investors: 28,
    daysLeft: 0,
    founderName: 'Alex Kim',
    founderImage: 'AK',
    founderTitle: 'CEO & CTO',
    highlights: [
      'Fortune 500 client base',
      'ARR of $12M, growing 120% YoY',
      'Named Gartner Cool Vendor',
    ],
    description:
      'CyberShield provides AI-powered threat detection and zero-trust network access that stops 99.9% of cyber attacks before they happen. Trusted by over 200 enterprise customers worldwide.',
    metrics: {
      mrr: 1000000,
      growth: 120,
      revenue: 12000000,
    },
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Due Diligence Pack', type: 'ZIP' },
      { name: 'Customer Case Studies', type: 'PDF' },
    ],
    interested: 312,
    meetings: 89,
    status: 'Funded',
  },
  {
    id: '6',
    companyName: 'LearnLabs',
    logo: '📚',
    tagline: 'Adaptive learning platform for K-12 education',
    industry: 'EdTech',
    stage: 'Seed',
    targetRaise: 1500000,
    currentRaise: 675000,
    minInvestment: 10000,
    valuation: 7500000,
    investors: 34,
    daysLeft: 21,
    founderName: 'David Park',
    founderImage: 'DP',
    founderTitle: 'CEO & Founder',
    highlights: [
      '50,000+ students on platform',
      '2.3x improvement in test scores',
      'Partnerships with 45 school districts',
    ],
    description:
      'LearnLabs uses AI to create personalized learning paths for every student. Our platform adapts in real-time to student performance, ensuring no child falls behind and every child reaches their potential.',
    metrics: {
      users: 52000,
      growth: 78,
      mrr: 65000,
    },
    documents: [
      { name: 'Pitch Deck', type: 'PDF' },
      { name: 'Impact Report', type: 'PDF' },
    ],
    interested: 156,
    meetings: 28,
    status: 'Active',
  },
];

export const stats = {
  totalDeals: 156,
  activeDeals: 42,
  totalRaised: 127500000,
  avgDealSize: 3200000,
  successRate: 89,
  investorCount: 2340,
};

export const industries = [
  'All Industries',
  'CleanTech',
  'HealthTech',
  'FinTech',
  'AgTech',
  'Cybersecurity',
  'EdTech',
  'AI/ML',
  'SaaS',
];

export const stages = [
  'All Stages',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
];
