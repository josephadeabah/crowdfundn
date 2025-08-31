// ReviewStep.tsx
'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { CreatorKYCFormData } from '@/app/types/kyc.type';

interface ReviewStepProps {
  formData: any;
  isSigned: boolean;
  isQuizPassed: boolean;
  incorrectAnswers: {
    [key: string]: { userAnswer: string; correctAnswer: string };
  };
  isCreator: boolean;
  isInvestor: boolean;
  isBoth: boolean; // Added isBoth prop
  isMentor: boolean;
  uploadedDocuments: { [key: string]: File };
  signatureType: string;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  isSigned,
  isQuizPassed,
  incorrectAnswers,
  isCreator,
  isInvestor,
  isBoth, // Added isBoth
  isMentor,
  uploadedDocuments,
  signatureType,
}) => {
  // Determine signature label based on signature type
  const signatureLabel =
    signatureType === 'Investor' ? 'Investment' : 'Certificate';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Full Name:</strong> {formData.fullName}
            </div>
            <div>
              <strong>Email:</strong> {formData.email}
            </div>
            <div>
              <strong>Phone:</strong> {formData.phone}
            </div>
            <div>
              <strong>Date of Birth:</strong> {formData.dateOfBirth}
            </div>
            <div>
              <strong>Nationality:</strong> {formData.nationality}
            </div>
            <div>
              <strong>Occupation:</strong> {formData.occupation}
            </div>
            <div>
              <strong>Source of Funds:</strong> {formData.sourceOfFunds}
            </div>
            <div className="col-span-2">
              <strong>Address:</strong> {formData.address}, {formData.city},{' '}
              {formData.country}
            </div>
          </div>
        </CardContent>
      </Card>

      {(isCreator || isBoth || isMentor) && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Business Name:</strong>{' '}
                {(formData as CreatorKYCFormData).businessName}
              </div>
              <div>
                <strong>Business Type:</strong>{' '}
                {(formData as CreatorKYCFormData).businessType}
              </div>
              <div>
                <strong>Business Industry:</strong>{' '}
                {(formData as CreatorKYCFormData).businessIndustry}
              </div>
              <div>
                <strong>Registration Number:</strong>{' '}
                {(formData as CreatorKYCFormData).businessRegistration}
              </div>
              <div>
                <strong>Tax ID:</strong>{' '}
                {(formData as CreatorKYCFormData).taxId}
              </div>
              <div>
                <strong>Established Date:</strong>{' '}
                {(formData as CreatorKYCFormData).businessEstablishedDate}
              </div>
              <div className="col-span-2">
                <strong>Business Description:</strong>{' '}
                {(formData as CreatorKYCFormData).businessDescription}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(uploadedDocuments).map(([docType, file]) => (
              <div key={docType} className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="capitalize">{docType.replace('_', ' ')}:</span>
                <span className="text-sm text-green-600">{file.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {(isInvestor || isBoth) && (
        <Card>
          <CardHeader>
            <CardTitle>Investor Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              {isQuizPassed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span>Quiz Status: {isQuizPassed ? 'Passed' : 'Failed'}</span>
            </div>
            {!isQuizPassed && Object.keys(incorrectAnswers).length > 0 && (
              <div className="space-y-2">
                <strong>Incorrect Answers:</strong>
                {Object.entries(incorrectAnswers).map(([question, answers]) => (
                  <div key={question} className="text-sm text-red-500">
                    <div>Your answer: {answers.userAnswer}</div>
                    <div>Correct answer: {answers.correctAnswer}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Signature Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            {isSigned ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>
              {signatureType} Signature: {isSigned ? 'Provided' : 'Pending'}
            </span>
          </div>
          {isSigned && (
            <p className="text-sm text-gray-600">
              Your {signatureType.toLowerCase()} signature will be used for{' '}
              {signatureLabel.toLowerCase()} verification and documents.
            </p>
          )}
        </CardContent>
      </Card>

      {!isSigned && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Please provide your {signatureType.toLowerCase()} signature before
            submitting the verification.
          </p>
        </div>
      )}

      {(isInvestor || isBoth) && !isQuizPassed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Please complete the investor quiz correctly before submitting.
          </p>
        </div>
      )}

      {isBoth && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Full Platform Access:</strong> You are applying for both
            fundraising AND investment capabilities. Once verified, you'll be
            able to create campaigns and invest in other startups.
          </p>
        </div>
      )}
    </div>
  );
};
