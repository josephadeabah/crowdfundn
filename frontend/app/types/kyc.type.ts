// types.ts
import { z } from 'zod';

export type CreatorKYCFormData = {
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
};

export type InvestorKYCFormData = {
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
};

export type MentorKYCFormData = {
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
};

export type UserType = 'creator' | 'investor' | 'mentor';

export interface KYCProcessProps {
  userType: UserType;
  onUserTypeChange: (userType: UserType) => void;
}

// Schemas
export const personalInfoSchema = z.object({
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

export const documentSchema = z.object({
  idType: z.string().min(1, 'Please select an ID type'),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
  idDocument: z.string().min(1, 'Please upload your ID document'),
  proofOfAddress: z.string().min(1, 'Please upload proof of address'),
});

export const creatorBusinessSchema = z.object({
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

export const mentorExperienceSchema = z.object({
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

export const investorQuizSchema = z.object({
  startupRisk: z.string().min(1, 'Please select your answer'),
  liquidityRisk: z.string().min(1, 'Please select your answer'),
  dilutionRisk: z.string().min(1, 'Please select your answer'),
  totalLossRisk: z.string().min(1, 'Please select your answer'),
  investmentHorizon: z.string().min(1, 'Please select your answer'),
  dueDiligence: z.string().min(1, 'Please select your answer'),
  diversification: z.string().min(1, 'Please select your answer'),
  exitStrategy: z.string().min(1, 'Please select your answer'),
});

export const declarationSchema = z.object({
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

export const getMinimumBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};
