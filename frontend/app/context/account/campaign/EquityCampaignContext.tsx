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
  InvestmentCreatePayload,
  InvestmentCreateResponse,
  InvestmentUpdatePayload,
  Investment,
  PaginationData,
} from '@/app/types/equityCampaigns.types';
import { getDetailedErrorMessage } from '@/app/types/campaign.error.messages.types';
import { parseNumber } from '@/app/utils/helpers/generate.random-string';

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
  const [certificateLoading, setCertificateLoading] = useState<boolean>(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchUserCampaigns } = useCampaignContext();
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    per_page: 10,
    total_count: 0,
  });

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

  // In EquityCampaignContext.tsx
  const fetchPublicInvestments = useCallback(
    async (
      campaignId: string,
      page = 1,
      perPage = 10,
    ): Promise<{
      investments: Investment[];
      pagination: PaginationData;
    }> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_campaigns/${campaignId}/equity_investments/public_investments?page=${page}&per_page=${perPage}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          handleApiError(errorData);
          return {
            investments: [],
            pagination: {
              current_page: 1,
              total_pages: 1,
              per_page: perPage,
              total_count: 0,
            },
          };
        }

        const data = await response.json();

        // 🔥 Update investments state here
        setInvestments(data.investments || []);

        // 🔥 Update pagination state
        setPagination(
          data.pagination || {
            current_page: 1,
            total_pages: 1,
            per_page: perPage,
            total_count: 0,
          },
        );

        return {
          investments: data.investments || [],
          pagination: data.pagination || {
            current_page: 1,
            total_pages: 1,
            per_page: perPage,
            total_count: 0,
          },
        };
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching public investments',
        );
        return {
          investments: [],
          pagination: {
            current_page: 1,
            total_pages: 1,
            per_page: perPage,
            total_count: 0,
          },
        };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createInvestment = useCallback(
    async (
      campaignId: string,
      investmentData: InvestmentCreatePayload,
    ): Promise<InvestmentCreateResponse> => {
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
          // Error handling remains the same
          return {
            success: false,
            error: data.error || 'Investment creation failed',
            data: data.details,
            code: data.code,
          };
        }

        // Successful response handling
        if (data.data?.authorization_url) {
          // Add a small delay to ensure React state updates complete
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Verify URL is valid
          try {
            new URL(data.data.authorization_url);
            window.location.assign(data.data.authorization_url); // Use assign() instead of href
          } catch (e) {
            console.error('Invalid URL:', data.data.authorization_url);
            return {
              success: false,
              error: 'Invalid payment URL',
            };
          }

          // Return immediately after redirect
          return {
            success: true,
            data: {
              investment: data.data.investment,
              authorization_url: data.data.authorization_url,
              redirect_url: data.data.redirect_url,
              shares_available: data.data.shares_available,
            },
          };
        }

        return {
          success: true,
          data: {
            investment: data.data?.investment,
            authorization_url: data.data?.authorization_url,
            redirect_url: data.data?.redirect_url,
            shares_available: data.data?.shares_available,
          },
        };
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

  const fetchPortfolio = useCallback(
    async (page = 1, perPage = 10): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/portfolio?page=${page}&per_page=${perPage}`,
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
        setPortfolio(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error fetching portfolio',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );
  // My investments endpoint - FIXED URL
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
        err instanceof Error ? err.message : 'Error fetching investments',
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // In your EquityCampaignContext.tsx
  const updateInvestment = useCallback(
    async (
      investmentId: string,
      updates: InvestmentUpdatePayload, // Now using the correct type
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

  // Certificate API methods
  // Certificate endpoints - FIXED URLs
  const generateCertificate = useCallback(
    async (
      investmentId: string,
    ): Promise<{ success: boolean; url?: string; error?: string }> => {
      setCertificateLoading(true);
      setCertificateError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/${investmentId}/generate_certificate`,
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
            error: data.error || 'Certificate generation failed',
          };
        }

        setCertificateUrl(data.certificate_url);
        return {
          success: true,
          url: data.certificate_url,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Certificate generation failed';
        setCertificateError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setCertificateLoading(false);
      }
    },
    [token],
  );

  const downloadCertificate = useCallback(
    async (investmentId: string): Promise<void> => {
      setCertificateLoading(true);
      setCertificateError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/${investmentId}/download_certificate`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Certificate download failed');
        }

        // Handle the PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `investment_certificate_${investmentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Certificate download failed';
        setCertificateError(errorMessage);
        throw err;
      } finally {
        setCertificateLoading(false);
      }
    },
    [token],
  );

  const checkCertificateStatus = useCallback(
    async (
      investmentId: string,
    ): Promise<{ exists: boolean; url?: string }> => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/equity_investments/${investmentId}/certificate_status`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          return { exists: false };
        }

        return {
          exists: data.exists,
          url: data.url,
        };
      } catch (err) {
        return { exists: false };
      }
    },
    [token],
  );

  // Combine with base campaign context
  const contextValue = useMemo(
    () => ({
      ...campaignContext,
      teamMembers,
      investments,
      documents,
      currentDocument,
      portfolio, // Add this
      certificateLoading,
      certificateError,
      certificateUrl,
      loading,
      error,
      pagination: {
        current_page: pagination?.current_page || 1,
        total_pages: pagination?.total_pages || 1,
        per_page: pagination?.per_page || 10,
        total_count: pagination?.total_count || 0,
      },

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
      generateCertificate,
      downloadCertificate,
      checkCertificateStatus,
    }),
    [
      campaignContext,
      teamMembers,
      investments,
      documents,
      currentDocument,
      portfolio, // Add this
      certificateLoading,
      certificateError,
      certificateUrl,
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
      generateCertificate,
      downloadCertificate,
      checkCertificateStatus,
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
