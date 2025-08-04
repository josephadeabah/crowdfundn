// components/ReviewStep.tsx
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/app/components/ui/card';
import { availableStartups, quizQuestions } from '@/app/types/constant';

interface ReviewStepProps {
  formData: any;
  isSigned: boolean;
  isQuizPassed: boolean;
  incorrectAnswers: {
    [key: string]: { userAnswer: string; correctAnswer: string };
  };
  isCreator: boolean;
  isInvestor: boolean;
  isMentor: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  isSigned,
  isQuizPassed,
  incorrectAnswers,
  isCreator,
  isInvestor,
  isMentor,
}) => {
  const getIncorrectQuestionsDetails = () => {
    return Object.entries(incorrectAnswers).map(([questionKey, details]) => ({
      question:
        quizQuestions[questionKey as keyof typeof quizQuestions].question,
      userAnswer: details.userAnswer,
      correctAnswer: details.correctAnswer,
      questionKey,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">
          Review Your Information
        </h3>
        <p className="text-green-700 text-sm">
          Please review all the information you've provided before submitting
          your verification request.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
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
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Documents:</span>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Certificate:</span>
              {isSigned ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            {isInvestor && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quiz:</span>
                {isQuizPassed ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            )}
            {isMentor && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Experience:</span>
                <Check className="h-5 w-5 text-green-600" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isMentor && formData.selectedStartup && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mentorship Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Professional Title:</span>
              <span>{formData.professionalTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span>{formData.yearsOfExperience}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Selected Startup:</span>
              <span>
                {availableStartups.find(
                  (s) => s.id === formData.selectedStartup,
                )?.name || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Availability:</span>
              <span className="capitalize">{formData.availability}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {isInvestor &&
        !isQuizPassed &&
        Object.keys(incorrectAnswers).length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-800">
                Quiz Corrections Required
              </CardTitle>
              <CardDescription className="text-red-600">
                Please go back and correct the following answers before
                submission:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getIncorrectQuestionsDetails().map(
                  ({ question, userAnswer, correctAnswer, questionKey }) => (
                    <div key={questionKey} className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">
                        {question}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-red-600">
                          <span className="font-medium">Your answer:</span>{' '}
                          {userAnswer}
                        </p>
                        <p className="text-green-600">
                          <span className="font-medium">Correct answer:</span>{' '}
                          {correctAnswer}
                        </p>
                      </div>
                    </div>
                  ),
                )}
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Go back to the Quiz step to update your answers before
                    proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {isCreator && formData.businessName && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Business Name:</span>
              <span>{formData.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Business Type:</span>
              <span>{formData.businessType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ID:</span>
              <span>{formData.taxId}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
