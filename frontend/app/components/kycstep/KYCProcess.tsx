'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import {
  CreatorKYCFormData,
  InvestorKYCFormData,
  MentorKYCFormData,
  KYCProcessProps,
  personalInfoSchema,
  documentSchema,
  creatorBusinessSchema,
  mentorExperienceSchema,
  investorQuizSchema,
  declarationSchema,
} from '@/app/types/kyc.type';
import {
  creatorKycSteps,
  investorKycSteps,
  mentorKycSteps,
  bothKycSteps,
  quizQuestions,
} from '@/app/types/constant';
import { CertificateSigningStep } from './CertificateSigningStep';
import { DeclarationStep } from './DeclarationStep';
import { InvestorQuizStep } from './InvestorQuizStep';
import { ReviewStep } from './ReviewStep';
import { MentorExperienceStep } from './MentorExperienceStep';
import { DocumentVerificationStep } from './DocumentVerificationStep';
import { PersonalInfoStep } from './PersonalInfoStep';
import { SignatureDialog } from './SignatureDialog';
import { ProgressSteps } from './ProgressSteps';
import { Point } from '@/app/account/settings/kyc/signature/signatureUtils';
import { z } from 'zod';
import { Loader2, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { useKyc } from '@/app/context/kyc/KycContext';
import { KycFormData, KycAddress } from '@/app/types/kyc.type';
import { BusinessInfoStep } from './BusinessInfoStep';
import AlertPopup from '../alertpopup/AlertPopup';

const KYCProcess: React.FC<KYCProcessProps> = ({
  userType,
  onUserTypeChange,
}) => {
  const {
    createKyc,
    uploadDocument,
    loading: kycLoading,
    errors: kycErrors,
    clearErrors,
  } = useKyc();
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
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState<Point[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    [key: string]: File;
  }>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [currentError, setCurrentError] = useState<string>('');
  const [currentSuccess, setCurrentSuccess] = useState<string>('');
  const [isNonProfit, setIsNonProfit] = useState<boolean>(false);

  const isCreator = userType === 'issuer';
  const isInvestor = userType === 'investor';
  const isBoth = userType === 'both';
  const isMentor = userType === 'mentor';

  // Define step types and their order for each user type with nonprofit skipping logic
  const getStepDefinitions = () => {
    const baseSteps = {
      issuer: [
        'personalInfo',
        'nonProfitSelection', // New step to ask if nonprofit
        'businessInfo',
        'documents',
        'certificate',
        'review',
      ],
      investor: [
        'personalInfo',
        'documents',
        'quiz',
        'declaration',
        'certificate',
        'review',
      ],
      both: [
        'personalInfo',
        'nonProfitSelection', // New step to ask if nonprofit
        'businessInfo',
        'documents',
        'quiz',
        'declaration',
        'certificate',
        'review',
      ],
      mentor: [
        'personalInfo',
        'documents',
        'experience',
        'certificate',
        'review',
      ],
    };

    // If nonprofit, skip businessInfo and certificate steps for issuer/both
    if (isNonProfit && (isCreator || isBoth)) {
      const steps = [...baseSteps[userType]];

      // Remove businessInfo step
      const businessInfoIndex = steps.indexOf('businessInfo');
      if (businessInfoIndex !== -1) {
        steps.splice(businessInfoIndex, 1);
      }

      // Remove certificate step
      const certificateIndex = steps.indexOf('certificate');
      if (certificateIndex !== -1) {
        steps.splice(certificateIndex, 1);
      }

      return steps;
    }

    return baseSteps[userType];
  };

  const stepDefinitions = getStepDefinitions();

  const kycSteps = isCreator
    ? creatorKycSteps
    : isInvestor
      ? investorKycSteps
      : isBoth
        ? bothKycSteps
        : mentorKycSteps;

  // Filter kycSteps based on nonprofit selection
  const getFilteredKycSteps = () => {
    if (!isNonProfit || (!isCreator && !isBoth)) {
      return kycSteps;
    }

    // For nonprofit fundraisers, remove business info and certificate steps
    return kycSteps.filter(
      (step) =>
        !step.title.toLowerCase().includes('business') &&
        !step.title.toLowerCase().includes('certificate'),
    );
  };

  const filteredKycSteps = getFilteredKycSteps();

  useEffect(() => {
    // Show alert when there are KYC errors
    if (kycErrors.length > 0) {
      const businessErrors = kycErrors.filter(
        (error) =>
          error.field?.includes('business') || error.type === 'uniqueness',
      );

      if (businessErrors.length > 0) {
        setCurrentError(businessErrors[0].message);
        setShowErrorAlert(true);
      } else if (kycErrors[0]) {
        setCurrentError(kycErrors[0].message);
        setShowErrorAlert(true);
      }
    }
  }, [kycErrors]);

  const showSuccessMessage = (message: string) => {
    setCurrentSuccess(message);
    setShowSuccessAlert(true);
  };

  const showErrorMessage = (message: string) => {
    setCurrentError(message);
    setShowErrorAlert(true);
  };

  const sanitizeFormData = (data: any): any => {
    if (data === null || data === undefined) return data;

    if (Array.isArray(data)) {
      return data.map((item) => sanitizeFormData(item));
    }

    if (
      typeof data === 'object' &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      const sanitized: any = {};
      for (const key in data) {
        sanitized[key] = sanitizeFormData(data[key]);
      }
      return sanitized;
    }

    if (data instanceof Date) {
      return data.toISOString();
    }

    if (data instanceof File) {
      return {
        name: data.name,
        size: data.size,
        type: data.type,
        lastModified: data.lastModified,
      };
    }

    return data;
  };

  const getCurrentStepType = () => {
    return stepDefinitions[currentStep];
  };

  useEffect(() => {
    const savedSignature = localStorage.getItem(`${userType}Signature`);
    if (savedSignature) {
      try {
        const parsedSignature = JSON.parse(savedSignature);
        // Add validation to ensure it's a proper signature array
        if (
          Array.isArray(parsedSignature) &&
          parsedSignature.every(
            (point) =>
              point &&
              typeof point.x === 'number' &&
              typeof point.y === 'number',
          )
        ) {
          setSignature(parsedSignature);
          setIsSigned(parsedSignature.length > 0);
        } else {
          console.warn('Invalid signature format in localStorage');
          localStorage.removeItem(`${userType}Signature`);
        }
      } catch (error) {
        console.error('Error loading signature:', error);
        localStorage.removeItem(`${userType}Signature`);
      }
    }
  }, [userType]);

  const getCurrentSchema = () => {
    const stepType = getCurrentStepType();

    switch (stepType) {
      case 'personalInfo':
        return personalInfoSchema;
      case 'nonProfitSelection':
        return z.object({
          isNonProfit: z.boolean(),
        });
      case 'businessInfo':
        return creatorBusinessSchema;
      case 'documents':
        return documentSchema;
      case 'quiz':
        return investorQuizSchema;
      case 'declaration':
        return declarationSchema;
      case 'experience':
        return mentorExperienceSchema;
      case 'certificate':
        return z.object({});
      case 'review':
        return isCreator || isBoth ? creatorBusinessSchema : z.object({});
      default:
        return z.object({});
    }
  };

  const currentSchema = getCurrentSchema();

  const form = useForm<any>({
    resolver: zodResolver(currentSchema),
    defaultValues: (() => {
      const stepType = getCurrentStepType();

      switch (stepType) {
        case 'personalInfo':
          return {
            fullName: formData.fullName || '',
            email: formData.email || '',
            phone: formData.phone || '',
            dateOfBirth: formData.dateOfBirth || undefined,
            nationality: formData.nationality || '',
            address: formData.address || '',
            city: formData.city || '',
            state: formData.state || '',
            postalCode: formData.postalCode || '',
            country: formData.country || '',
            occupation: formData.occupation || '',
            sourceOfFunds: formData.sourceOfFunds || '',
          };
        case 'nonProfitSelection':
          return {
            isNonProfit: formData.isNonProfit || false,
          };
        case 'businessInfo':
          return {
            businessName: (formData as CreatorKYCFormData).businessName || '',
            businessType: (formData as CreatorKYCFormData).businessType || '',
            businessDescription:
              (formData as CreatorKYCFormData).businessDescription || '',
            businessRegistration:
              (formData as CreatorKYCFormData).businessRegistration || '',
            taxId: (formData as CreatorKYCFormData).taxId || '',
            businessIndustry:
              (formData as CreatorKYCFormData).businessIndustry || '',
            businessEstablishedDate:
              (formData as CreatorKYCFormData).businessEstablishedDate ||
              undefined,
          };
        case 'documents':
          return {
            idType: formData.idType || '',
            idNumber: formData.idNumber || '',
            idDocument: formData.idDocument || undefined,
            proofOfAddress: formData.proofOfAddress || undefined,
          };
        case 'experience':
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
        case 'quiz':
          return Object.keys(quizQuestions).reduce((acc, key) => {
            acc[key] = (formData as any)[key] || '';
            return acc;
          }, {} as any);
        case 'declaration':
          return {
            accreditedInvestor:
              (formData as InvestorKYCFormData).accreditedInvestor || false,
            riskAcknowledgment:
              (formData as InvestorKYCFormData).riskAcknowledgment || false,
            termsAcceptance:
              (formData as InvestorKYCFormData).termsAcceptance || false,
            dataConsent: (formData as InvestorKYCFormData).dataConsent || false,
          };
        case 'review':
          if (isCreator || isBoth) {
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
          return {};
        default:
          return {};
      }
    })(),
  });

  const handleDocumentUpload = async (documentType: string, file: File) => {
    try {
      setUploadedDocuments((prev) => ({ ...prev, [documentType]: file }));
      showSuccessMessage(
        `${documentType.replace('_', ' ')} uploaded successfully`,
      );
    } catch (error) {
      showErrorMessage(`Failed to upload ${documentType.replace('_', ' ')}`);
      console.error('Upload error:', error);
    }
  };

  // Helper function to format dates safely
  const formatDateSafe = (date: any): string | undefined => {
    if (!date) return undefined;

    try {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }

      if (typeof date === 'string') {
        // Try to parse and format string dates
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
      }

      return undefined;
    } catch (error) {
      console.error('Error formatting date:', error);
      return undefined;
    }
  };

  const prepareKycData = (): KycFormData => {
    // Create properly formatted signature data
    const formattedSignature =
      signature && Array.isArray(signature) && signature.length > 0
        ? signature.map((point) => ({
            x: typeof point.x === 'string' ? parseFloat(point.x) : point.x,
            y: typeof point.y === 'string' ? parseFloat(point.y) : point.y,
          }))
        : undefined;

    // Determine KYC type based on user selection
    const kycType =
      userType === 'both'
        ? 'both'
        : userType === 'issuer'
          ? 'issuer'
          : 'investor';

    const baseData = {
      kyc_type: kycType,
      verification_type:
        (formData.idType as
          | 'national_id'
          | 'passport'
          | 'drivers_license'
          | 'voter_id') || 'national_id',
      id_number: formData.idNumber || '',
      id_expiry_date:
        formatDateSafe(new Date()) || new Date().toISOString().split('T')[0],
      date_of_birth: formatDateSafe(formData.dateOfBirth),
      nationality: formData.nationality || '',
      occupation: formData.occupation || '',
      source_of_funds: formData.sourceOfFunds || 'Salary',
      kyc_addresses_attributes: [
        {
          address_type: 'residential',
          street: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          postal_code: formData.postalCode || '',
          country: formData.country || '',
          is_primary: true,
        } as KycAddress,
      ],
      signature_data:
        formattedSignature && formattedSignature.length > 0
          ? formattedSignature
          : null,
      investor_signature_data:
        (kycType === 'investor' || kycType === 'both') &&
        formattedSignature &&
        formattedSignature.length > 0
          ? formattedSignature
          : null,
      issuer_signature_data:
        (kycType === 'issuer' || kycType === 'both') &&
        formattedSignature &&
        formattedSignature.length > 0
          ? formattedSignature
          : null,
      issuer_accepted_terms: true,
      is_non_profit: isNonProfit, // Add nonprofit flag
    };

    // Only include business data if not a nonprofit
    if ((kycType === 'issuer' || kycType === 'both') && !isNonProfit) {
      return {
        ...baseData,
        business_name: (formData as CreatorKYCFormData).businessName || '',
        business_registration_number:
          (formData as CreatorKYCFormData).businessRegistration || '',
        business_tax_id: (formData as CreatorKYCFormData).taxId || '',
        business_industry: (formData as CreatorKYCFormData).businessType || '',
        business_established_date: formatDateSafe(
          (formData as CreatorKYCFormData).businessEstablishedDate,
        ),
      } as KycFormData;
    }

    return baseData as KycFormData;
  };

  const uploadAllDocuments = async (kycId: number) => {
    const uploadPromises = Object.entries(uploadedDocuments).map(
      async ([documentType, file]) => {
        try {
          await uploadDocument(kycId, documentType, file);
          showSuccessMessage(
            `${documentType.replace('_', ' ')} uploaded successfully`,
          );
        } catch (error) {
          console.error(`Failed to upload ${documentType}:`, error);
          showErrorMessage(
            `Failed to upload ${documentType.replace('_', ' ')}`,
          );
          throw error;
        }
      },
    );

    await Promise.all(uploadPromises);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    clearErrors();

    const sanitizedData = sanitizeFormData(data);
    const updatedFormData = { ...formData, ...sanitizedData };
    setFormData(updatedFormData);

    const stepType = getCurrentStepType();

    // Handle nonprofit selection
    if (stepType === 'nonProfitSelection') {
      setIsNonProfit(data.isNonProfit);

      // Skip to the next appropriate step based on nonprofit selection
      if (data.isNonProfit) {
        // For nonprofits, skip businessInfo and certificate steps
        // Find the index of documents step
        const documentsIndex = stepDefinitions.indexOf('documents');
        if (documentsIndex !== -1) {
          setCurrentStep(documentsIndex);
        } else {
          setCurrentStep(currentStep + 1);
        }
      } else {
        // For regular businesses, proceed normally
        setCurrentStep(currentStep + 1);
      }
      setIsSubmitting(false);
      return;
    }

    if (stepType === 'quiz') {
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

    // Skip certificate validation for nonprofits
    if (stepType === 'certificate' && !isNonProfit) {
      if (!isSigned) {
        showErrorMessage('Please sign your certificate before proceeding.');
        setIsSubmitting(false);
        return;
      }
    }

    if (stepType === 'review') {
      // Skip signature check for nonprofits
      if (!isNonProfit && !isSigned) {
        showErrorMessage('Please sign your certificate before submitting.');
        setIsSubmitting(false);
        return;
      }

      if ((isInvestor || isBoth) && !isQuizPassed()) {
        showErrorMessage(
          'Please complete the investor quiz correctly before submitting.',
        );
        setIsSubmitting(false);
        return;
      }

      try {
        const kycData = prepareKycData();

        const newKyc = await createKyc(kycData);

        if (Object.keys(uploadedDocuments).length > 0) {
          await uploadAllDocuments(newKyc.id!);
        }

        const userTypeLabel = isCreator
          ? 'Campaign creator'
          : isInvestor
            ? 'Investor'
            : isBoth
              ? 'Full platform access'
              : 'Mentor';

        const nonprofitLabel = isNonProfit ? ' (Nonprofit)' : '';

        showSuccessMessage(
          `${userTypeLabel}${nonprofitLabel} verification submitted successfully`,
        );

        localStorage.removeItem(`${userType}Signature`);
        setFormData({});
        setSignature([]);
        setIsSigned(false);
        setUploadedDocuments({});
        setIsNonProfit(false);
      } catch (error) {
        console.error('Error submitting KYC:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep < stepDefinitions.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);

      // If going back from documents step and user is nonprofit, adjust the step
      const currentStepType = stepDefinitions[currentStep];
      if (currentStepType === 'documents' && isNonProfit) {
        // Find the nonprofit selection step
        const nonProfitStepIndex =
          stepDefinitions.indexOf('nonProfitSelection');
        if (nonProfitStepIndex !== -1 && currentStep > nonProfitStepIndex) {
          setCurrentStep(nonProfitStepIndex);
        }
      }
    }
  };

  const handleOpenSignDialog = () => {
    setIsSignDialogOpen(true);
  };

  const handleCancelSignature = () => {
    setIsSignDialogOpen(false);
  };

  const handleSaveSignature = (newSignature: Point[]) => {
    if (
      !newSignature ||
      !Array.isArray(newSignature) ||
      newSignature.length < 5
    ) {
      showErrorMessage('Please add a valid signature with at least 5 points');
      return;
    }

    const isValidSignature = newSignature.every(
      (point) =>
        point && typeof point.x === 'number' && typeof point.y === 'number',
    );

    if (!isValidSignature) {
      showErrorMessage('Invalid signature format');
      return;
    }

    setSignature(newSignature);
    setIsSigned(true);
    setIsSignDialogOpen(false);
    localStorage.setItem(`${userType}Signature`, JSON.stringify(newSignature));
    showSuccessMessage('Certificate signed successfully!');
  };

  const handleRemoveSignature = () => {
    setSignature([]);
    setIsSigned(false);
    localStorage.removeItem(`${userType}Signature`);
  };

  const isQuizPassed = () => {
    return Object.values(quizResults).every((result) => result === true);
  };

  // New component for nonprofit selection step
  const NonProfitSelectionStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Organization Type</h3>
          <p className="text-gray-600">
            Are you registering as a nonprofit organization?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              id="nonprofit-yes"
              value="true"
              {...form.register('isNonProfit')}
              className="h-4 w-4 text-bantu-green focus:ring-bantu-green"
            />
            <label
              htmlFor="nonprofit-yes"
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">Yes, Nonprofit Organization</span>
              <span className="text-sm text-gray-500">
                Skip business registration details
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              id="nonprofit-no"
              value="false"
              {...form.register('isNonProfit')}
              className="h-4 w-4 text-bantu-green focus:ring-bantu-green"
            />
            <label
              htmlFor="nonprofit-no"
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">No, For-Profit Business</span>
              <span className="text-sm text-gray-500">
                Complete full business verification
              </span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            What's the difference?
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Nonprofit</strong>: Simplified process, no business
              registration required
            </li>
            <li>
              • <strong>For-Profit</strong>: Complete business verification with
              registration details
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    const stepType = getCurrentStepType();

    switch (stepType) {
      case 'personalInfo':
        return <PersonalInfoStep />;
      case 'nonProfitSelection':
        return <NonProfitSelectionStep />;
      case 'businessInfo':
        return <BusinessInfoStep />;
      case 'documents':
        return (
          <DocumentVerificationStep onDocumentUpload={handleDocumentUpload} />
        );
      case 'experience':
        return <MentorExperienceStep />;
      case 'quiz':
        return (
          <InvestorQuizStep
            quizResults={quizResults}
            incorrectAnswers={incorrectAnswers}
          />
        );
      case 'declaration':
        return <DeclarationStep />;
      case 'certificate':
        // Skip certificate step for nonprofits
        if (isNonProfit) {
          // Automatically proceed to next step
          setTimeout(() => {
            if (currentStep < stepDefinitions.length - 1) {
              setCurrentStep(currentStep + 1);
            }
          }, 0);
          return (
            <div className="text-center p-8">
              Skipping certificate step for nonprofit verification...
            </div>
          );
        }
        return (
          <CertificateSigningStep
            isSigned={isSigned}
            signature={signature}
            onSignClick={handleOpenSignDialog}
            onRemoveSignature={handleRemoveSignature}
            onPreviousStep={goToPreviousStep}
            onSubmit={() => onSubmit({})}
          />
        );
      case 'review':
        return (
          <ReviewStep
            formData={formData}
            isSigned={isSigned}
            isQuizPassed={isQuizPassed()}
            incorrectAnswers={incorrectAnswers}
            isCreator={isCreator}
            isInvestor={isInvestor}
            isBoth={isBoth}
            isMentor={isMentor}
            isNonProfit={isNonProfit}
            uploadedDocuments={uploadedDocuments}
            signatureType={isInvestor || isBoth ? 'Investor' : 'Issuer'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressSteps steps={filteredKycSteps} currentStep={currentStep} />

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>
            {stepDefinitions[currentStep] === 'nonProfitSelection'
              ? 'Organization Type'
              : kycSteps.find((step) =>
                  step.title
                    .toLowerCase()
                    .includes(
                      stepDefinitions[currentStep]
                        .replace(/([A-Z])/g, ' $1')
                        .toLowerCase(),
                    ),
                )?.title || filteredKycSteps[currentStep]?.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {getCurrentStepType() === 'certificate' && !isNonProfit ? (
            renderStepContent()
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {renderStepContent()}
                <div className="flex justify-between">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={kycLoading}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="bg-bantu-green hover:bg-bantu-dark-green ml-auto"
                    disabled={isSubmitting || kycLoading}
                  >
                    {isSubmitting || kycLoading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </span>
                    ) : currentStep === stepDefinitions.length - 1 ? (
                      'Submit Verification'
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <SignatureDialog
        isOpen={isSignDialogOpen}
        onOpenChange={setIsSignDialogOpen}
        onSave={handleSaveSignature}
        onCancel={handleCancelSignature}
      />

      {/* Error Alert Popup */}
      <AlertPopup
        title="Error"
        message={currentError}
        isOpen={showErrorAlert}
        setIsOpen={setShowErrorAlert}
        onConfirm={() => {
          setShowErrorAlert(false);
          clearErrors();
        }}
        onCancel={() => {
          setShowErrorAlert(false);
          clearErrors();
        }}
        icon={<AlertCircle className="w-6 h-6 text-red-600" />}
        confirmText="OK"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />

      {/* Success Alert Popup */}
      <AlertPopup
        title="Success"
        message={currentSuccess}
        isOpen={showSuccessAlert}
        setIsOpen={setShowSuccessAlert}
        onConfirm={() => {
          setShowSuccessAlert(false);
        }}
        onCancel={() => {
          setShowSuccessAlert(false);
        }}
        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        confirmText="OK"
        confirmButtonClass="bg-green-600 hover:bg-green-700 focus:ring-green-500"
      />
    </div>
  );
};

export default KYCProcess;
