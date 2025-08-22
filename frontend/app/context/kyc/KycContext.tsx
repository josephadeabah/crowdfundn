// app/context/kyc/KycContext.tsx
'use client';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { useAuth } from '@/app/context/auth/AuthContext';
import {
  Kyc,
  KycFormData,
  KycDocument,
  KycState,
  KycError,
} from '@/app/types/kyc.type';

interface KycContextType extends KycState {
  errors: KycError[];
  clearErrors: () => void;
}

const KycContext = createContext<KycContextType | undefined>(undefined);

export const KycProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [kycs, setKycs] = useState<Kyc[]>([]);
  const [currentKyc, setCurrentKyc] = useState<Kyc | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<KycError[]>([]);

  const clearErrors = () => setErrors([]);

  // Fetch all KYCs for the current user
  const fetchKycs = useCallback(async () => {
    setLoading(true);
    setError(null);
    clearErrors();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch KYCs');
      }

      const data = await response.json();
      setKycs(data.kycs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch a specific KYC by ID
  const fetchKyc = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch KYC');
        }

        const data = await response.json();
        setCurrentKyc(data.kyc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Create a new KYC
  const createKyc = useCallback(
    async (kycData: KycFormData): Promise<Kyc> => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ kyc: kycData }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            setErrors(data.errors);
          }
          throw new Error(
            data.errors?.[0]?.message ||
              data.full_messages?.[0] ||
              'Failed to create KYC',
          );
        }

        const newKyc = data.kyc;
        setKycs((prev) => [...prev, newKyc]);
        setCurrentKyc(newKyc);

        return newKyc;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err; // Re-throw to let component handle
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Update an existing KYC
  const updateKyc = useCallback(
    async (id: number, kycData: Partial<KycFormData>): Promise<Kyc> => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ kyc: kycData }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            setErrors(data.errors);
          }
          throw new Error(
            data.errors?.[0]?.message ||
              data.full_messages?.[0] ||
              'Failed to update KYC',
          );
        }

        const updatedKyc = data.kyc;
        setKycs((prev) => prev.map((k) => (k.id === id ? updatedKyc : k)));
        setCurrentKyc(updatedKyc);

        return updatedKyc;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Delete a KYC
  const deleteKyc = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete KYC');
        }

        setKycs((prev) => prev.filter((k) => k.id !== id));
        if (currentKyc?.id === id) {
          setCurrentKyc(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token, currentKyc],
  );

  // Submit KYC for review
  const submitKyc = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/submit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            setErrors(data.errors);
          }
          throw new Error(
            data.errors?.[0]?.message ||
              data.full_messages?.[0] ||
              'Failed to submit KYC',
          );
        }

        const updatedKyc = data.kyc;
        setKycs((prev) => prev.map((k) => (k.id === id ? updatedKyc : k)));
        setCurrentKyc(updatedKyc);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Verify KYC (admin only)
  const verifyKyc = useCallback(
    async (id: number, reviewNotes?: string) => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ review_notes: reviewNotes }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            setErrors(data.errors);
          }
          throw new Error(
            data.errors?.[0]?.message ||
              data.full_messages?.[0] ||
              'Failed to verify KYC',
          );
        }

        const updatedKyc = data.kyc;
        setKycs((prev) => prev.map((k) => (k.id === id ? updatedKyc : k)));
        setCurrentKyc(updatedKyc);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Reject KYC (admin only)
  const rejectKyc = useCallback(
    async (id: number, rejectionReason: string) => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/reject`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rejection_reason: rejectionReason }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            setErrors(data.errors);
          }
          throw new Error(
            data.errors?.[0]?.message ||
              data.full_messages?.[0] ||
              'Failed to reject KYC',
          );
        }

        const updatedKyc = data.kyc;
        setKycs((prev) => prev.map((k) => (k.id === id ? updatedKyc : k)));
        setCurrentKyc(updatedKyc);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Fetch KYC documents
  const fetchKycDocuments = useCallback(
    async (id: number): Promise<KycDocument[]> => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${id}/documents`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch KYC documents');
        }

        const data = await response.json();
        return data.documents;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Upload document
  const uploadDocument = useCallback(
    async (
      kycId: number,
      documentType: string,
      file: File,
    ): Promise<KycDocument> => {
      setLoading(true);
      setError(null);
      clearErrors();

      try {
        const formData = new FormData();
        formData.append('document_type', documentType);
        formData.append('file', file);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/kyc/kycs/${kycId}/upload_document`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.errors) {
            setErrors(data.errors);
          }
          throw new Error(
            data.errors?.[0]?.message ||
              data.full_messages?.[0] ||
              'Failed to upload document',
          );
        }

        return data.document;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const contextValue: KycContextType = React.useMemo(
    () => ({
      kycs,
      currentKyc,
      loading,
      error,
      errors,
      clearErrors,
      fetchKycs,
      fetchKyc,
      createKyc,
      updateKyc,
      deleteKyc,
      submitKyc,
      verifyKyc,
      rejectKyc,
      fetchKycDocuments,
      uploadDocument,
    }),
    [
      kycs,
      currentKyc,
      loading,
      error,
      errors,
      fetchKycs,
      fetchKyc,
      createKyc,
      updateKyc,
      deleteKyc,
      submitKyc,
      verifyKyc,
      rejectKyc,
      fetchKycDocuments,
      uploadDocument,
    ],
  );

  return (
    <KycContext.Provider value={contextValue}>{children}</KycContext.Provider>
  );
};

export const useKyc = () => {
  const context = useContext(KycContext);
  if (!context) {
    throw new Error('useKyc must be used within a KycProvider');
  }
  return context;
};
