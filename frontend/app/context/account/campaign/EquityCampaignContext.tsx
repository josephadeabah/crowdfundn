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
} from '@/app/types/equityCampaigns.types';

const EquityCampaignContext = createContext<EquityCampaignState | undefined>(
  undefined,
);

export const EquityCampaignProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { token, user } = useAuth();
  const campaignContext = useCampaignContext();

  // State
  const [equityCampaigns, setEquityCampaigns] = useState<
    EquityCampaignResponseDataType[]
  >([]);
  const [userEquityCampaigns, setUserEquityCampaigns] = useState<
    EquityCampaignResponseDataType[] | null
  >(null);
  const [currentEquityCampaign, setCurrentEquityCampaign] =
    useState<EquityCampaignResponseDataType | null>(null);
  const [teamMembers, setTeamMembers] = useState<CampaignTeamMember[]>([]);
  const [investments, setInvestments] = useState<EquityInvestment[]>([]);
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [currentDocument, setCurrentDocument] =
    useState<InvestorDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (errorText: string) => {
    setError(errorText);
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
          handleApiError("Couldn't fetch documents. Please try again.");
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
          handleApiError("Couldn't fetch document. Please try again.");
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
          handleApiError("Couldn't create document. Please try again.");
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
          handleApiError("Couldn't update document. Please try again.");
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
          handleApiError("Couldn't delete document. Please try again.");
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
  const launchCampaign = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${id}/launch`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError('Failed to launch campaign. Please try again.');
          return;
        }

        const updatedCampaign = await response.json();
        setCurrentEquityCampaign(updatedCampaign);
        setEquityCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error launching campaign',
        );
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const closeCampaign = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${id}/close`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          handleApiError('Failed to close campaign. Please try again.');
          return;
        }

        const updatedCampaign = await response.json();
        setCurrentEquityCampaign(updatedCampaign);
        setEquityCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error closing campaign');
      } finally {
        setLoading(false);
      }
    },
    [token],
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
          handleApiError("Couldn't fetch team members. Please try again.");
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
          handleApiError("Couldn't add team member. Please try again.");
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
  const createInvestment = useCallback(
    async (
      campaignId: string,
      investment: Omit<EquityInvestment, 'id' | 'created_at'>,
    ): Promise<EquityInvestment | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/campaigns/${campaignId}/equity_investments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ equity_investment: investment }),
          },
        );

        if (!response.ok) {
          handleApiError("Couldn't create investment. Please try again.");
          return null;
        }

        const newInvestment = await response.json();
        setInvestments((prev) => [...prev, newInvestment]);
        return newInvestment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error creating investment',
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // Portfolio Management
  const fetchPortfolio = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/investments/portfolio`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        handleApiError("Couldn't fetch portfolio. Please try again.");
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

  const fetchMyInvestments = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/equity/investments/my_investments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        handleApiError("Couldn't fetch your investments. Please try again.");
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
    async (campaignId: string, certificateId: string): Promise<void> => {
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
          return;
        }

        const data = await response.json();
        // Handle single certificate data as needed
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error fetching share certificate',
        );
      } finally {
        setLoading(false);
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
      loading,
      error,

      // Campaign actions
      launchCampaign,
      closeCampaign,

      // Team member actions
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      fetchTeamMembers,

      // Investment actions
      createInvestment,

      // Document actions
      fetchDocuments,
      getDocument,
      createDocument,
      updateDocument,
      deleteDocument,

      // Portfolio actions
      fetchPortfolio,
      fetchMyInvestments,

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
      loading,
      error,
      launchCampaign,
      closeCampaign,
      addTeamMember,
      updateTeamMember,
      removeTeamMember,
      fetchTeamMembers,
      createInvestment,
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
