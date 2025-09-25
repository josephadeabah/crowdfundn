// types.ts
import { z } from 'zod';
import { Point } from '@/app/account/settings/kyc/signature/signatureUtils';

export interface KycError {
  field?: string;
  message: string;
  type: 'uniqueness' | 'validation' | 'general';
}

export interface KycAddress {
  id?: number;
  address_type: 'residential' | 'mailing' | 'business';
  street: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface KycDocument {
  id?: number;
  document_type: string;
  file_name?: string;
  file_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  verified_at?: string;
  verified_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Kyc {
  id?: number;
  reference: string;
  kyc_type: 'investor' | 'issuer' | 'both' | 'mentor';
  status: 'pending' | 'in_review' | 'verified' | 'rejected' | 'expired';
  verification_type:
    | 'national_id'
    | 'passport'
    | 'drivers_license'
    | 'voter_id';
  id_number: string;
  id_expiry_date: string;
  date_of_birth?: string;
  nationality?: string;
  occupation?: string;
  source_of_funds?: string;
  risk_level?: number;
  business_name?: string;
  business_registration_number?: string;
  business_tax_id?: string;
  business_industry?: string;
  business_established_date?: string;
  addresses: KycAddress[];
  documents: KycDocument[];
  signature_data?: any;
  investor_signature_data?: any;
  issuer_accepted_terms?: boolean;
  signature_completed_at?: string;
  issuer_signature_completed_at?: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface KycFormData {
  kyc_type: 'investor' | 'issuer' | 'both' | 'mentor';
  verification_type:
    | 'national_id'
    | 'passport'
    | 'drivers_license'
    | 'voter_id';
  id_number: string;
  id_expiry_date: string;
  date_of_birth?: string;
  nationality?: string;
  occupation?: string;
  source_of_funds?: string;
  business_name?: string;
  business_registration_number?: string;
  business_tax_id?: string;
  business_industry?: string;
  business_established_date?: string;
  kyc_addresses_attributes: KycAddress[];
  signature_data?: Point[];
  investor_signature_data?: Point[];
  issuer_signature_data?: Point[];
  issuer_accepted_terms?: boolean;
}

export interface KycState {
  kycs: Kyc[];
  currentKyc: Kyc | null;
  loading: boolean;
  error: string | null;
  errors: KycError[];
  clearErrors: () => void;
  fetchKycs: () => Promise<void>;
  fetchKyc: (id: number) => Promise<void>;
  createKyc: (kycData: KycFormData) => Promise<Kyc>;
  updateKyc: (id: number, kycData: Partial<KycFormData>) => Promise<Kyc>;
  deleteKyc: (id: number) => Promise<void>;
  submitKyc: (id: number) => Promise<void>;
  verifyKyc: (id: number, reviewNotes?: string) => Promise<void>;
  rejectKyc: (id: number, rejectionReason: string) => Promise<void>;
  fetchKycDocuments: (id: number) => Promise<KycDocument[]>;
  uploadDocument: (
    kycId: number,
    documentType: string,
    file: File,
  ) => Promise<KycDocument>;
}

// app/types/kyc.types.ts
export interface BaseKYCFormData {
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
  occupation?: string;
  sourceOfFunds?: string;
  state?: string;
  isNonProfit: boolean
}

export type CreatorKYCFormData = BaseKYCFormData & {
  businessName: string;
  businessType: string;
  businessDescription: string;
  businessRegistration: string;
  businessIndustry: string;
  businessEstablishedDate: string;
  taxId: string;
};

export type InvestorKYCFormData = BaseKYCFormData & {
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

export type MentorKYCFormData = BaseKYCFormData & {
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

// Add this type for the form data state
export type KYCFormDataUnion = Partial<
  BaseKYCFormData & CreatorKYCFormData & InvestorKYCFormData & MentorKYCFormData
>;

export type UserType = 'issuer' | 'investor' | 'both' | 'mentor';

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
  occupation: z.string().min(1, 'Occupation is required'), // Added
  sourceOfFunds: z.string().min(1, 'Source of funds is required'), // Added
});

export const documentSchema = z.object({
  idType: z.string().min(1, 'Please select an ID type'),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
  idDocument: z.any().optional(),
  proofOfAddress: z.any().optional(),
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
  businessIndustry: z.string().min(1, 'Business industry is required'), // Added
  businessEstablishedDate: z.date().refine((date) => {
    return date <= new Date();
  }, 'Business established date cannot be in the future'), // Added
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
  accreditedInvestor: z.boolean().optional().default(false),
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
