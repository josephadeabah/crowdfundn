// components/charts/chartTypes.ts
import { CampaignStatisticsDataType } from '@/app/types/campaigns.types';
import { LoginUserType } from '@/app/types/auth.login.types';

export interface DashboardChartsProps {
  statistics: CampaignStatisticsDataType | null;
  user: LoginUserType | null;
  fetchCampaignStatistics: (month: number, year: number) => void;
}
