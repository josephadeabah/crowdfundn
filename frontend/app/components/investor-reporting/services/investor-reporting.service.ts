// app/components/investor-reporting/services/investor-reporting.service.ts
// Define interfaces for the API responses
export interface PortfolioData {
  summary: {
    total_invested: number;
    current_value: number;
    total_returns: number;
    roi: number;
    moic: number;
    irr: number;
    invested_campaigns: number;
    active_investments: number;
    currency: string;
    currency_symbol: string;
  };
  by_campaign: Array<{
    campaign_id: number;
    campaign_name: string;
    company_name: string;
    invested: number;
    current_value: number;
    returns: number;
    roi: number;
    ownership_percentage: number;
    investment_count: number;
    latest_valuation: number;
  }>;
  performance_metrics: any;
  risk_analysis: any;
  cash_flow: any[];
  projections: any[];
}

export interface FinancialStatement {
  id: number;
  period_type: string;
  period_start: string;
  period_end: string;
  revenue: number;
  expenses: number;
  gross_profit: number;
  net_income: number;
  assets: number;
  liabilities: number;
  equity: number;
  burn_rate: number;
  runway_months: number;
  gross_margin: number;
  net_margin: number;
  status: string;
  published_at: string;
  source_file_url?: string;
  source_file_name?: string;
}

export interface KPI {
  id: number;
  name: string;
  kpi_type: string;
  description?: string;
  unit: string;
  target_value: number;
  target_period?: string;
  is_primary: boolean;
  is_public: boolean;
  latest_value?: {
    value: number;
    period_date: string;
  };
  trend: Record<string, number>;
  performance_vs_target?: {
    current_value: number;
    target_value: number;
    difference: number;
    percentage: number;
  };
}

export interface InvestorReport {
  id: number;
  title: string;
  report_type: string;
  report_date: string;
  period_start?: string;
  period_end?: string;
  period_description: string;
  executive_summary?: string;
  key_highlights?: string;
  challenges_risks?: string;
  forward_outlook?: string;
  status: string;
  notify_investors: boolean;
  published_at: string;
  published_by_name?: string;
  download_count: number;
  campaign: {
    id: number;
    name: string;
    company_name: string;
  };
  documents: Array<{
    id: number;
    document_type: string;
    title: string;
    description?: string;
    file_url?: string;
    file_name?: string;
    file_size?: string;
    file_format?: string;
    is_public: boolean;
    download_count: number;
  }>;
}

export interface NotificationPreferences {
  financial_statements: boolean;
  valuation_updates: boolean;
  monthly_reports: boolean;
  quarterly_reports: boolean;
  annual_reports: boolean;
  campaign_updates: boolean;
  portfolio_updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  summary_frequency: string;
  preferred_time: string;
}

export interface PortfolioMetricsResponse {
  success: boolean;
  metrics: any[];
  current: any;
}

