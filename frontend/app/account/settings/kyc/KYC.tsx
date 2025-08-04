'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  FileText,
  Shield,
  UserCheck,
  BookOpen,
  FileCheck,
  AlertCircle,
  Pencil,
  Users,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { cn } from '@/app/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { toast } from '@/app/components/ui/sonner';
import DigitalCertificate from './signature/DigitalCertificate';
import SignaturePad from './signature/SignaturePad';
import { Point } from './signature/signatureUtils';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Calendar } from '@/app/components/ui/calender';

// Define the steps for the KYC process - now includes certificate signing
const creatorKycSteps = [
  { id: 'personal', title: 'Personal Information', icon: UserCheck },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

const investorKycSteps = [
  { id: 'personal', title: 'Personal Information', icon: UserCheck },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'quiz', title: 'Investor Quiz', icon: BookOpen },
  { id: 'declaration', title: 'Declaration', icon: FileCheck },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

const mentorKycSteps = [
  { id: 'personal', title: 'Personal Information', icon: UserCheck },
  { id: 'document', title: 'Document Verification', icon: FileText },
  { id: 'experience', title: 'Experience & Expertise', icon: Users },
  { id: 'certificate', title: 'Certificate Signing', icon: Pencil },
  { id: 'review', title: 'Review & Submit', icon: Shield },
];

// Calculate minimum date (18 years ago)
const getMinimumBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

// Form schemas with enhanced date validation
const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.date().refine((date) => {
    const minDate = getMinimumBirthDate();
    return date <= minDate;
  }, 'You must be at least 18 years old'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

const documentSchema = z.object({
  idType: z.string().min(1, 'Please select an ID type'),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
  idDocument: z.string().min(1, 'Please upload your ID document'),
  proofOfAddress: z.string().min(1, 'Please upload proof of address'),
});

const creatorBusinessSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(1, 'Please select business type'),
  businessDescription: z
    .string()
    .min(50, 'Business description must be at least 50 characters'),
  businessRegistration: z
    .string()
    .min(1, 'Business registration document is required'),
  taxId: z.string().min(5, 'Tax ID is required'),
});

