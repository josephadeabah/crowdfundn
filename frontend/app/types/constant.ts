import {
  UserGroupIcon,
  SquaresPlusIcon,
  SunIcon,
  LightBulbIcon,
  PhoneIcon,
  BanknotesIcon,
  CreditCardIcon,
  UserIcon,
  AcademicCapIcon,
  IdentificationIcon, // For Mentorship
  BookOpenIcon,
  TrophyIcon,
  CalendarIcon,
  MicrophoneIcon,
  PuzzlePieceIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { DropdownLinks } from './navbar.types';
import {
  UserCheck,
  FileText,
  Shield,
  BookOpen,
  FileCheck,
  Pencil,
  Users,
  Building,
  Briefcase,
} from 'lucide-react';

export const dropdownLinks: DropdownLinks = {
  About: [
    {
      label: 'Who We Are',
      href: '/info/about-us',
      icon: UserGroupIcon,
      description: 'Learn more about our mission and vision.',
    },
    {
      label: 'Why Is This Right For You?',
      href: '/articles/is-crowdfunding-right-for-you',
      icon: SunIcon,
      description: 'Discover why crowdfunding is the right choice for you.',
    },
    {
      label: 'Who Can Fundraise?',
      href: '/articles/who-can-fundraise',
      icon: UserIcon,
      description: 'Find out who can start a fundraising campaign.',
    },
  ],
  Guides: [
    {
      label: 'How To Get Started',
      href: '/articles/how-to-get-started',
      icon: LightBulbIcon,
      description: 'Step-by-step guide to launching your campaign.',
    },
    {
      label: 'How To Withdraw Funds Safely',
      href: '/articles/how-to-withdraw-funds',
      icon: CreditCardIcon,
      description: 'Learn how to securely withdraw your funds.',
    },
    {
      label: 'Pricing',
      href: '/info/pricing',
      icon: BanknotesIcon,
      description: 'Understand our pricing structure.',
    },
    {
      label: 'Investment Calculator',
      href: '/investment-calculator',
      icon: BanknotesIcon,
      description: 'Calculate your potential returns on investment.',
    },
  ],
  Contact: [
    {
      label: 'Ghana',
      href: '/info/contactus',
      icon: PhoneIcon,
      description: 'Reach out to our Ghana office.',
    },
    {
      label: 'Eswatini',
      href: '/info/contactus',
      icon: PhoneIcon,
      description: 'Reach out to our Eswatini office.',
    },
  ],
  Education: [
    {
      label: 'Scholarships',
      href: '/info/education/schorlaships',
      icon: AcademicCapIcon, // Better represents academic achievements
      description: 'Learn about available scholarships for brilliant minds.',
    },
    {
      label: 'Grants',
      href: '/info/education/grants',
      icon: TrophyIcon, // Represents awards and achievements
      description: 'Explore various grants available to support you.',
    },
  ],
  Events: [
    {
      label: 'Upcoming Events',
      href: 'https://www.pnpmmedia.com/journal',
      icon: CalendarIcon, // Standard icon for events
      description: 'Stay updated with our upcoming events and workshops.',
    },
    {
      label: 'Seminars',
      href: 'https://www.pnpmmedia.com/podcasts',
      icon: MicrophoneIcon, // Represents speaking/presentation events
      description: 'Join our seminars to learn from industry experts.',
    },
    {
      label: 'Group Meetings',
      href: '/info/events/group-meetings',
      icon: UsersIcon, // Represents group interactions
      description:
        'Join our group meetings to network and collaborate with like-minded individuals.',
    },
    {
      label: 'Office Hours',
      href: '/info/events/office-hours',
      icon: ClockIcon, // Represents scheduled time slots
      description:
        'Get personalized guidance during our office hours with industry experts.',
    },
    {
      label: 'Training',
      href: '/info/events/training',
      icon: BookOpenIcon, // Represents learning and education
      description:
        'Structured programs to develop essential business and technical skills for entrepreneurs.',
    },
    {
      label: 'Mentorship',
      href: '/info/events/mentorship',
      icon: IdentificationIcon, // Represents guidance and personal development
      description:
        'One-on-one guidance from experienced entrepreneurs to help you navigate business challenges.',
    },
  ],
  Fund: [
    {
      label: 'Invest in Founders',
      href: '/invest',
      icon: BanknotesIcon,
      description: 'Invest in founders and companies for equity.',
    },
    {
      label: 'By Category',
      href: '/explore/category',
      icon: SquaresPlusIcon,
      description: 'Fund campaigns by category.',
    },
    {
      label: 'By Advance Filtering',
      href: '/explore/advance',
      icon: SquaresPlusIcon,
      description: 'Use advanced filters to find campaigns.',
    },
  ],
  Leaderboard: [
    {
      label: 'Impact Makers',
      href: '/leaderboard/backers',
      icon: UserGroupIcon,
      description: 'See the top impact makers on our platform.',
    },
    {
      label: 'Hive Builders',
      href: '/leaderboard/fundraisers',
      icon: UserGroupIcon,
      description: 'See the top hive builders on our platform.',
    },
  ],
} as const;

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  link?: string;
}

