// app/contexts/EquityCampaignContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useCampaignContext } from './CampaignsContext';
import {
  EquityCampaignResponseDataType,
  CampaignTeamMember,
  EquityInvestment,
  EquityCampaignState,
  InvestorDocument,
  InvestmentPortfolio,
  ShareCertificate,
} from '@/app/types/equityCampaigns.types';
import { getDetailedErrorMessage } from '@/app/types/campaign.error.messages.types';

const EquityCampaignContext = createContext<EquityCampaignState | undefined>(
  undefined,
);

export type CampaignActionResult = {
  success: boolean;
  error?: string;
  validationErrors?: string[];
  requirements?: Record<string, boolean>;
};

export const EquityCampaignProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { token, user } = useAuth();
  const campaignContext = useCampaignContext();
  const [pendingCampaigns, setPendingCampaigns] = useState<
    EquityCampaignResponseDataType[]
  >([]);
  const [teamMembers, setTeamMembers] = useState<CampaignTeamMember[]>([]);
  const [investments, setInvestments] = useState<EquityInvestment[]>([]);
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [currentDocument, setCurrentDocument] =
    useState<InvestorDocument | null>(null);
  const [portfolio, setPortfolio] = useState<InvestmentPortfolio | null>(null);
  const [shareCertificates, setShareCertificates] = useState<
    ShareCertificate[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUserCampaigns } = useCampaignContext();

  const handleApiError = (errorData: any) => {
    if (typeof errorData === 'string') {
      setError(errorData);
    } else {
      setError(getDetailedErrorMessage(errorData));
    }
  };

  // Document Management
  const fetchDocuments = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/documents/investor_documents`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return;
        }

        const data = await response.json();
        setDocuments(data.documents || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching documents',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const getDocument = useCallback(
    async (campaignId: string, documentId: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/documents/investor_documents/${documentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return;
        }

        const data = await response.json();
        setCurrentDocument(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching document',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const createDocument = useCallback(
    async (
      campaignId: string,
      documentType: string,
      files: File[],
    ): Promise<InvestorDocument | null> => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('document_type', documentType);
        files.forEach((file) => formData.append('files[]', file));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/documents/investor_documents`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return null;
        }

        const newDocument = await response.json();
        setDocuments((prev) => [...prev, newDocument]);
        return newDocument;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error creating document',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateDocument = useCallback(
    async (
      campaignId: string,
      documentId: number,
      documentType: string,
      files: File[],
    ): Promise<InvestorDocument | null> => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('document_type', documentType);
        files.forEach((file) => formData.append('files[]', file));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/documents/investor_documents/${documentId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return null;
        }

        const updatedDocument = await response.json();
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === documentId ? updatedDocument : doc)),
        );
        return updatedDocument;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error updating document',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deleteDocument = useCallback(
    async (campaignId: string, documentId: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${campaignId}/documents/investor_documents/${documentId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return;
        }

        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error deleting document',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Equity Campaign Special Actions

  const submitForApproval = useCallback(
    async (campaignId: string): Promise<CampaignActionResult> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/submit_for_approval`,
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
          // Handle structured error response from backend
          return {
            success: false,
            error: data.error || 'Submission failed',
            validationErrors: data.details,
            requirements: data.requirements,
          };
        }

        await fetchUserCampaigns();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token, fetchUserCampaigns],
  );

  const approveCampaign = useCallback(
    async (campaignId: string): Promise<CampaignActionResult> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/approve`,
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
          return {
            success: false,
            error: data.error || 'Approval failed',
            validationErrors: data.details,
            requirements: data.requirements,
          };
        }

        await fetchUserCampaigns();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token, fetchUserCampaigns],
  );

  const rejectCampaign = useCallback(
    async (
      campaignId: string,
      rejectionReason: string,
    ): Promise<CampaignActionResult> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/reject`,
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
          return {
            success: false,
            error: data.error || 'Rejection failed',
            validationErrors: data.details,
            requirements: data.requirements,
          };
        }

        await fetchUserCampaigns();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token, fetchUserCampaigns],
  );

  const launchCampaign = useCallback(
    async (campaignId: string): Promise<CampaignActionResult> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/launch`,
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
          return {
            success: false,
            error: data.error || 'Launch failed',
            validationErrors: data.details,
            requirements: data.requirements,
          };
        }

        await fetchUserCampaigns();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token, fetchUserCampaigns],
  );

  const closeCampaign = useCallback(
    async (campaignId: string): Promise<CampaignActionResult> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/close`,
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
          return {
            success: false,
            error: data.error || 'Closing failed',
            validationErrors: data.details,
            requirements: data.requirements,
          };
        }

        await fetchUserCampaigns();
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token, fetchUserCampaigns],
  );

  // Team Member Management
  const fetchTeamMembers = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/campaign_team_members`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return;
        }

        const data = await response.json();
        setTeamMembers(data.team_members || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching team members',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const addTeamMember = useCallback(
    async (
      campaignId: string,
      formData: FormData,
    ): Promise<CampaignTeamMember | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/campaign_team_members`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return null;
        }

        const newMember = await response.json();
        setTeamMembers((prev) => [...prev, newMember]);
        return newMember;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error adding team member',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateTeamMember = useCallback(
    async (
      campaignId: string,
      memberId: number,
      updates: Partial<CampaignTeamMember>,
    ): Promise<CampaignTeamMember | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/campaign_team_members/${memberId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ campaign_team_member: updates }),
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't update team member. Please try again.");
          return null;
        }

        const updatedMember = await response.json();
        setTeamMembers((prev) =>
          prev.map((member) =>
            member.id === memberId ? updatedMember : member,
          ),
        );
        return updatedMember;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error updating team member',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const removeTeamMember = useCallback(
    async (campaignId: string, memberId: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/campaign_team_members/${memberId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't remove team member. Please try again.");
          return;
        }

        setTeamMembers((prev) =>
          prev.filter((member) => member.id !== memberId),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error removing team member',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Investment Management
  // Equity Investment Management
  const fetchInvestments = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_campaigns/${campaignId}/equity_investments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return;
        }

        const data = await response.json();
        setInvestments(data.investments || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching investments',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchPublicInvestments = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_campaigns/${campaignId}/equity_investments/public_investments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return;
        }

        const data = await response.json();
        setInvestments(data.investments || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching public investments',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const createInvestment = useCallback(
    async (
      campaignId: string,
      investmentData: {
        amount: number;
        reward_id?: number;
        email?: string;
        phone?: string;
        full_name?: string;
        metadata?: any;
      },
    ): Promise<{ success: boolean; data?: any; error?: string }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_campaigns/${campaignId}/equity_investments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ equity_investment: investmentData }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Investment creation failed',
            data: data.details,
          };
        }

        return { success: true, data };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchInvestmentDetails = useCallback(
    async (investmentId: string): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/${investmentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return null;
        }

        return await response.json();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching investment details',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchMyInvestments = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/my_investments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        handleApiError(errorData);
        return;
      }

      const data = await response.json();
      setInvestments(data.investments || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error fetching your investments',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPortfolio = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/portfolio`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        handleApiError(errorData);
        return;
      }

      const data = await response.json();
      setInvestments(data.investments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching portfolio');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateInvestment = useCallback(
    async (
      investmentId: string,
      updates: Partial<EquityInvestment>,
    ): Promise<{
      success: boolean;
      data?: EquityInvestment;
      error?: string;
    }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/${investmentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ equity_investment: updates }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Investment update failed',
            data: data.details,
          };
        }

        // Update local state if successful
        setInvestments((prev) =>
          prev.map((inv) =>
            inv.id === Number(investmentId)
              ? { ...inv, ...data.investment }
              : inv,
          ),
        );

        return { success: true, data: data.investment };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const deleteInvestment = useCallback(
    async (
      investmentId: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/${investmentId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: errorData.error || 'Investment deletion failed',
          };
        }

        // Update local state if successful
        setInvestments((prev) =>
          prev.filter((inv) => inv.id !== Number(investmentId)),
        );

        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: getDetailedErrorMessage(err),
        };
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Share Certificates
  const fetchShareCertificates = useCallback(
    async (campaignId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/share_certificates`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError(
            "Couldn't fetch share certificates. Please try again.",
          );
          return;
        }

        const data = await response.json();
        // Handle share certificates data as needed
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching share certificates',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchShareCertificateById = useCallback(
    async (
      campaignId: string,
      certificateId: string,
    ): Promise<ShareCertificate | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/share_certificates/${certificateId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't fetch share certificate. Please try again.");
          return null;
        }

        const data = await response.json();
        return data.certificate || null; // Return the certificate or null if not found
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching share certificate',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Add the fetch function
  const fetchPendingReviewCampaigns = useCallback(async (): Promise<
    EquityCampaignResponseDataType[]
  > => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/pending_review`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        handleApiError(errorData);
        return [];
      }

      const data = await response.json();
      if (!data.campaigns) {
        handleApiError('Invalid response format');
        return [];
      }
      return data.campaigns;
    } catch (err) {
      handleApiError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Combine with base campaign context
  const contextValue = useMemo(
    () => ({
      ...campaignContext,
      teamMembers,
      investments,
      documents,
      currentDocument,
      portfolio, // Add this
      shareCertificates, // Add this
      loading,
      error,

      pendingCampaigns,
      fetchPendingReviewCampaigns,
      // Campaign actions
      submitForApproval,
      approveCampaign,
      rejectCampaign,
      launchCampaign,
      closeCampaign,

      // Team member actions
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      fetchTeamMembers,

      // Investment actions
      fetchInvestments,
      fetchPublicInvestments,
      createInvestment,
      fetchInvestmentDetails,
      fetchMyInvestments,
      fetchPortfolio,
      updateInvestment,
      deleteInvestment,

      // Document actions
      fetchDocuments,
      getDocument,
      createDocument,
      updateDocument,
      deleteDocument,

      // Share certificate actions
      fetchShareCertificates,
      fetchShareCertificateById,
    }),
    [
      campaignContext,
      teamMembers,
      investments,
      documents,
      currentDocument,
      portfolio, // Add this
      shareCertificates, // Add this
      loading,
      error,
      pendingCampaigns,
      fetchPendingReviewCampaigns,
      submitForApproval,
      approveCampaign,
      rejectCampaign,
      launchCampaign,
      closeCampaign,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      fetchTeamMembers,
      fetchInvestments,
      fetchPublicInvestments,
      createInvestment,
      fetchInvestmentDetails,
      fetchMyInvestments,
      fetchPortfolio,
      updateInvestment,
      deleteInvestment,
      fetchDocuments,
      getDocument,
      createDocument,
      updateDocument,
      deleteDocument,
      fetchPortfolio,
      fetchMyInvestments,
      fetchShareCertificates,
      fetchShareCertificateById,
    ],
  );

  return (
    <EquityCampaignContext.Provider value={contextValue}>
      {children}
    </EquityCampaignContext.Provider>
  );
};

export const useEquityCampaignContext = () => {
  const context = useContext(EquityCampaignContext);
  if (!context) {
    throw new Error(
      'useEquityCampaignContext must be used within an EquityCampaignProvider',
    );
  }
  return context;
};
