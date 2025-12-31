// app/services/financials/financial-management.service.ts
export class FinancialManagementService {
  private baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';
  private token: string | null = null;

  // Set token when service is used
  setToken(token: string | null) {
    this.token = token;
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers(options.headers as HeadersInit);

    // Set default Content-Type for JSON requests (remove for FormData)
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    } else {
      headers.delete('Content-Type');
    }

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
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

  // ========== FINANCIAL STATEMENTS ==========

  async getFinancialStatements(
    campaignId: number,
    filters?: { status?: string },
  ): Promise<{
    success: boolean;
    financials: any[];
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
      console.error('Error fetching financial statements:', error);
      throw error;
    }
  }

  async createFinancialStatement(
    campaignId: number,
    data: {
      period_type: string;
      period_start: string;
      period_end: string;
      revenue: number;
      expenses: number;
      assets?: number;
      liabilities?: number;
      cash_flow?: number;
      status?: string;
    },
  ): Promise<{
    success: boolean;
    financial: any;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials`,
        {
          method: 'POST',
          body: JSON.stringify({ financial: data }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error creating financial statement:', error);
      throw error;
    }
  }

  async updateFinancialStatement(
    campaignId: number,
    financialId: number,
    data: Partial<any>,
  ): Promise<{
    success: boolean;
    financial: any;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(
        `/campaigns/${campaignId}/financials/${financialId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ financial: data }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error updating financial statement:', error);
      throw error;
    }
  }

  async deleteFinancialStatement(
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
      console.error('Error deleting financial statement:', error);
      throw error;
    }
  }

  async publishFinancialStatement(
    campaignId: number,
    financialId: number,
  ): Promise<{
    success: boolean;
    financial: any;
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
      console.error('Error publishing financial statement:', error);
      throw error;
    }
  }

  // ========== KPIs ==========

  async getKPIs(
    campaignId: number,
    filters?: { kpi_type?: string; is_primary?: boolean },
  ): Promise<{
    success: boolean;
    kpis: any[];
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
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  }

  async createKPI(
    campaignId: number,
    data: {
      name: string;
      kpi_type: string;
      description?: string;
      unit: string;
      target_value: number;
      target_period?: string;
      is_primary?: boolean;
      is_public?: boolean;
    },
  ): Promise<{
    success: boolean;
    kpi: any;
    errors?: string[];
  }> {
    try {
      const response = await this.fetchApi(`/campaigns/${campaignId}/kpis`, {
        method: 'POST',
        body: JSON.stringify({ kpi: data }),
      });
      return response;
    } catch (error) {
      console.error('Error creating KPI:', error);
      throw error;
    }
  }

  async addKPIValue(
    campaignId: number,
    kpiId: number,
    data: {
      period_date: string;
      value: number;
      is_actual?: boolean;
      data_source?: string;
    },
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
          body: JSON.stringify({ value: data }),
        },
      );
      return response;
    } catch (error) {
      console.error('Error adding KPI value:', error);
      throw error;
    }
  }

  // ========== INVESTOR REPORTS ==========

  async getInvestorReports(
    campaignId: number,
    filters?: { report_type?: string; status?: string },
  ): Promise<{ success: boolean; reports: any[] }> {
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
      console.error('Error fetching investor reports:', error);
      throw error;
    }
  }

  async createInvestorReport(
    campaignId: number,
    data: {
      report_type: string;
      title: string;
      executive_summary?: string;
      key_highlights?: string;
      challenges_risks?: string;
      forward_outlook?: string;
      report_date: string;
      period_start?: string;
      period_end?: string;
      status?: string;
      notify_investors?: boolean;
    },
    attachments?: File[],
  ): Promise<{
    success: boolean;
    report: any;
    errors?: string[];
  }> {
    try {
      // If there are attachments, use FormData
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        formData.append('report[report_type]', data.report_type);
        formData.append('report[title]', data.title);
        if (data.executive_summary)
          formData.append('report[executive_summary]', data.executive_summary);
        if (data.key_highlights)
          formData.append('report[key_highlights]', data.key_highlights);
        if (data.challenges_risks)
          formData.append('report[challenges_risks]', data.challenges_risks);
        if (data.forward_outlook)
          formData.append('report[forward_outlook]', data.forward_outlook);
        formData.append('report[report_date]', data.report_date);
        if (data.period_start)
          formData.append('report[period_start]', data.period_start);
        if (data.period_end)
          formData.append('report[period_end]', data.period_end);
        if (data.status) formData.append('report[status]', data.status);
        formData.append(
          'report[notify_investors]',
          data.notify_investors?.toString() || 'true',
        );

        attachments.forEach((file, index) => {
          formData.append('report[attachments][]', file);
        });

        const response = await fetch(
          `${this.baseUrl}/campaigns/${campaignId}/investor_reports`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          },
        );

        return response.json();
      } else {
        // No attachments, use JSON
        const response = await this.fetchApi(
          `/campaigns/${campaignId}/investor_reports`,
          {
            method: 'POST',
            body: JSON.stringify({ report: data }),
          },
        );
        return response;
      }
    } catch (error) {
      console.error('Error creating investor report:', error);
      throw error;
    }
  }

  async publishInvestorReport(
    campaignId: number,
    reportId: number,
  ): Promise<{
    success: boolean;
    report: any;
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
      console.error('Error publishing investor report:', error);
      throw error;
    }
  }

  async generateQuarterlyReport(
    campaignId: number,
    reportDate?: string,
    existingReportId?: number,
  ): Promise<{
    success: boolean;
    report: any;
  }> {
    try {
      let endpoint = `/campaigns/${campaignId}/investor_reports`;

      if (existingReportId) {
        endpoint += `/${existingReportId}/generate_quarterly`;
      } else {
        endpoint += `/generate_quarterly`;
      }

      // Create the request body with report_date
      const body = reportDate ? { report_date: reportDate } : {};

      const response = await this.fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return response;
    } catch (error) {
      console.error('Error generating quarterly report:', error);
      throw error;
    }
  }

  async uploadReportAttachments(
    campaignId: number,
    reportId: number,
    files: File[],
  ): Promise<{
    success: boolean;
    message: string;
    attachments?: any[];
  }> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('attachments[]', file);
      });

      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/investor_reports/${reportId}/upload_attachments`,
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
      console.error('Error uploading attachments:', error);
      throw error;
    }
  }

  // ========== DASHBOARD & ANALYTICS ==========

  async getCampaignFinancialDashboard(campaignId: number): Promise<{
    success: boolean;
    dashboard: {
      summary: {
        total_invested: number;
        current_value: number;
        investors_count: number;
        valuation: number;
        equity_offered: number;
      };
      performance: {
        revenue_trend: Array<{ period: string; revenue: number }>;
        expense_trend: Array<{ period: string; expenses: number }>;
        net_income_trend: Array<{ period: string; net_income: number }>;
      };
      kpis: any[];
      recent_reports: any[];
    };
  }> {
    try {
      // Get financial statements
      const financialsResponse = await this.getFinancialStatements(campaignId);
      const kpisResponse = await this.getKPIs(campaignId);
      const reportsResponse = await this.getInvestorReports(campaignId);

      // Process financial data for trends
      const financials = financialsResponse.success
        ? financialsResponse.financials
        : [];

      const revenueTrend = financials.map((f: any) => ({
        period: `${f.period_type.charAt(0).toUpperCase()}${f.period_type.slice(
          1,
        )} ${new Date(f.period_end).getFullYear()}`,
        revenue: f.revenue || 0,
      }));

      const expenseTrend = financials.map((f: any) => ({
        period: `${f.period_type.charAt(0).toUpperCase()}${f.period_type.slice(
          1,
        )} ${new Date(f.period_end).getFullYear()}`,
        expenses: f.expenses || 0,
      }));

      const netIncomeTrend = financials.map((f: any) => ({
        period: `${f.period_type.charAt(0).toUpperCase()}${f.period_type.slice(
          1,
        )} ${new Date(f.period_end).getFullYear()}`,
        net_income: f.net_income || 0,
      }));

      return {
        success: true,
        dashboard: {
          summary: {
            total_invested: 0, // Would need investment data
            current_value: 0, // Would need valuation data
            investors_count: 0, // Would need investment data
            valuation: 0, // From campaign
            equity_offered: 0, // From campaign
          },
          performance: {
            revenue_trend: revenueTrend.slice(-6), // Last 6 periods
            expense_trend: expenseTrend.slice(-6),
            net_income_trend: netIncomeTrend.slice(-6),
          },
          kpis: kpisResponse.success ? kpisResponse.kpis.slice(0, 5) : [], // Top 5 KPIs
          recent_reports: reportsResponse.success
            ? reportsResponse.reports.slice(0, 5)
            : [], // Last 5 reports
        },
      };
    } catch (error) {
      console.error('Error getting financial dashboard:', error);
      throw error;
    }
  }

  // ========== DOCUMENT MANAGEMENT ==========

  async uploadFinancialDocument(
    campaignId: number,
    financialId: number,
    file: File,
  ): Promise<{
    success: boolean;
    message: string;
    file_url?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('source_file', file);

      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/financials/${financialId}/upload`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        },
      );

      return response.json();
    } catch (error) {
      console.error('Error uploading financial document:', error);
      throw error;
    }
  }

  async uploadReportDocument(
    campaignId: number,
    reportId: number,
    file: File,
    documentType: string = 'full_report',
  ): Promise<{
    success: boolean;
    message: string;
    document?: any;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);

      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/investor_reports/${reportId}/documents`,
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
      console.error('Error uploading report document:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const financialManagementService = new FinancialManagementService();