export const creatorKycSteps = [
  { id: 'personalInfo', title: 'Personal Information', icon: UserCheck },
  { id: 'businessInfo', title: 'Business Information', icon: Building },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

export const investorKycSteps = [
  { id: 'personalInfo', title: 'Personal Information', icon: UserCheck },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'quiz', title: 'Investor Quiz', icon: BookOpen },
  { id: 'declaration', title: 'Declaration', icon: FileCheck },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

export const bothKycSteps = [
  { id: 'personalInfo', title: 'Personal Information', icon: UserCheck },
  { id: 'businessInfo', title: 'Business Information', icon: Building },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'quiz', title: 'Investor Quiz', icon: BookOpen },
  { id: 'declaration', title: 'Declaration', icon: FileCheck },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

export const mentorKycSteps = [
  { id: 'personalInfo', title: 'Personal Information', icon: UserCheck },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'experience', title: 'Experience & Expertise', icon: Users },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

export const availableStartups = [
  { id: '1', name: 'TechFlow Solutions', stage: 'Seed', industry: 'SaaS' },
  {
    id: '2',
    name: 'GreenEnergy Innovations',
    stage: 'Series A',
    industry: 'CleanTech',
  },
  {
    id: '3',
    name: 'HealthTech Pro',
    stage: 'Pre-Seed',
    industry: 'Healthcare',
  },
  { id: '4', name: 'EduLearn Platform', stage: 'Seed', industry: 'EdTech' },
  {
    id: '5',
    name: 'FinSecure Systems',
    stage: 'Series A',
    industry: 'FinTech',
  },
  {
    id: '6',
    name: 'AgriSmart Solutions',
    stage: 'Pre-Seed',
    industry: 'AgriTech',
  },
];

export const industryExpertiseOptions = [
  'Technology & Software',
  'Healthcare & Biotech',
  'Financial Services',
  'E-commerce & Retail',
  'Manufacturing',
  'Clean Energy & Sustainability',
  'Education & EdTech',
  'Agriculture & Food',
  'Real Estate',
  'Media & Entertainment',
  'Transportation & Logistics',
  'Marketing & Sales',
];

export const quizQuestions = {
  startupRisk: {
    question:
      'What is the primary risk when investing in early-stage startups?',
    options: [
      {
        value: 'market-volatility',
        label: 'Market volatility similar to public stocks',
      },
      {
        value: 'total-loss',
        label: 'High probability of total loss of investment',
      },
      {
        value: 'inflation-risk',
        label: 'Inflation reducing returns over time',
      },
    ],
    correct: 'total-loss',
  },
  liquidityRisk: {
    question:
      'How liquid are investments in private startups compared to public stocks?',
    options: [
      { value: 'more-liquid', label: 'More liquid - can sell anytime' },
      { value: 'same-liquidity', label: 'Same liquidity as public stocks' },
      {
        value: 'illiquid',
        label: 'Highly illiquid - may take years to exit or never exit',
      },
    ],
    correct: 'illiquid',
  },
  dilutionRisk: {
    question:
      'What happens to your ownership percentage when a startup raises additional funding rounds?',
    options: [
      { value: 'increases', label: 'It typically increases' },
      { value: 'stays-same', label: 'It stays the same' },
      {
        value: 'diluted',
        label: 'It gets diluted (reduced) unless you participate in new rounds',
      },
    ],
    correct: 'diluted',
  },
  totalLossRisk: {
    question: 'What percentage of startups typically fail completely?',
    options: [
      { value: '10-20', label: '10-20%' },
      { value: '30-40', label: '30-40%' },
      { value: '80-90', label: '80-90%' },
    ],
    correct: '80-90',
  },
  investmentHorizon: {
    question: 'What is the typical investment horizon for startup investments?',
    options: [
      { value: '1-2-years', label: '1-2 years' },
      { value: '3-5-years', label: '3-5 years' },
      { value: '7-10-years', label: '7-10 years or longer' },
    ],
    correct: '7-10-years',
  },
  dueDiligence: {
    question:
      'Before investing in a startup, what level of due diligence should you conduct?',
    options: [
      { value: 'minimal', label: 'Minimal - trust the pitch deck' },
      { value: 'basic', label: 'Basic - review financials only' },
      {
        value: 'comprehensive',
        label:
          'Comprehensive - analyze team, market, financials, competition, and business model',
      },
    ],
    correct: 'comprehensive',
  },
  diversification: {
    question:
      'What is the recommended approach to startup investing regarding portfolio allocation?',
    options: [
      {
        value: 'all-in',
        label: 'Invest most of your portfolio for maximum returns',
      },
      {
        value: 'small-portion',
        label: 'Invest only a small portion you can afford to lose completely',
      },
      { value: 'half-portfolio', label: 'Invest about half your portfolio' },
    ],
    correct: 'small-portion',
  },
  exitStrategy: {
    question:
      'How do startup investors typically realize returns on their investments?',
    options: [
      { value: 'dividends', label: 'Regular dividend payments' },
      {
        value: 'exit-events',
        label: 'Exit events like IPO or acquisition (which may never happen)',
      },
      {
        value: 'guaranteed-buyback',
        label: 'Guaranteed buyback by the company',
      },
    ],
    correct: 'exit-events',
  },
};
