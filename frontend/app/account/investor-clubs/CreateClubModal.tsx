'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/app/components/modal/Modal';
import { clubService } from './clubservice';
import { useAuth } from '@/app/context/auth/AuthContext';
import { categoriesWithIcons, Category } from '@/app/utils/helpers/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import AlertPopup from '@/app/components/alertpopup/AlertPopup';
import { useKYCStatus } from '@/app/hooks/useKYCStatus';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { InfoIcon, Shield, CheckCircle, XCircle } from 'lucide-react';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClubCreated: () => void;
}

const CreateClubModal: React.FC<CreateClubModalProps> = ({
  isOpen,
  onClose,
  onClubCreated,
}) => {
  const { token } = useAuth();
  const { kycStatus, loading: kycLoading } = useKYCStatus();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mission: '',
    investment_focus: '',
    minimum_monthly_contribution: '',
    max_members: '',
    club_type: 'public' as 'public' | 'private',
  });
  const [validationAlert, setValidationAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Check KYC status before proceeding
    if (!kycStatus?.verified) {
      setErrorMessage(
        'You must complete KYC verification before creating investment clubs',
      );
      setErrorAlert(true);
      return;
    }

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await clubService.createClub(token, {
        investment_club: {
          ...formData,
          minimum_monthly_contribution: parseFloat(
            formData.minimum_monthly_contribution,
          ),
          max_members: parseInt(formData.max_members),
        },
      });

      if (response.success) {
        onClubCreated();
        onClose();
        // Reset form
        setFormData({
          name: '',
          mission: '',
          investment_focus: '',
          minimum_monthly_contribution: '',
          max_members: '',
          club_type: 'public',
        });
      } else {
        throw new Error('Failed to create club');
      }
    } catch (error: any) {
      console.error('Failed to create club:', error);

      // Handle KYC-specific errors from backend
      if (
        error.message?.includes('KYC_VERIFICATION_REQUIRED') ||
        error.message?.includes('KYC_EXPIRED')
      ) {
        setErrorMessage(
          'KYC verification required: You must complete KYC verification before creating investment clubs',
        );
      } else {
        setErrorMessage(
          error.message || 'Failed to create club. Please try again.',
        );
      }
      setErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Club name is required');
    if (!formData.mission.trim()) errors.push('Mission is required');
    if (parseFloat(formData.minimum_monthly_contribution) <= 0)
      errors.push('Minimum contribution must be greater than 0');
    if (parseInt(formData.max_members) < 1)
      errors.push('Maximum members must be at least 1');

    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInvestmentFocusChange = (value: string) => {
    setFormData({
      ...formData,
      investment_focus: value,
    });
  };

  // Sort categories alphabetically by label for better UX
  const sortedCategories = [...categoriesWithIcons].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  const isKycVerified = kycStatus?.verified && !kycStatus?.is_expired;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnBackdropClick={false}
        size="xlarge"
        customStyles={{ padding: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-sm w-full overflow-hidden max-h-[90vh] flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Investment Club
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Start your own investment club to collaborate with other
                investors
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Club Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Club Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter club name"
                  disabled={!isKycVerified || loading}
                />
              </div>

              {/* Mission */}
              <div>
                <label
                  htmlFor="mission"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mission & Description *
                </label>
                <textarea
                  id="mission"
                  name="mission"
                  required
                  value={formData.mission}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Describe your club's mission and purpose"
                  disabled={!isKycVerified || loading}
                />
              </div>

              {/* Investment Focus - UPDATED with Select */}
              <div>
                <label
                  htmlFor="investment_focus"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Investment Focus
                </label>
                <Select
                  value={formData.investment_focus}
                  onValueChange={handleInvestmentFocusChange}
                  disabled={!isKycVerified || loading}
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Select investment focus..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {sortedCategories.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                        className="flex items-center space-x-2 py-2"
                      >
                        <div className="flex items-center space-x-2">
                          {category.icon}
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the primary focus area for your club's investments
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Minimum Contribution */}
                <div>
                  <label
                    htmlFor="minimum_monthly_contribution"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Minimum Monthly Contribution *
                  </label>
                  <input
                    type="number"
                    id="minimum_monthly_contribution"
                    name="minimum_monthly_contribution"
                    required
                    min="0"
                    step="0.01"
                    value={formData.minimum_monthly_contribution}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0.00"
                    disabled={!isKycVerified || loading}
                  />
                </div>

                {/* Max Members */}
                <div>
                  <label
                    htmlFor="max_members"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Maximum Members *
                  </label>
                  <input
                    type="number"
                    id="max_members"
                    name="max_members"
                    required
                    min="1"
                    max="100"
                    value={formData.max_members}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="50"
                    disabled={!isKycVerified || loading}
                  />
                </div>
              </div>

              {/* Club Type */}
              <div>
                <label
                  htmlFor="club_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Club Type *
                </label>
                <select
                  id="club_type"
                  name="club_type"
                  required
                  value={formData.club_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isKycVerified || loading}
                >
                  <option value="public">Public - Anyone can join</option>
                  <option value="private">Private - Requires invitation</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isKycVerified}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : !isKycVerified ? (
                  'KYC Required'
                ) : (
                  'Create Club'
                )}
              </button>
            </div>

            {/* KYC Requirement Notice */}
            {!isKycVerified && !kycLoading && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  <strong>KYC verification required</strong> to create
                  investment clubs. Please complete your identity verification
                  in your account settings.
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </Modal>

      {/* Alert Popups */}
      <AlertPopup
        title="Validation Error"
        message={
          <div>
            <p className="mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        }
        isOpen={validationAlert}
        setIsOpen={setValidationAlert}
        onConfirm={() => setValidationAlert(false)}
        confirmText="Got it"
        confirmButtonClass="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
      />

      <AlertPopup
        title="Error Creating Club"
        message={errorMessage}
        isOpen={errorAlert}
        setIsOpen={setErrorAlert}
        onConfirm={() => setErrorAlert(false)}
        confirmText="Try Again"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
    </>
  );
};

export default CreateClubModal;
