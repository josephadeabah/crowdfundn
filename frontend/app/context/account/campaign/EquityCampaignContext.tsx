// app/contexts/EquityCampaignContext.tsx
import React, { createContext, useContext, useMemo } from 'react';


const EquityCampaignContext = createContext<EquityCampaignState | undefined>(undefined);

export const EquityCampaignProvider = ({ children }: { children: ReactNode }) => {
  const {
    // Destructure common campaign methods
    fetchCampaignById,
    editCampaign,
    deleteCampaign,
    // ... other shared methods
  } = useCampaignContext();

  // Equity-specific state
  const [teamMembers, setTeamMembers] = useState<CampaignTeamMember[]>([]);
  const [investments, setInvestments] = useState<EquityInvestment[]>([]);

  // Equity-specific methods
  const launchCampaign = async (id: string) => {
    // Implementation
  };

  const addTeamMember = async (member: Omit<CampaignTeamMember, 'id' | 'created_at'>) => {
    // Implementation
  };

  // Combine with base campaign context
  const contextValue = useMemo(() => ({
    ...campaignContext,
    teamMembers,
    investments,
    launchCampaign,
    addTeamMember,
    // ... other equity-specific methods
  }), [campaignContext, teamMembers, investments]);

  return (
    <EquityCampaignContext.Provider value={contextValue}>
      {children}
    </EquityCampaignContext.Provider>
  );
};

export const useEquityCampaignContext = () => {
  const context = useContext(EquityCampaignContext);
  if (!context) {
    throw new Error('useEquityCampaignContext must be used within an EquityCampaignProvider');
  }
  return context;
};