const mentorExperienceSchema = z.object({
  professionalTitle: z.string().min(2, 'Professional title is required'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  industryExpertise: z
    .array(z.string())
    .min(1, 'Please select at least one area of expertise'),
  previousMentoring: z
    .string()
    .min(1, 'Please indicate your mentoring experience'),
  linkedinProfile: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  resume: z.string().min(1, 'Please upload your resume'),
  selectedStartup: z.string().min(1, 'Please select a startup to mentor'),
  mentorshipApproach: z
    .string()
    .min(
      100,
      'Please describe your mentorship approach (minimum 100 characters)',
    ),
  availability: z.string().min(1, 'Please indicate your availability'),
});

const investorQuizSchema = z.object({
  startupRisk: z.string().min(1, 'Please select your answer'),
  liquidityRisk: z.string().min(1, 'Please select your answer'),
  dilutionRisk: z.string().min(1, 'Please select your answer'),
  totalLossRisk: z.string().min(1, 'Please select your answer'),
  investmentHorizon: z.string().min(1, 'Please select your answer'),
  dueDiligence: z.string().min(1, 'Please select your answer'),
  diversification: z.string().min(1, 'Please select your answer'),
  exitStrategy: z.string().min(1, 'Please select your answer'),
});

const declarationSchema = z.object({
  accreditedInvestor: z.boolean(),
  riskAcknowledgment: z
    .boolean()
    .refine((val) => val === true, 'You must acknowledge the risks'),
  termsAcceptance: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms'),
  dataConsent: z
    .boolean()
    .refine((val) => val === true, 'You must consent to data processing'),
});

// Sample startups data
const availableStartups = [
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

// Industry expertise options
const industryExpertiseOptions = [
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

// Enhanced quiz questions about startup investing risks with correct answers
const quizQuestions = {
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

interface CreatorKYCFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocument: string;
  proofOfAddress: string;
  businessName: string;
  businessType: string;
  businessDescription: string;
  businessRegistration: string;
  taxId: string;
}

interface InvestorKYCFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocument: string;
  proofOfAddress: string;
  startupRisk: string;
  liquidityRisk: string;
  dilutionRisk: string;
  totalLossRisk: string;
  investmentHorizon: string;
  dueDiligence: string;
  diversification: string;
  exitStrategy: string;
  accreditedInvestor: boolean;
  riskAcknowledgment: boolean;
  termsAcceptance: boolean;
  dataConsent: boolean;
}

interface MentorKYCFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocument: string;
  proofOfAddress: string;
  professionalTitle: string;
  yearsOfExperience: string;
  industryExpertise: string[];
  previousMentoring: string;
  linkedinProfile: string;
  resume: string;
  selectedStartup: string;
  mentorshipApproach: string;
  availability: string;
}

interface KYCProcessProps {
  userType: 'creator' | 'investor' | 'mentor';
  onUserTypeChange: (userType: 'creator' | 'investor' | 'mentor') => void;
}

const KYCProcess: React.FC<KYCProcessProps> = ({
  userType,
  onUserTypeChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<
    Partial<CreatorKYCFormData | InvestorKYCFormData | MentorKYCFormData>
  >({});
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [incorrectAnswers, setIncorrectAnswers] = useState<{
    [key: string]: { userAnswer: string; correctAnswer: string };
  }>({});

  // Certificate signing state
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState<Point[]>([]);

  const isCreator = userType === 'creator';
  const isInvestor = userType === 'investor';
  const isMentor = userType === 'mentor';

  const kycSteps = isCreator
    ? creatorKycSteps
    : isInvestor
      ? investorKycSteps
      : mentorKycSteps;

  // Load signature from localStorage when component mounts
  useEffect(() => {
    const savedSignature = localStorage.getItem(`${userType}Signature`);
    if (savedSignature) {
      try {
        const parsedSignature = JSON.parse(savedSignature);
        setSignature(parsedSignature);
        setIsSigned(parsedSignature.length > 0);
      } catch (error) {
        console.error('Error loading signature:', error);
      }
    }
  }, [userType]);

  const handleTabChange = (value: string) => {
    onUserTypeChange(value as 'creator' | 'investor' | 'mentor');
    setCurrentStep(0); // Reset to first step when switching tabs
  };

  const handleOpenSignDialog = () => {
    setIsSignDialogOpen(true);
  };

  const handleCancelSignature = () => {
    setIsSignDialogOpen(false);
  };

  const handleSaveSignature = (newSignature: Point[]) => {
    if (newSignature.length < 5) {
      toast.error('Please add a valid signature');
      return;
    }

    setSignature(newSignature);
    setIsSigned(true);
    setIsSignDialogOpen(false);

    // Save signature to localStorage with user type prefix
    localStorage.setItem(`${userType}Signature`, JSON.stringify(newSignature));

    toast.success('Certificate signed successfully!');
  };

  const handleRemoveSignature = () => {
    setSignature([]);
    setIsSigned(false);
    // Remove from localStorage
    localStorage.removeItem(`${userType}Signature`);
  };

  const isQuizPassed = () => {
    return Object.values(quizResults).every((result) => result === true);
  };

  const getIncorrectQuestionsDetails = () => {
    return Object.entries(incorrectAnswers).map(([questionKey, details]) => ({
      question:
        quizQuestions[questionKey as keyof typeof quizQuestions].question,
      userAnswer: details.userAnswer,
      correctAnswer: details.correctAnswer,
      questionKey,
    }));
  };

  // Determine current schema based on step and user type
  const getCurrentSchema = () => {
    if (currentStep === 0) return personalInfoSchema;
    if (currentStep === 1) return documentSchema;
    if (isCreator && currentStep === 3) return creatorBusinessSchema;
    if (isMentor && currentStep === 2) return mentorExperienceSchema;
    if (isInvestor && currentStep === 2) return investorQuizSchema;
    if (isInvestor && currentStep === 3) return declarationSchema;
    return z.object({});
  };

  const currentSchema = getCurrentSchema();

  const form = useForm<any>({
    resolver: zodResolver(currentSchema),
    defaultValues: (() => {
      if (currentStep === 0) {
        return {
          fullName: formData.fullName || '',
          email: formData.email || '',
          phone: formData.phone || '',
          dateOfBirth: formData.dateOfBirth || undefined,
          nationality: formData.nationality || '',
          address: formData.address || '',
          city: formData.city || '',
          postalCode: formData.postalCode || '',
          country: formData.country || '',
        };
      }
      if (currentStep === 1) {
        return {
          idType: formData.idType || '',
          idNumber: formData.idNumber || '',
          idDocument: formData.idDocument || '',
          proofOfAddress: formData.proofOfAddress || '',
        };
      }
      if (isMentor && currentStep === 2) {
        return {
          professionalTitle:
            (formData as MentorKYCFormData).professionalTitle || '',
          yearsOfExperience:
            (formData as MentorKYCFormData).yearsOfExperience || '',
          industryExpertise:
            (formData as MentorKYCFormData).industryExpertise || [],
          previousMentoring:
            (formData as MentorKYCFormData).previousMentoring || '',
          linkedinProfile:
            (formData as MentorKYCFormData).linkedinProfile || '',
          resume: (formData as MentorKYCFormData).resume || '',
          selectedStartup:
            (formData as MentorKYCFormData).selectedStartup || '',
          mentorshipApproach:
            (formData as MentorKYCFormData).mentorshipApproach || '',
          availability: (formData as MentorKYCFormData).availability || '',
        };
      }
      if (isCreator && currentStep === 3) {
        return {
          businessName: (formData as CreatorKYCFormData).businessName || '',
          businessType: (formData as CreatorKYCFormData).businessType || '',
          businessDescription:
            (formData as CreatorKYCFormData).businessDescription || '',
          businessRegistration:
            (formData as CreatorKYCFormData).businessRegistration || '',
          taxId: (formData as CreatorKYCFormData).taxId || '',
        };
      }
      if (isInvestor && currentStep === 2) {
        return Object.keys(quizQuestions).reduce((acc, key) => {
          acc[key] = (formData as any)[key] || '';
          return acc;
        }, {} as any);
      }
      if (isInvestor && currentStep === 3) {
        return {
          accreditedInvestor:
            (formData as InvestorKYCFormData).accreditedInvestor || false,
          riskAcknowledgment:
            (formData as InvestorKYCFormData).riskAcknowledgment || false,
          termsAcceptance:
            (formData as InvestorKYCFormData).termsAcceptance || false,
          dataConsent: (formData as InvestorKYCFormData).dataConsent || false,
        };
      }
      return {};
    })(),
  });

  const onSubmit = (data: any) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    // If this is the quiz step for investors, validate answers
    if (isInvestor && currentStep === 2) {
      const results: { [key: string]: boolean } = {};
      const incorrect: {
        [key: string]: { userAnswer: string; correctAnswer: string };
      } = {};

      Object.keys(quizQuestions).forEach((questionKey) => {
        const userAnswer = data[questionKey];
        const correctAnswer =
          quizQuestions[questionKey as keyof typeof quizQuestions].correct;
        const isCorrect = userAnswer === correctAnswer;
        results[questionKey] = isCorrect;

        if (!isCorrect) {
          const userOption = quizQuestions[
            questionKey as keyof typeof quizQuestions
          ].options.find((opt) => opt.value === userAnswer);
          const correctOption = quizQuestions[
            questionKey as keyof typeof quizQuestions
          ].options.find((opt) => opt.value === correctAnswer);
          incorrect[questionKey] = {
            userAnswer: userOption?.label || userAnswer,
            correctAnswer: correctOption?.label || correctAnswer,
          };
        }
      });

      setQuizResults(results);
      setIncorrectAnswers(incorrect);
    }

    // Check if this is the certificate signing step
    const certificateStepIndex = isCreator ? 2 : isInvestor ? 4 : 3;
    if (currentStep === certificateStepIndex) {
      if (!isSigned) {
        toast.error('Please sign your certificate before proceeding.');
        return;
      }
    }

    if (currentStep < kycSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission - validate requirements based on user type
      if (isInvestor && !isQuizPassed()) {
        toast.error(
          'Please complete the investor quiz correctly before submitting.',
        );
        return;
      }

      if (!isSigned) {
        toast.error('Please sign your certificate before submitting.');
        return;
      }

      const userTypeLabel = isCreator
        ? 'Campaign creator'
        : isInvestor
          ? 'Investor'
          : 'Mentor';
      toast.success(`${userTypeLabel} verification submitted successfully`);
      console.log('Final form data:', updatedFormData);
      console.log('Signature data:', signature);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          {kycSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index <= currentStep
                    ? 'bg-bantu-green border-bantu-green text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={`text-sm mt-2 text-center ${
                  index <= currentStep ? 'text-bantu-green' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute left-0 top-0 h-2 bg-bantu-green rounded-full transition-all"
            style={{ width: `${(currentStep / (kycSteps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{kycSteps[currentStep].title}</CardTitle>
          <CardDescription>
            {currentStep === 0 &&
              'Please provide your personal information accurately.'}
            {currentStep === 1 &&
              'Upload your identification documents for verification.'}
            {currentStep === 2 &&
              isInvestor &&
              'Complete this quiz to demonstrate your understanding of startup investment risks.'}
            {currentStep === 2 &&
              isMentor &&
              'Tell us about your professional experience and expertise.'}
            {currentStep === 3 &&
              isInvestor &&
              'Please read and acknowledge the following declarations.'}
            {((currentStep === 2 && isCreator) ||
              (currentStep === 3 && isMentor) ||
              (currentStep === 4 && isInvestor)) &&
              'Sign your digital certificate to verify your identity.'}
            {((currentStep === 3 && isCreator) ||
              (currentStep === 4 && isMentor) ||
              (currentStep === 5 && isInvestor)) &&
              'Review your information and submit your verification request.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Certificate Signing Step */}
          {((currentStep === 2 && isCreator) ||
            (currentStep === 3 && isMentor) ||
            (currentStep === 4 && isInvestor)) && (
            <div className="space-y-6">
              <DigitalCertificate
                isSigned={isSigned}
                signature={signature}
                onSignClick={handleOpenSignDialog}
                onRemoveSignature={handleRemoveSignature}
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={goToPreviousStep}>
                  Previous
                </Button>
                <Button
                  onClick={() => onSubmit({})}
                  disabled={!isSigned}
                  className="bg-bantu-green hover:bg-bantu-dark-green"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Other steps */}
          {(currentStep !== 2 || !isCreator) &&
            (currentStep !== 3 || !isMentor) &&
            (currentStep !== 4 || !isInvestor) && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Personal Information Step */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick your date of birth</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date: Date) =>
                                    date > getMinimumBirthDate() ||
                                    date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                  className={cn('p-3 pointer-events-auto')}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              You must be at least 18 years old to participate.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your nationality"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your country"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your full address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your postal code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Document Verification Step */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="idType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="passport"
                                    id="passport"
                                  />
                                  <label htmlFor="passport">Passport</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="national-id"
                                    id="national-id"
                                  />
                                  <label htmlFor="national-id">
                                    National ID
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="drivers-license"
                                    id="drivers-license"
                                  />
                                  <label htmlFor="drivers-license">
                                    Driver's License
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your ID number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idDocument"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload ID Document</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload a clear photo or scan of your ID document
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="proofOfAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proof of Address</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload a utility bill, bank statement, or other
                              proof of address (not older than 3 months)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Mentor Experience & Expertise Step */}
                  {isMentor && currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">
                          Professional Experience & Expertise
                        </h3>
                        <p className="text-blue-700 text-sm">
                          Please provide details about your professional
                          background and mentoring capabilities.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="professionalTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Senior Software Engineer, CEO, Marketing Director"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="yearsOfExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Years of Professional Experience
                              </FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select years of experience" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3-5">
                                      3-5 years
                                    </SelectItem>
                                    <SelectItem value="6-10">
                                      6-10 years
                                    </SelectItem>
                                    <SelectItem value="11-15">
                                      11-15 years
                                    </SelectItem>
                                    <SelectItem value="16-20">
                                      16-20 years
                                    </SelectItem>
                                    <SelectItem value="20+">
                                      20+ years
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="industryExpertise"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">
                                Areas of Expertise
                              </FormLabel>
                              <FormDescription>
                                Select all areas where you have significant
                                experience and can provide valuable mentorship.
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {industryExpertiseOptions.map((item) => (
                                <FormField
                                  key={item}
                                  control={form.control}
                                  name="industryExpertise"
                                  render={({ field }) => {
                                    const currentValue = field.value || [];
                                    return (
                                      <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={currentValue.includes(
                                              item,
                                            )}
                                            onCheckedChange={(checked) => {
                                              if (checked) {
                                                field.onChange([
                                                  ...currentValue,
                                                  item,
                                                ]);
                                              } else {
                                                field.onChange(
                                                  currentValue.filter(
                                                    (value: string) =>
                                                      value !== item,
                                                  ),
                                                );
                                              }
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {item}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="previousMentoring"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Mentoring Experience</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="extensive"
                                    id="extensive"
                                  />
                                  <label htmlFor="extensive">
                                    Extensive - I've mentored 5+
                                    individuals/companies
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="moderate"
                                    id="moderate"
                                  />
                                  <label htmlFor="moderate">
                                    Moderate - I've mentored 2-4
                                    individuals/companies
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="limited"
                                    id="limited"
                                  />
                                  <label htmlFor="limited">
                                    Limited - I've mentored 1 individual/company
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="none" id="none" />
                                  <label htmlFor="none">
                                    None - This would be my first mentoring
                                    experience
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="linkedinProfile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/yourprofile"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your LinkedIn profile helps startups learn more
                              about your background.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="resume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Resume/CV</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload your current resume or CV (PDF, DOC, or
                              DOCX format)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="selectedStartup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Startup to Mentor</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a startup you'd like to mentor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableStartups.map((startup) => (
                                    <SelectItem
                                      key={startup.id}
                                      value={startup.id}
                                    >
                                      {startup.name} - {startup.stage} (
                                      {startup.industry})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              Select one startup that matches your expertise and
                              interests.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mentorshipApproach"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mentorship Approach</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your mentorship philosophy, approach, and what you hope to achieve with the startup you'll be mentoring. What specific value will you bring to their growth journey?"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum 100 characters. Be specific about your
                              mentoring style and value proposition.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability for Mentoring</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="high" id="high" />
                                  <label htmlFor="high">
                                    High - I can dedicate 4+ hours per week
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="moderate"
                                    id="moderate"
                                  />
                                  <label htmlFor="moderate">
                                    Moderate - I can dedicate 2-3 hours per week
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="limited"
                                    id="limited"
                                  />
                                  <label htmlFor="limited">
                                    Limited - I can dedicate 1-2 hours per week
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Enhanced Investor Quiz Step */}
                  {isInvestor && currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">
                          Startup Investment Risk Assessment
                        </h3>
                        <p className="text-blue-700 text-sm">
                          Please answer the following questions to demonstrate
                          your understanding of the risks involved in investing
                          in private, unlisted startups.
                        </p>
                      </div>

                      {Object.entries(quizQuestions).map(
                        ([questionKey, questionData]) => (
                          <FormField
                            key={questionKey}
                            control={form.control}
                            name={questionKey}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-medium">
                                  {questionData.question}
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-3"
                                  >
                                    {questionData.options.map((option) => (
                                      <div
                                        key={option.value}
                                        className="flex items-start space-x-3"
                                      >
                                        <RadioGroupItem
                                          value={option.value}
                                          id={`${questionKey}-${option.value}`}
                                          className="mt-1"
                                        />
                                        <label
                                          htmlFor={`${questionKey}-${option.value}`}
                                          className="text-sm leading-relaxed cursor-pointer"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ),
                      )}

                      {Object.keys(quizResults).length > 0 && (
                        <div
                          className={`p-4 rounded-lg ${isQuizPassed() ? 'bg-green-50' : 'bg-red-50'}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {isQuizPassed() ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                            <h4
                              className={`font-semibold ${isQuizPassed() ? 'text-green-800' : 'text-red-800'}`}
                            >
                              Quiz Results
                            </h4>
                          </div>
                          {isQuizPassed() ? (
                            <p className="text-green-700">
                              Excellent! You've demonstrated a good
                              understanding of startup investment risks.
                            </p>
                          ) : (
                            <div className="text-red-700">
                              <p className="mb-2">
                                Please review and correct your answers to
                                proceed:
                              </p>
                              <div className="space-y-4">
                                {getIncorrectQuestionsDetails().map(
                                  ({
                                    question,
                                    userAnswer,
                                    correctAnswer,
                                    questionKey,
                                  }) => (
                                    <div
                                      key={questionKey}
                                      className="bg-red-50 p-4 rounded-lg"
                                    >
                                      <h4 className="font-medium text-red-800 mb-2">
                                        {question}
                                      </h4>
                                      <div className="space-y-1 text-sm">
                                        <p className="text-red-600">
                                          <span className="font-medium">
                                            Your answer:
                                          </span>{' '}
                                          {userAnswer}
                                        </p>
                                        <p className="text-green-600">
                                          <span className="font-medium">
                                            Correct answer:
                                          </span>{' '}
                                          {correctAnswer}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Investor Declaration Step */}
                  {isInvestor && currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                          Important Declarations
                        </h3>
                        <p className="text-yellow-700 text-sm">
                          Please read and acknowledge the following statements
                          before proceeding.
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="accreditedInvestor"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I am an accredited investor (optional)
                              </FormLabel>
                              <FormDescription>
                                Check this box if you meet the criteria for an
                                accredited investor as defined by securities
                                regulations.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="riskAcknowledgment"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Risk Acknowledgment *</FormLabel>
                              <FormDescription>
                                I understand that all investments carry risk,
                                including the potential loss of principal. I
                                acknowledge that past performance does not
                                guarantee future results.
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="termsAcceptance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Terms and Conditions *</FormLabel>
                              <FormDescription>
                                I have read, understood, and agree to the Terms
                                of Service and Privacy Policy.
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dataConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Data Processing Consent *</FormLabel>
                              <FormDescription>
                                I consent to the processing of my personal data
                                for verification and compliance purposes.
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Enhanced Review Step */}
                  {((currentStep === 3 && isCreator) ||
                    (currentStep === 4 && isMentor) ||
                    (currentStep === 5 && isInvestor)) && (
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">
                          Review Your Information
                        </h3>
                        <p className="text-green-700 text-sm">
                          Please review all the information you've provided
                          before submitting your verification request.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Personal Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span>{formData.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span>{formData.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span>{formData.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Country:</span>
                              <span>{formData.country}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Verification Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Documents:</span>
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">
                                Certificate:
                              </span>
                              {isSigned ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            {isInvestor && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Quiz:</span>
                                {isQuizPassed() ? (
                                  <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                              </div>
                            )}
                            {isMentor && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  Experience:
                                </span>
                                <Check className="h-5 w-5 text-green-600" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Show mentor-specific information */}
                      {isMentor &&
                        (formData as MentorKYCFormData).selectedStartup && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Mentorship Details
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Professional Title:
                                </span>
                                <span>
                                  {
                                    (formData as MentorKYCFormData)
                                      .professionalTitle
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Experience:
                                </span>
                                <span>
                                  {
                                    (formData as MentorKYCFormData)
                                      .yearsOfExperience
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Selected Startup:
                                </span>
                                <span>
                                  {availableStartups.find(
                                    (s) =>
                                      s.id ===
                                      (formData as MentorKYCFormData)
                                        .selectedStartup,
                                  )?.name || 'Unknown'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Availability:
                                </span>
                                <span className="capitalize">
                                  {(formData as MentorKYCFormData).availability}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                      {/* Show incorrect quiz answers for investors */}
                      {isInvestor &&
                        !isQuizPassed() &&
                        Object.keys(incorrectAnswers).length > 0 && (
                          <Card className="border-red-200">
                            <CardHeader>
                              <CardTitle className="text-lg text-red-800">
                                Quiz Corrections Required
                              </CardTitle>
                              <CardDescription className="text-red-600">
                                Please go back and correct the following answers
                                before submission:
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {getIncorrectQuestionsDetails().map(
                                  ({
                                    question,
                                    userAnswer,
                                    correctAnswer,
                                    questionKey,
                                  }) => (
                                    <div
                                      key={questionKey}
                                      className="bg-red-50 p-4 rounded-lg"
                                    >
                                      <h4 className="font-medium text-red-800 mb-2">
                                        {question}
                                      </h4>
                                      <div className="space-y-1 text-sm">
                                        <p className="text-red-600">
                                          <span className="font-medium">
                                            Your answer:
                                          </span>{' '}
                                          {userAnswer}
                                        </p>
                                        <p className="text-green-600">
                                          <span className="font-medium">
                                            Correct answer:
                                          </span>{' '}
                                          {correctAnswer}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                  <p className="text-yellow-800 text-sm">
                                    <AlertCircle className="h-4 w-4 inline mr-2" />
                                    Go back to the Quiz step to update your
                                    answers before proceeding.
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                      {isCreator &&
                        (formData as CreatorKYCFormData).businessName && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Business Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Business Name:
                                </span>
                                <span>
                                  {
                                    (formData as CreatorKYCFormData)
                                      .businessName
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Business Type:
                                </span>
                                <span>
                                  {
                                    (formData as CreatorKYCFormData)
                                      .businessType
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Tax ID:</span>
                                <span>
                                  {(formData as CreatorKYCFormData).taxId}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                    </div>
                  )}

                  <div className="flex justify-between">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousStep}
                      >
                        Previous
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="bg-bantu-green hover:bg-bantu-dark-green ml-auto"
                    >
                      {currentStep === kycSteps.length - 1
                        ? 'Submit Verification'
                        : 'Continue'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
        </CardContent>
      </Card>

      {/* Signature Dialog */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Your Certificate</DialogTitle>
            <DialogDescription>
              Please sign in the box below to validate your digital certificate.
            </DialogDescription>
          </DialogHeader>
          <SignaturePad
            onSave={handleSaveSignature}
            onCancel={handleCancelSignature}
          />
          <DialogFooter className="sm:justify-end">
            <Button variant="ghost" onClick={handleCancelSignature}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const KYC = () => {
  const [userType, setUserType] = useState<'creator' | 'investor' | 'mentor'>(
    'creator',
  );

  const handleTabChange = (value: string) => {
    setUserType(value as 'creator' | 'investor' | 'mentor');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {userType === 'creator'
                ? 'Campaign Creator'
                : userType === 'investor'
                  ? 'Investor'
                  : 'Mentor'}{' '}
              Verification
            </h1>
            <p className="text-gray-600 mb-6">
              Complete the verification process to{' '}
              {userType === 'creator'
                ? 'start fundraising'
                : userType === 'investor'
                  ? 'begin investing'
                  : 'become a qualified mentor'}
            </p>
          </div>

          <Tabs
            value={userType}
            onValueChange={handleTabChange}
            className="w-full mb-8"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="creator">Campaign Creator</TabsTrigger>
              <TabsTrigger value="investor">Investor</TabsTrigger>
              <TabsTrigger value="mentor">Apply As Mentor</TabsTrigger>
            </TabsList>
          </Tabs>

          <KYCProcess userType={userType} onUserTypeChange={setUserType} />
        </div>
      </div>
    </div>
  );
};

export default KYC;
