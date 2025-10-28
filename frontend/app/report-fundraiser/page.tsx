'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaCheck,
  FaInfoCircle,
} from 'react-icons/fa';
import { ReportFormData } from '../types/reports.types';
import { useAuth } from '@/app/context/auth/AuthContext'; // Import useAuth

// Move the main content to a separate component that uses useSearchParams
function ReportFundraiserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth(); // Get user and token from auth context

  const campaignId = searchParams.get('campaignId');
  const userId = searchParams.get('userId');

  const [formData, setFormData] = useState<ReportFormData>({
    report_type: '',
    description: '',
    campaign_id: campaignId || '',
    reported_user_id: userId || '',
    contact_email: '',
    evidence_links: [''],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [campaignInfo, setCampaignInfo] = useState<any>(null);

  const reportTypes = [
    {
      value: 'spam',
      label: 'Spam or Misleading',
      description:
        'This campaign appears to be spam, fake, or intentionally misleading',
    },
    {
      value: 'inappropriate_content',
      label: 'Inappropriate Content',
      description:
        'Contains offensive, explicit, or otherwise inappropriate content',
    },
    {
      value: 'fraudulent_activity',
      label: 'Fraudulent Activity',
      description: 'Suspected fraud, scam, or deceptive practices',
    },
    {
      value: 'misleading_information',
      label: 'Misleading Information',
      description:
        'Contains false claims, inaccurate information, or misrepresentation',
    },
    {
      value: 'harassment',
      label: 'Harassment or Abuse',
      description: 'Promotes harassment, hate speech, or abusive behavior',
    },
    {
      value: 'intellectual_property',
      label: 'Intellectual Property Violation',
      description:
        'Infringes on copyrights, trademarks, or other intellectual property rights',
    },
    {
      value: 'privacy_violation',
      label: 'Privacy Violation',
      description:
        'Violates privacy rights or shares personal information without consent',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Other issues not covered by the categories above',
    },
  ];

  // Check if user is authenticated on component mount
  useEffect(() => {
    if (!user || !token) {
      setErrors({ submit: 'Please sign in to submit a report' });
    }
  }, [user, token]);

  // Fetch campaign info if we have a campaignId
  useEffect(() => {
    const fetchCampaignInfo = async () => {
      if (campaignId && token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            setCampaignInfo(data);
          }
        } catch (error) {
          console.error('Error fetching campaign info:', error);
        }
      }
    };

    fetchCampaignInfo();
  }, [campaignId, token]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEvidenceLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.evidence_links];
    newLinks[index] = value;
    setFormData((prev) => ({
      ...prev,
      evidence_links: newLinks,
    }));
  };

  const addEvidenceLink = () => {
    setFormData((prev) => ({
      ...prev,
      evidence_links: [...prev.evidence_links, ''],
    }));
  };

  const removeEvidenceLink = (index: number) => {
    if (formData.evidence_links.length > 1) {
      const newLinks = formData.evidence_links.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        evidence_links: newLinks,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check authentication first
    if (!user || !token) {
      newErrors.submit = 'Please sign in to submit a report';
      setErrors(newErrors);
      return false;
    }

    if (!formData.report_type) {
      newErrors.report_type = 'Please select a report type';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a detailed description';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (
      formData.contact_email &&
      !/\S+@\S+\.\S+/.test(formData.contact_email)
    ) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    // Validate evidence links
    formData.evidence_links.forEach((link, index) => {
      if (link.trim() && !isValidUrl(link)) {
        newErrors[`evidence_${index}`] = 'Please enter a valid URL';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the token from useAuth hook instead of localStorage
      if (!token) {
        setErrors({ submit: 'Please sign in to submit a report' });
        setIsSubmitting(false);
        return;
      }

      // CORRECTED ENDPOINT: Use the full API path
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            report: {
              ...formData,
              evidence_links: formData.evidence_links.filter(
                (link) => link.trim() !== '',
              ),
            },
          }),
        },
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setErrors({
          submit:
            errorData.errors?.[0] ||
            'Failed to submit report. Please try again.',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show authentication required message if user is not logged in
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-4">
              You need to be signed in to submit a report.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Report Submitted
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your report. Our team will review it and take
              appropriate action if necessary.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We take all reports seriously and will investigate this matter
              promptly.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/explore/advance')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Back to Explore
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedReportType = reportTypes.find(
    (type) => type.value === formData.report_type,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={campaignId ? `/campaign/${campaignId}` : '/explore'}>
            <button className="flex items-center text-green-600 hover:text-green-800 mb-4">
              <FaArrowLeft className="mr-2" />
              Back to {campaignId ? 'Campaign' : 'Explore'}
            </button>
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Report Content
              </h1>
              <p className="text-gray-600 mt-1">
                Help us keep the platform safe and trustworthy
              </p>
            </div>
          </div>

          {/* Campaign Info */}
          {campaignInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">
                You are reporting:
              </h3>
              <p className="text-green-800 font-medium">{campaignInfo.title}</p>
              <p className="text-green-700 text-sm">
                by {campaignInfo.fundraiser?.name}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type */}
            <div>
              <label
                htmlFor="report_type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What are you reporting? *
              </label>
              <select
                id="report_type"
                name="report_type"
                value={formData.report_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.report_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a reason</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.report_type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.report_type}
                </p>
              )}
              {selectedReportType && (
                <div className="mt-2 flex items-start text-sm text-gray-600">
                  <FaInfoCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{selectedReportType.description}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Detailed Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Please provide as much detail as possible about what you're reporting and why. Include specific examples, timestamps, or any other relevant information that can help us understand the issue."
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>Minimum 10 characters</span>
                <span>{formData.description.length}/1000</span>
              </div>
            </div>

            {/* Evidence Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Links (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Add links to screenshots, documents, or other evidence that
                supports your report.
              </p>
              <div className="space-y-3">
                {formData.evidence_links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) =>
                          handleEvidenceLinkChange(index, e.target.value)
                        }
                        placeholder="https://example.com/evidence"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                          errors[`evidence_${index}`]
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                      />
                      {errors[`evidence_${index}`] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors[`evidence_${index}`]}
                        </p>
                      )}
                    </div>
                    {formData.evidence_links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEvidenceLink(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex-shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEvidenceLink}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  + Add Another Link
                </button>
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label
                htmlFor="contact_email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contact Email (Optional)
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  errors.contact_email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contact_email}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                We'll only use this to contact you if we need more information
                about your report.
              </p>
            </div>

            {/* Submit Button */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <p className="text-xs text-gray-600 text-center">
                By submitting this report, you agree to our Terms of Service and
                confirm that the information provided is accurate to the best of
                your knowledge. False reporting may result in account
                suspension.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ReportFundraiserPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ReportFundraiserContent />
    </Suspense>
  );
}
