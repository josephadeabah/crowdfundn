// KYCProcess.tsx
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
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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

  const isCreator = userType === 'creator';
  const isInvestor = userType === 'investor';
  const isMentor = userType === 'mentor';

  // Define step types and their order for each user type
  const stepDefinitions = {
    creator: [
      'personalInfo',
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
    mentor: [
      'personalInfo',
      'documents',
      'experience',
      'certificate',
      'review',
    ],
  };

  const kycSteps = isCreator
    ? creatorKycSteps
    : isInvestor
      ? investorKycSteps
      : mentorKycSteps;

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
    return stepDefinitions[userType][currentStep];
  };

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

  const getCurrentSchema = () => {
    const stepType = getCurrentStepType();

    switch (stepType) {
      case 'personalInfo':
        return personalInfoSchema;
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
        return isCreator ? creatorBusinessSchema : z.object({});
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
            postalCode: formData.postalCode || '',
            country: formData.country || '',
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
          if (isCreator) {
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

  const prepareKycData = (): KycFormData => {
    const baseData = {
      kyc_type: userType === 'creator' ? 'issuer' : 'investor',
      verification_type: formData.idType as
        | 'national_id'
        | 'passport'
        | 'drivers_license'
        | 'voter_id',
      id_number: formData.idNumber || '',
      id_expiry_date: new Date().toISOString().split('T')[0],
      date_of_birth:
        formData.dateOfBirth &&
        typeof formData.dateOfBirth === 'object' &&
        formData.dateOfBirth !== null &&
        (formData.dateOfBirth as object) instanceof Date
          ? (formData.dateOfBirth as Date).toISOString().split('T')[0]
          : typeof formData.dateOfBirth === 'string'
            ? formData.dateOfBirth
            : '',
      nationality: formData.nationality || '',
      occupation: formData.occupation || '',
      source_of_funds: formData.sourceOfFunds || 'Salary',
      addresses_attributes: [
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
      signature_data: signature,
    };

    if (userType === 'creator' || userType === 'mentor') {
      return {
        ...baseData,
        kyc_type: 'issuer',
        business_name: (formData as CreatorKYCFormData).businessName || '',
        business_registration_number:
          (formData as CreatorKYCFormData).businessRegistration || '',
        business_tax_id: (formData as CreatorKYCFormData).taxId || '',
        business_industry: (formData as CreatorKYCFormData).businessType || '',
        issuer_accepted_terms: true,
      } as KycFormData;
    }

    return {
      ...baseData,
      kyc_type: 'investor',
      investor_signature_data: signature,
    } as KycFormData;
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

    if (stepType === 'certificate') {
      if (!isSigned) {
        showErrorMessage('Please sign your certificate before proceeding.');
        setIsSubmitting(false);
        return;
      }
    }

    if (stepType === 'review') {
      if (!isSigned) {
        showErrorMessage('Please sign your certificate before submitting.');
        setIsSubmitting(false);
        return;
      }

      if (isInvestor && !isQuizPassed()) {
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
            : 'Mentor';

        showSuccessMessage(
          `${userTypeLabel} verification submitted successfully`,
        );

        localStorage.removeItem(`${userType}Signature`);
        setFormData({});
        setSignature([]);
        setIsSigned(false);
        setUploadedDocuments({});
      } catch (error) {
        console.error('Error submitting KYC:', error);
        // Error handling is done through context errors
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep < kycSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsSubmitting(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOpenSignDialog = () => {
    setIsSignDialogOpen(true);
  };

  const handleCancelSignature = () => {
    setIsSignDialogOpen(false);
  };

  const handleSaveSignature = (newSignature: Point[]) => {
    if (newSignature.length < 5) {
      showErrorMessage('Please add a valid signature');
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

  const renderStepContent = () => {
    const stepType = getCurrentStepType();

    switch (stepType) {
      case 'personalInfo':
        return <PersonalInfoStep />;
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
            isMentor={isMentor}
            uploadedDocuments={uploadedDocuments}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <ProgressSteps steps={kycSteps} currentStep={currentStep} />

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{kycSteps[currentStep]?.title}</CardTitle>
        </CardHeader>

        <CardContent>
          {getCurrentStepType() === 'certificate' ? (
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
                    ) : currentStep === kycSteps.length - 1 ? (
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
