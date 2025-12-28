// app/services/investor-reporting.service.ts

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

export class InvestorReportingService {
  private baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8000/api/v1';
  private token: string | null = null;

  // Call this method from your components to set the token
  setToken(token: string) {
    this.token = token;
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Network error' }));
      throw new Error(
        error.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

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
  ): Promise<{ success: boolean; metrics: any }> {
    try {
      const endpoint = `/investor/metrics${period !== 'all' ? `?period=${period}` : ''}`;
      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching portfolio metrics:', error);
      throw error;
    }
  }

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

  async downloadPortfolioStatement(): Promise<{
    success: boolean;
    url?: string;
  }> {
    try {
      const response = await this.fetchApi('/investor/portfolio/statement');
      return response;
    } catch (error) {
      console.error('Error downloading portfolio statement:', error);
      throw error;
    }
  }

  async getRecentReports(
    limit: number = 10,
  ): Promise<{ success: boolean; reports: InvestorReport[] }> {
    try {
      const endpoint = `/investor/campaigns/0/reports${limit !== 10 ? `?limit=${limit}` : ''}`;
      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching recent reports:', error);
      throw error;
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
      return response;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

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
      throw error;
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
      // This would be a separate endpoint in a real implementation
      // For now, we'll return a mock response
      return { success: true, count: 3 };
    } catch (error) {
      console.error('Error fetching notification count:', error);
      return { success: false, count: 0 };
    }
  }

  async exportPortfolioData(
    format: string = 'csv',
  ): Promise<{ success: boolean; url?: string }> {
    try {
      // This would be a separate endpoint in a real implementation
      // For now, we'll return a mock response
      return {
        success: true,
        url: `/api/v1/investor/portfolio/export?format=${format}`,
      };
    } catch (error) {
      console.error('Error exporting portfolio data:', error);
      throw error;
    }
  }

  async generateQuarterlyReport(
    campaignId: number,
    reportDate?: string,
  ): Promise<{
    success: boolean;
    report: InvestorReport;
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/investor_reports/generate_quarterly`,
        {
          method: 'POST',
          body: JSON.stringify({ report_date: reportDate }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error generating quarterly report:', error);
      throw error;
    }
  }

  async subscribeToReportNotifications(
    campaignId: number,
    reportTypes: string[],
  ): Promise<{
    success: boolean;
  }> {
    try {
      const response = await this.fetchApi(
        '/investor/notifications/subscribe',
        {
          method: 'POST',
          body: JSON.stringify({
            campaign_id: campaignId,
            report_types: reportTypes,
          }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error subscribing to report notifications:', error);
      throw error;
    }
  }

  async markReportAsRead(reportId: number): Promise<{ success: boolean }> {
    try {
      // This would be a separate endpoint in a real implementation
      return { success: true };
    } catch (error) {
      console.error('Error marking report as read:', error);
      return { success: false };
    }
  }
}

// Create a singleton instance
export const investorReportingService = new InvestorReportingService();
export default investorReportingService;