export class InvestorReportingService {
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }
          throw new Error('Authentication required');
        }

        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Portfolio endpoints
  async getPortfolio(): Promise<{
    success: boolean;
    portfolio: PortfolioData;
  }> {
    try {
      const response = await this.fetchApi('/investor/portfolio');
      return response;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }

  async getPortfolioMetrics(
    period: string = 'all',
  ): Promise<PortfolioMetricsResponse> {
    try {
      const endpoint = `/investor/metrics${period !== 'all' ? `?period=${period}` : ''}`;
      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching portfolio metrics:', error);
      throw error;
    }
  }

  // Financial statements
  async getFinancialStatements(
    campaignId: number,
    periodType: string = 'all',
  ): Promise<{
    success: boolean;
    financials: FinancialStatement[];
    summary?: any;
  }> {
    try {
      const endpoint = `/investor/campaigns/${campaignId}/financials${periodType !== 'all' ? `?period_type=${periodType}` : ''}`;
      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching financial statements:', error);
      throw error;
    }
  }

  async downloadFinancialStatement(
    statementId: number,
  ): Promise<{ success: boolean; url?: string }> {
    try {
      const response = await this.fetchApi(
        `/investor/documents/${statementId}/download`,
        {
          method: 'POST',
        },
      );
      return response;
    } catch (error) {
      console.error('Error downloading financial statement:', error);
      throw error;
    }
  }

  // KPI endpoints - Fixed endpoint path
  async getKPIs(
    campaignId: number,
    kpiType: string = 'all',
  ): Promise<{
    success: boolean;
    kpis: KPI[];
    dashboard?: any;
  }> {
    try {
      const endpoint = `/investor/campaigns/${campaignId}/kpis${kpiType !== 'all' ? `?kpi_type=${kpiType}` : ''}`;
      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  }

  // Investor reports - Fixed endpoint path
  async getInvestorReports(filters?: {
    report_type?: string;
    campaign_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{ success: boolean; reports: InvestorReport[] }> {
    try {
      const campaignId = filters?.campaign_id || 0;
      let endpoint = `/investor/campaigns/${campaignId}/reports`;

      const params = new URLSearchParams();
      if (filters?.report_type)
        params.append('report_type', filters.report_type);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching investor reports:', error);
      throw error;
    }
  }

  async getRecentReports(
    limit: number = 10,
  ): Promise<{ success: boolean; reports: InvestorReport[] }> {
    try {
      // Get reports from all campaigns (campaign_id = 0 means all)
      const response = await this.getInvestorReports({ campaign_id: 0 });
      if (response.success) {
        return {
          success: true,
          reports: response.reports
            .sort(
              (a, b) =>
                new Date(b.report_date).getTime() -
                new Date(a.report_date).getTime(),
            )
            .slice(0, limit),
        };
      }
      return { success: false, reports: [] };
    } catch (error) {
      console.error('Error fetching recent reports:', error);
      return { success: false, reports: [] };
    }
  }

  async downloadReport(
    reportId: number,
    documentId?: number,
  ): Promise<{ success: boolean; url?: string }> {
    try {
      const endpoint = documentId
        ? `/investor/documents/${documentId}/download`
        : `/investor/documents/${reportId}/download`;

      const response = await this.fetchApi(endpoint, {
        method: 'POST',
      });

      if (response.success && response.url) {
        // Handle the download - could be a redirect or direct URL
        window.open(response.url, '_blank');
        return response;
      }
      return { success: false };
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  // Portfolio statement
  async downloadPortfolioStatement(): Promise<{
    success: boolean;
    url?: string;
  }> {
    try {
      const response = await this.fetchApi('/investor/portfolio/statement');
      if (response.success && response.url) {
        window.open(response.url, '_blank');
      }
      return response;
    } catch (error) {
      console.error('Error downloading portfolio statement:', error);
      throw error;
    }
  }

  // Notification preferences
  async getNotificationPreferences(): Promise<{
    success: boolean;
    preferences: NotificationPreferences;
  }> {
    try {
      const response = await this.fetchApi(
        '/investor/notifications/preferences',
      );
      return response;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      // Return default preferences
      return {
        success: true,
        preferences: {
          financial_statements: true,
          valuation_updates: true,
          monthly_reports: true,
          quarterly_reports: true,
          annual_reports: true,
          campaign_updates: true,
          portfolio_updates: true,
          email_notifications: true,
          push_notifications: true,
          in_app_notifications: true,
          summary_frequency: 'weekly',
          preferred_time: '09:00',
        },
      };
    }
  }

  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<{
    success: boolean;
    preferences: NotificationPreferences;
  }> {
    try {
      const response = await this.fetchApi(
        '/investor/notifications/preferences',
        {
          method: 'PUT',
          body: JSON.stringify({ preferences }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async getUnreadNotificationCount(): Promise<{
    success: boolean;
    count: number;
  }> {
    try {
      // This endpoint needs to be implemented on backend
      // For now, we'll return 0
      return { success: true, count: 0 };
    } catch (error) {
      console.error('Error fetching notification count:', error);
      return { success: false, count: 0 };
    }
  }

  // Get portfolio analysis
  async getPortfolioAnalysis(): Promise<{
    success: boolean;
    performance_metrics: any;
    risk_analysis: any;
    cash_flow: any[];
    projections: any[];
  }> {
    try {
      const response = await this.getPortfolio();
      if (response.success && response.portfolio) {
        return {
          success: true,
          performance_metrics: response.portfolio.performance_metrics || {},
          risk_analysis: response.portfolio.risk_analysis || {},
          cash_flow: response.portfolio.cash_flow || [],
          projections: response.portfolio.projections || [],
        };
      }
      return {
        success: false,
        performance_metrics: {},
        risk_analysis: {},
        cash_flow: [],
        projections: [],
      };
    } catch (error) {
      console.error('Error fetching portfolio analysis:', error);
      throw error;
    }
  }

  // Get KPI trend data - Fixed endpoint path
  async getKPITrendData(
    campaignId: number,
    kpiId: number,
    days: number = 90,
  ): Promise<{
    success: boolean;
    trend: Record<string, number>;
    values: Array<{ period_date: string; value: number }>;
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/kpis/${kpiId}/values?days=${days}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching KPI trend data:', error);
      throw error;
    }
  }

  // Generate portfolio statement with options
  async generatePortfolioStatement(options: {
    period: string;
    format: string;
    includeSections: string[];
  }): Promise<{ success: boolean; url: string; filename: string }> {
    try {
      const response = await this.fetchApi('/investor/portfolio/statement', {
        method: 'POST',
        body: JSON.stringify(options),
      });
      return response;
    } catch (error) {
      console.error('Error generating portfolio statement:', error);
      throw error;
    }
  }

  // Get recent notifications
  async getRecentNotifications(limit: number = 10): Promise<{
    success: boolean;
    notifications: Array<{
      id: number;
      title: string;
      message: string;
      type: string;
      created_at: string;
      read: boolean;
      data: any;
    }>;
  }> {
    try {
      // This endpoint needs to be implemented on backend
      return { success: true, notifications: [] };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, notifications: [] };
    }
  }

  // Get statement history
  async getStatementHistory(): Promise<{
    success: boolean;
    statements: Array<{
      id: number;
      date: string;
      period: string;
      format: string;
      size: string;
      download_url: string;
    }>;
  }> {
    try {
      // This endpoint needs to be implemented
      return { success: true, statements: [] };
    } catch (error) {
      console.error('Error fetching statement history:', error);
      return { success: false, statements: [] };
    }
  }

  // Get campaign risk metrics
  async getCampaignRiskMetrics(campaignId: number): Promise<{
    success: boolean;
    metrics: {
      concentration: number;
      volatility: number;
      sharpe_ratio: number;
      risk_category: string;
    };
  }> {
    try {
      const response = await this.getPortfolio();
      if (response.success && response.portfolio) {
        const campaign = response.portfolio.by_campaign?.find(
          (c: any) => c.campaign_id === campaignId,
        );

        if (!campaign) {
          return {
            success: false,
            metrics: {
              concentration: 0,
              volatility: 0,
              sharpe_ratio: 0,
              risk_category: 'unknown',
            },
          };
        }

        const concentration =
          campaign.invested / response.portfolio.summary.total_invested;

        return {
          success: true,
          metrics: {
            concentration: concentration,
            volatility: 12.5, // Would come from backend calculation
            sharpe_ratio: 1.8, // Would come from backend calculation
            risk_category:
              concentration > 0.5 || campaign.roi < -10
                ? 'high'
                : concentration > 0.3 || campaign.roi < 0
                  ? 'medium'
                  : 'low',
          },
        };
      }
      return {
        success: false,
        metrics: {
          concentration: 0,
          volatility: 0,
          sharpe_ratio: 0,
          risk_category: 'unknown',
        },
      };
    } catch (error) {
      console.error('Error fetching campaign risk metrics:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const investorReportingService = new InvestorReportingService();
export default investorReportingService;
