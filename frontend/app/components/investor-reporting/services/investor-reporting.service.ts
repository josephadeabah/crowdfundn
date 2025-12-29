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
  private baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

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

  // ========== INVESTOR ROUTES ==========

  // Portfolio endpoints
  async getPortfolio(): Promise<{
    success: boolean;
    portfolio: PortfolioData;
  }> {
    try {
      const response = await this.fetchApi('/investor/portfolio');
      
      // Ensure portfolio data has proper structure
      const portfolioData = response.portfolio || {};
      return {
        success: true,
        portfolio: {
          summary: portfolioData.summary || {
            total_invested: 0,
            current_value: 0,
            total_returns: 0,
            roi: 0,
            moic: 0,
            irr: 0,
            invested_campaigns: 0,
            active_investments: 0,
            currency: 'GHS',
            currency_symbol: '₵',
          },
          by_campaign: portfolioData.by_campaign || [],
          performance_metrics: portfolioData.performance_metrics || {},
          risk_analysis: portfolioData.risk_analysis || {},
          cash_flow: portfolioData.cash_flow || [],
          projections: portfolioData.projections || [],
        },
      };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // Return empty structure
      return {
        success: false,
        portfolio: {
          summary: {
            total_invested: 0,
            current_value: 0,
            total_returns: 0,
            roi: 0,
            moic: 0,
            irr: 0,
            invested_campaigns: 0,
            active_investments: 0,
            currency: 'GHS',
            currency_symbol: '₵',
          },
          by_campaign: [],
          performance_metrics: {},
          risk_analysis: {},
          cash_flow: [],
          projections: [],
        },
      };
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

  // Financial statements - Investor endpoint (read-only access)
  async getInvestorFinancialStatements(
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
      console.error('Error fetching investor financial statements:', error);
      throw error;
    }
  }

  // KPI endpoints - Investor endpoint (read-only access)
  async getInvestorKPIs(
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
      console.error('Error fetching investor KPIs:', error);
      throw error;
    }
  }

  // Investor reports - Investor endpoint (read-only access)
  async getInvestorReports(filters?: {
    report_type?: string;
    campaign_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<{ success: boolean; reports: InvestorReport[] }> {
    try {
      const campaignId = filters?.campaign_id || 0;

      if (campaignId === 0) {
        // Cannot use campaign_id=0 in investor routes - need to get all campaigns first
        const portfolio = await this.getPortfolio();
        if (!portfolio.success || !portfolio.portfolio.by_campaign) {
          return { success: true, reports: [] };
        }

        // Get reports for each campaign
        const allReports: InvestorReport[] = [];
        for (const campaign of portfolio.portfolio.by_campaign) {
          const response = await this.getInvestorReports({
            campaign_id: campaign.campaign_id,
            report_type: filters?.report_type,
          });
          if (response.success) {
            allReports.push(...response.reports);
          }
        }

        // Filter by date if provided
        let filteredReports = allReports;
        if (filters?.start_date) {
          filteredReports = filteredReports.filter(
            (report) =>
              new Date(report.report_date) >= new Date(filters.start_date!),
          );
        }
        if (filters?.end_date) {
          filteredReports = filteredReports.filter(
            (report) =>
              new Date(report.report_date) <= new Date(filters.end_date!),
          );
        }

        // Sort by date
        filteredReports.sort(
          (a, b) =>
            new Date(b.report_date).getTime() -
            new Date(a.report_date).getTime(),
        );

        return { success: true, reports: filteredReports };
      }

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
      return { success: false, reports: [] };
    }
  }

  async getRecentInvestorReports(
    limit: number = 10,
  ): Promise<{ success: boolean; reports: InvestorReport[] }> {
    try {
      const response = await this.getInvestorReports({});
      if (response.success) {
        return {
          success: true,
          reports: response.reports.slice(0, limit),
        };
      }
      return { success: false, reports: [] };
    } catch (error) {
      console.error('Error fetching recent investor reports:', error);
      return { success: false, reports: [] };
    }
  }

  // Download document
  async downloadDocument(
    documentId: number,
  ): Promise<{ success: boolean; url?: string }> {
    try {
      const response = await this.fetchApi(
        `/investor/documents/${documentId}/download`,
        {
          method: 'POST',
        },
      );
      return response;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  // Portfolio statement
  async downloadPortfolioStatement(period?: string): Promise<{
    success: boolean;
    url?: string;
  }> {
    try {
      let endpoint = '/investor/portfolio/statement';
      if (period) {
        endpoint += `?period=${encodeURIComponent(period)}`;
      }
      const response = await this.fetchApi(endpoint);

      if (response.success) {
        // This endpoint returns PDF directly, not a JSON response
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Error downloading portfolio statement:', error);
      throw error;
    }
  }

  async generatePortfolioStatement(options: {
    period: string;
    format: string;
    includeSections: string[];
  }): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/investor/portfolio/statement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          period: options.period,
          format: options.format,
          include_sections: options.includeSections,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.download_url) {
        return { success: true, url: result.download_url };
      } else if (result.success && result.url) {
        return { success: true, url: result.url };
      }
      
      return result;
    } catch (error: any) {
      console.error('Error generating portfolio statement:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to generate portfolio statement' 
      };
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

  // ========== CAMPAIGN MANAGEMENT ROUTES (for fundraisers) ==========

  // Campaign financials management (full CRUD)
  async getCampaignFinancials(
    campaignId: number,
    filters?: { status?: string },
  ): Promise<{
    success: boolean;
    financials: FinancialStatement[];
    summary?: any;
  }> {
    try {
      let endpoint = `/campaigns/${campaignId}/financials`;
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching campaign financials:', error);
      throw error;
    }
  }

  async getCampaignFinancial(
    campaignId: number,
    financialId: number,
  ): Promise<{
    success: boolean;
    financial: FinancialStatement;
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials/${financialId}`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching campaign financial:', error);
      throw error;
    }
  }

  async createCampaignFinancial(
    campaignId: number,
    financialData: Partial<FinancialStatement>,
  ): Promise<{
    success: boolean;
    financial: FinancialStatement;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials`,
        {
          method: 'POST',
          body: JSON.stringify({ financial: financialData }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error creating campaign financial:', error);
      throw error;
    }
  }

  async updateCampaignFinancial(
    campaignId: number,
    financialId: number,
    financialData: Partial<FinancialStatement>,
  ): Promise<{
    success: boolean;
    financial: FinancialStatement;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials/${financialId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ financial: financialData }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error updating campaign financial:', error);
      throw error;
    }
  }

  async deleteCampaignFinancial(
    campaignId: number,
    financialId: number,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials/${financialId}`,
        {
          method: 'DELETE',
        },
      );
      return response;
    } catch (error) {
      console.error('Error deleting campaign financial:', error);
      throw error;
    }
  }

  async publishCampaignFinancial(
    campaignId: number,
    financialId: number,
  ): Promise<{
    success: boolean;
    financial: FinancialStatement;
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials/${financialId}/publish`,
        {
          method: 'POST',
        },
      );
      return response;
    } catch (error) {
      console.error('Error publishing campaign financial:', error);
      throw error;
    }
  }

  async importCampaignFinancials(
    campaignId: number,
    file: File,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/financials/import`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        },
      );

      return response.json();
    } catch (error) {
      console.error('Error importing campaign financials:', error);
      throw error;
    }
  }

  // Campaign KPIs management
  async getCampaignKPIs(
    campaignId: number,
    filters?: { kpi_type?: string; is_primary?: boolean },
  ): Promise<{
    success: boolean;
    kpis: KPI[];
    dashboard?: any;
  }> {
    try {
      let endpoint = `/campaigns/${campaignId}/kpis`;
      const params = new URLSearchParams();
      if (filters?.kpi_type) params.append('kpi_type', filters.kpi_type);
      if (filters?.is_primary !== undefined)
        params.append('is_primary', filters.is_primary.toString());

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching campaign KPIs:', error);
      throw error;
    }
  }

  async createCampaignKPI(
    campaignId: number,
    kpiData: Partial<KPI>,
  ): Promise<{
    success: boolean;
    kpi: KPI;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(`/campaigns/${campaignId}/kpis`, {
        method: 'POST',
        body: JSON.stringify({ kpi: kpiData }),
      });
      return response;
    } catch (error) {
      console.error('Error creating campaign KPI:', error);
      throw error;
    }
  }

  async addKPIValue(
    campaignId: number,
    kpiId: number,
    valueData: { period_date: string; value: number; is_actual?: boolean },
  ): Promise<{
    success: boolean;
    value: any;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/kpis/${kpiId}/add_value`,
        {
          method: 'POST',
          body: JSON.stringify({ value: valueData }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error adding KPI value:', error);
      throw error;
    }
  }

  async getKPIValues(
    campaignId: number,
    kpiId: number,
    periodStart?: string,
    periodEnd?: string,
  ): Promise<{
    success: boolean;
    values: Array<{ period_date: string; value: number }>;
    trend: Record<string, number>;
  }> {
    try {
      let endpoint = `/campaigns/${campaignId}/kpis/${kpiId}/values`;
      const params = new URLSearchParams();
      if (periodStart) params.append('period_start', periodStart);
      if (periodEnd) params.append('period_end', periodEnd);

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching KPI values:', error);
      throw error;
    }
  }

  // Campaign investor reports management
  async getCampaignInvestorReports(
    campaignId: number,
    filters?: { report_type?: string; status?: string },
  ): Promise<{ success: boolean; reports: InvestorReport[] }> {
    try {
      let endpoint = `/campaigns/${campaignId}/investor_reports`;
      const params = new URLSearchParams();
      if (filters?.report_type)
        params.append('report_type', filters.report_type);
      if (filters?.status) params.append('status', filters.status);

      const queryString = params.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const response = await this.fetchApi(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching campaign investor reports:', error);
      throw error;
    }
  }

  async createCampaignInvestorReport(
    campaignId: number,
    reportData: Partial<InvestorReport>,
  ): Promise<{
    success: boolean;
    report: InvestorReport;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/investor_reports`,
        {
          method: 'POST',
          body: JSON.stringify({ report: reportData }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error creating campaign investor report:', error);
      throw error;
    }
  }

  async publishCampaignInvestorReport(
    campaignId: number,
    reportId: number,
  ): Promise<{
    success: boolean;
    report: InvestorReport;
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/investor_reports/${reportId}/publish`,
        {
          method: 'POST',
        },
      );
      return response;
    } catch (error) {
      console.error('Error publishing campaign investor report:', error);
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
      const endpoint = reportDate
        ? `/campaigns/${campaignId}/investor_reports/generate_quarterly?report_date=${reportDate}`
        : `/campaigns/${campaignId}/investor_reports/generate_quarterly`;

      const response = await this.fetchApi(endpoint, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Error generating quarterly report:', error);
      throw error;
    }
  }

  // ========== HELPER METHODS ==========

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
}

// Create a singleton instance
export const investorReportingService = new InvestorReportingService();
export default investorReportingService;
