// KYCProcess.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/app/components/ui/sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

const KYCProcess: React.FC<KYCProcessProps> = ({
  userType,
  onUserTypeChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<
    Partial<CreatorKYCFormData | InvestorKYCFormData | MentorKYCFormData>
  >({});
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({});
  const [incorrectAnswers, setIncorrectAnswers] = useState<{
    [key: string]: { userAnswer: string; correctAnswer: string };
  }>({});
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState<Point[]>([]);
  const [signatureImage, setSignatureImage] = useState<string>('');

  const isCreator = userType === 'creator';
  const isInvestor = userType === 'investor';
  const isMentor = userType === 'mentor';

  const kycSteps = isCreator
    ? creatorKycSteps
    : isInvestor
      ? investorKycSteps
      : mentorKycSteps;

  const convertSignatureToImage = (signaturePoints: Point[]): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (!ctx || signaturePoints.length === 0) {
        resolve('');
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      signaturePoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.stroke();
      resolve(canvas.toDataURL('image/png'));
    });
  };

  useEffect(() => {
    const savedSignature = localStorage.getItem(`${userType}Signature`);
    if (savedSignature) {
      try {
        const parsedSignature = JSON.parse(savedSignature);
        setSignature(parsedSignature.points || []);
        setSignatureImage(parsedSignature.image || '');
        setIsSigned(parsedSignature.points?.length > 0);
      } catch (error) {
        console.error('Error loading signature:', error);
      }
    }
  }, [userType]);

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

  const onSubmit = async (data: any) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

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

      try {
        const finalFormData = {
          ...updatedFormData,
          signature: signatureImage,
          signedAt: new Date().toISOString()
        };

        const userTypeLabel = isCreator
          ? 'Campaign creator'
          : isInvestor
            ? 'Investor'
            : 'Mentor';

        console.log('Final form data with signature:', finalFormData);
        toast.success(`${userTypeLabel} verification submitted successfully`);

        // Uncomment to send to your API:
        /*
        const response = await fetch('/api/kyc/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalFormData),
        });
        if (!response.ok) throw new Error('Submission failed');
        toast.success('Verification submitted successfully!');
        */
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Failed to submit verification');
      }
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

  const handleSaveSignature = async (newSignature: Point[]) => {
    if (newSignature.length < 5) {
      toast.error('Please add a valid signature');
      return;
    }

    try {
      const image = await convertSignatureToImage(newSignature);
      setSignature(newSignature);
      setSignatureImage(image);
      setIsSigned(true);
      setIsSignDialogOpen(false);
      
      localStorage.setItem(`${userType}Signature`, JSON.stringify({
        points: newSignature,
        image: image
      }));
      
      toast.success('Certificate signed successfully!');
    } catch (error) {
      console.error('Error saving signature:', error);
      toast.error('Failed to save signature');
    }
  };

  const handleRemoveSignature = () => {
    setSignature([]);
    setSignatureImage('');
    setIsSigned(false);
    localStorage.removeItem(`${userType}Signature`);
  };

  const isQuizPassed = () => {
    return Object.values(quizResults).every((result) => result === true);
  };

  return (
    <div>
      <ProgressSteps steps={kycSteps} currentStep={currentStep} />

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{kycSteps[currentStep].title}</CardTitle>
          <CardDescription>
            {getStepDescription(currentStep, isCreator, isInvestor, isMentor)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isCertificateStep(currentStep, isCreator, isInvestor, isMentor) ? (
            <CertificateSigningStep
              isSigned={isSigned}
              signature={signature}
              onSignClick={handleOpenSignDialog}
              onRemoveSignature={handleRemoveSignature}
              onPreviousStep={goToPreviousStep}
              onSubmit={() => onSubmit({})}
            />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {currentStep === 0 && <PersonalInfoStep />}
                {currentStep === 1 && <DocumentVerificationStep />}
                {isMentor && currentStep === 2 && <MentorExperienceStep />}
                {isInvestor && currentStep === 2 && (
                  <InvestorQuizStep
                    quizResults={quizResults}
                    incorrectAnswers={incorrectAnswers}
                  />
                )}
                {isInvestor && currentStep === 3 && <DeclarationStep />}
                {isReviewStep(currentStep, isCreator, isInvestor, isMentor) && (
                  <ReviewStep
                    formData={formData}
                    isSigned={isSigned}
                    isQuizPassed={isQuizPassed()}
                    incorrectAnswers={incorrectAnswers}
                    isCreator={isCreator}
                    isInvestor={isInvestor}
                    isMentor={isMentor}
                  />
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

      <SignatureDialog
        isOpen={isSignDialogOpen}
        onOpenChange={setIsSignDialogOpen}
        onSave={handleSaveSignature}
        onCancel={handleCancelSignature}
      />
    </div>
  );
};

function getStepDescription(
  currentStep: number,
  isCreator: boolean,
  isInvestor: boolean,
  isMentor: boolean,
) {
  if (currentStep === 0)
    return 'Please provide your personal information accurately.';
  if (currentStep === 1)
    return 'Upload your identification documents for verification.';
  if (currentStep === 2 && isInvestor)
    return 'Complete this quiz to demonstrate your understanding of startup investment risks.';
  if (currentStep === 2 && isMentor)
    return 'Tell us about your professional experience and expertise.';
  if (currentStep === 3 && isInvestor)
    return 'Please read and acknowledge the following declarations.';
  if (
    (currentStep === 2 && isCreator) ||
    (currentStep === 3 && isMentor) ||
    (currentStep === 4 && isInvestor)
  ) {
    return 'Sign your digital certificate to verify your identity.';
  }
  return 'Review your information and submit your verification request.';
}

function isCertificateStep(
  currentStep: number,
  isCreator: boolean,
  isInvestor: boolean,
  isMentor: boolean,
) {
  return (
    (currentStep === 2 && isCreator) ||
    (currentStep === 3 && isMentor) ||
    (currentStep === 4 && isInvestor)
  );
}

function isReviewStep(
  currentStep: number,
  isCreator: boolean,
  isInvestor: boolean,
  isMentor: boolean,
) {
  return (
    (currentStep === 3 && isCreator) ||
    (currentStep === 4 && isMentor) ||
    (currentStep === 5 && isInvestor)
  );
}

export default KYCProcess;