# app/services/investor_reporting/document_generator.rb
module InvestorReporting
  class DocumentGenerator
    require 'prawn'
    require 'prawn/table'
    
    # Environment Configuration
    def self.frontend_url
      ENV.fetch('FRONTEND_URL', 'https://bantuhive.com')
    end
    
    def self.support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@bantuhive.com')
    end
    
    def self.company_name
      ENV.fetch('COMPANY_NAME', 'Bantuhive')
    end
    
    def self.company_address
      ENV.fetch('COMPANY_ADDRESS', '27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.')
    end
    
    def generate_investor_report_pdf(report)
      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [50, 50, 50, 50],
        info: {
          Title: "Investor Report: #{report.try(:title) || 'Report'}",
          Author: report.campaign&.company_name || self.class.company_name,
          Creator: "#{self.class.company_name} Investor Reporting",
          CreationDate: Time.now
        }
      )
      
      add_header(pdf, report)
      add_executive_summary(pdf, report)
      add_financial_performance(pdf, report)
      add_portfolio_update(pdf, report)
      add_forward_outlook(pdf, report)
      add_footer(pdf, report)
      
      pdf
    end
    
    def generate_portfolio_statement(user, period = nil)
      portfolio = calculate_portfolio(user)
      
      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [50, 50, 50, 50],
        info: {
          Title: "Portfolio Statement",
          Author: user.try(:full_name) || 'Investor',
          Creator: "#{self.class.company_name} Portfolio Management",
          CreationDate: Time.now
        }
      )
      
      add_portfolio_header(pdf, user, period)
      add_portfolio_summary(pdf, portfolio[:summary])
      add_campaign_breakdown(pdf, portfolio[:by_campaign])
      add_performance_analysis(pdf, portfolio[:performance_metrics])
      add_risk_assessment(pdf, portfolio[:risk_analysis])
      add_portfolio_footer(pdf, user)
      
      pdf
    end
    
    private
    
    def calculate_portfolio(user)
      {
        summary: {
          total_invested: 0,
          current_value: 0,
          total_returns: 0,
          roi: 0,
          moic: 0,
          irr: 0,
          active_investments: 0,
          invested_campaigns: 0
        },
        by_campaign: [],
        performance_metrics: {},
        risk_analysis: {}
      }
    end
    
    def add_header(pdf, report)
      logo_path = find_logo_path
      
      if logo_path && File.exist?(logo_path)
        begin
          pdf.image logo_path, width: 100, position: :center
        rescue => e
          Rails.logger.error "Error loading logo: #{e.message}"
          pdf.text self.class.company_name, size: 24, align: :center, style: :bold
        end
      else
        pdf.text self.class.company_name, size: 24, align: :center, style: :bold
      end
      
      pdf.move_down 20
      
      pdf.text "INVESTOR REPORT", size: 24, align: :center, style: :bold
      pdf.move_down 10
      
      pdf.text report.title.to_s, size: 16, align: :center
      pdf.move_down 5
      
      pdf.text "Period: #{report.try(:period_description) || 'N/A'}", size: 12, align: :center
      pdf.text "Date: #{report.try(:report_date)&.to_formatted_s(:long) || Time.current.to_formatted_s(:long)}", size: 12, align: :center
      pdf.move_down 20
      
      pdf.stroke_horizontal_rule
      pdf.move_down 20
    end
    
    def add_executive_summary(pdf, report)
      pdf.text "Executive Summary", size: 16, style: :bold
      pdf.move_down 10
      
      if report.try(:executive_summary).present?
        pdf.text report.executive_summary, size: 11
      else
        pdf.text "No executive summary provided.", size: 11, style: :italic
      end
      
      pdf.move_down 20
      
      if report.try(:key_highlights).present?
        pdf.text "Key Highlights", size: 14, style: :bold
        pdf.move_down 5
        pdf.text report.key_highlights, size: 11
        pdf.move_down 20
      end
    end
    
    def add_financial_performance(pdf, report)
      pdf.text "Financial Performance", size: 16, style: :bold
      pdf.move_down 10
      
      campaign = report.campaign
      
      if campaign && campaign.respond_to?(:financial_statements)
        financials = campaign.financial_statements
                          .where(status: 'published')
                          .where('period_end <= ?', report.period_end || report.report_date || Time.current)
                          .order(period_end: :desc)
                          .limit(3)
        
        if financials.any?
          financials.each do |fs|
            pdf.text "#{fs.period_type.to_s.capitalize} Period: #{fs.period_start&.to_formatted_s(:short) || 'N/A'} - #{fs.period_end&.to_formatted_s(:short) || 'N/A'}", size: 12, style: :bold
            pdf.move_down 5
            
            data = [
              ["Revenue", format_currency(fs.revenue, campaign)],
              ["Expenses", format_currency(fs.expenses, campaign)],
              ["Gross Profit", format_currency(fs.gross_profit, campaign)],
              ["Gross Margin", "#{fs.gross_margin || 0}%"],
              ["Net Income", format_currency(fs.net_income, campaign)],
              ["Net Margin", "#{fs.net_margin || 0}%"],
              ["Assets", format_currency(fs.assets, campaign)],
              ["Liabilities", format_currency(fs.liabilities, campaign)],
              ["Equity", format_currency(fs.equity, campaign)]
            ]
            
            pdf.table(data, width: pdf.bounds.width, cell_style: { padding: [3, 10, 3, 0] }) do |t|
              t.column(0).style(width: 120)
              t.column(1).style(align: :right)
            end
            
            pdf.move_down 15
          end
        else
          pdf.text "No financial data available for this period.", size: 11, style: :italic
          pdf.move_down 15
        end
      else
        pdf.text "No financial data available.", size: 11, style: :italic
        pdf.move_down 15
      end
    end
    
    def add_portfolio_update(pdf, report)
      pdf.text "Portfolio Update", size: 16, style: :bold
      pdf.move_down 10
      
      campaign = report.campaign
      
      if campaign
        data = [
          ["Company Valuation", format_currency(campaign.valuation, campaign)],
          ["Equity Offered", "#{campaign.equity_offered || 0}%"],
          ["Equity Raised", "#{campaign.try(:percentage_raised)&.round(2) || 0}%"],
          ["Shares Issued", (campaign.shares_issued.to_i || 0).to_s],
          ["Shares Available", (campaign.shares_available.to_i || 0).to_s],
          ["Total Investors", (campaign.total_investors || 0).to_s],
          ["Total Invested", format_currency(campaign.total_equity_invested, campaign)]
        ]
        
        pdf.table(data, width: pdf.bounds.width, cell_style: { padding: [3, 10, 3, 0] }) do |t|
          t.column(0).style(width: 120)
          t.column(1).style(align: :right)
        end
        
        pdf.move_down 20
      else
        pdf.text "No campaign data available.", size: 11, style: :italic
        pdf.move_down 20
      end
    end
    
    def add_forward_outlook(pdf, report)
      return unless report.try(:forward_outlook).present?
      
      pdf.text "Forward Outlook", size: 16, style: :bold
      pdf.move_down 10
      pdf.text report.forward_outlook, size: 11
      pdf.move_down 20
    end
    
    def add_footer(pdf, report)
      pdf.stroke_horizontal_rule
      pdf.move_down 20
      
      pdf.text "Confidential", size: 10, align: :center, style: :italic
      pdf.text "This report contains confidential information intended only for authorized investors.", 
               size: 9, align: :center
      pdf.text "Unauthorized distribution is prohibited.", size: 9, align: :center
      pdf.move_down 10
      
      pdf.text "#{self.class.company_name} Limited", size: 10, align: :center
      pdf.text self.class.company_address, size: 9, align: :center
      pdf.text "#{self.class.frontend_url} | #{self.class.support_email}", size: 9, align: :center
      pdf.text "Generated on #{Time.current.to_formatted_s(:long)}", size: 8, align: :center
    end
    
    def add_portfolio_header(pdf, user, period)
      logo_path = find_logo_path
      
      if logo_path && File.exist?(logo_path)
        begin
          pdf.image logo_path, width: 100, position: :center
        rescue => e
          Rails.logger.error "Error loading logo: #{e.message}"
          pdf.text self.class.company_name, size: 24, align: :center, style: :bold
        end
      else
        pdf.text self.class.company_name, size: 24, align: :center, style: :bold
      end
      
      pdf.move_down 20
      
      pdf.text "PORTFOLIO STATEMENT", size: 24, align: :center, style: :bold
      pdf.move_down 10
      
      pdf.text "Investor: #{user.try(:full_name) || 'N/A'}", size: 14, align: :center
      pdf.text "Statement Date: #{period.presence || Date.current.to_formatted_s(:long)}", size: 12, align: :center
      pdf.text "Account #: #{user.try(:id).to_s.rjust(8, '0')}", size: 12, align: :center
      pdf.move_down 20
      
      pdf.stroke_horizontal_rule
      pdf.move_down 20
    end
    
    def add_portfolio_summary(pdf, summary)
      pdf.text "Portfolio Summary", size: 16, style: :bold
      pdf.move_down 10
      
      summary = summary || {}
      currency = summary[:currency_symbol] || '$'
      
      data = [
        ["Total Invested", format_currency(summary[:total_invested] || 0, currency)],
        ["Current Portfolio Value", format_currency(summary[:current_value] || 0, currency)],
        ["Total Returns", format_currency(summary[:total_returns] || 0, currency)],
        ["Return on Investment (ROI)", "#{summary[:roi] || 0}%"],
        ["Multiple on Invested Capital (MOIC)", "#{summary[:moic] || 0}x"],
        ["Internal Rate of Return (IRR)", "#{summary[:irr] || 0}%"],
        ["Number of Investments", (summary[:active_investments] || 0).to_s],
        ["Campaigns Invested In", (summary[:invested_campaigns] || 0).to_s]
      ]
      
      pdf.table(data, width: pdf.bounds.width, cell_style: { padding: [5, 10, 5, 0] }) do |t|
        t.column(0).style(width: 200, font_style: :bold)
        t.column(1).style(align: :right)
        
        # Highlight positive/negative returns
        returns_row = data.find { |r| r[0].include?('Returns') }
        if returns_row && returns_row[1].to_s.start_with?('-')
          t.cells[returns_row_index(data, 'Total Returns'), 1].text_color = 'FF0000'
        elsif returns_row && !returns_row[1].to_s.start_with?('-')
          t.cells[returns_row_index(data, 'Total Returns'), 1].text_color = '00AA00'
        end
      end
      
      pdf.move_down 20
    end
    
    def returns_row_index(data, label)
      data.index { |r| r[0] == label } || 0
    end
    
    def add_campaign_breakdown(pdf, campaigns)
      return if campaigns.blank?
      
      pdf.text "Campaign Breakdown", size: 16, style: :bold
      pdf.move_down 10
      
      headers = ['Campaign', 'Invested', 'Current Value', 'Returns', 'ROI', 'Ownership %']
      rows = campaigns.map do |campaign|
        [
          truncate(campaign[:campaign_name].to_s, length: 30),
          format_currency(campaign[:invested] || 0, '$'),
          format_currency(campaign[:current_value] || 0, '$'),
          format_currency(campaign[:returns] || 0, '$'),
          "#{campaign[:roi] || 0}%",
          "#{campaign[:ownership_percentage] || 0}%"
        ]
      end
      
      pdf.table([headers] + rows, width: pdf.bounds.width, 
                header: true,
                cell_style: { padding: [3, 5, 3, 5], size: 9 }) do |t|
        t.row(0).style(background_color: 'f0f0f0', font_style: :bold)
        
        # Style returns column
        campaigns.each_with_index do |campaign, i|
          row_index = i + 1
          returns = campaign[:returns] || 0
          if returns < 0
            t.cells[row_index, 3].text_color = 'FF0000'
            t.cells[row_index, 4].text_color = 'FF0000'
          elsif returns > 0
            t.cells[row_index, 3].text_color = '00AA00'
            t.cells[row_index, 4].text_color = '00AA00'
          end
        end
      end
      
      pdf.move_down 20
    end
    
    def add_performance_analysis(pdf, metrics)
      metrics = metrics || {}
      
      pdf.text "Performance Analysis", size: 16, style: :bold
      pdf.move_down 10
      
      if metrics[:best_performing].present?
        pdf.text "Best Performing Campaign: #{metrics[:best_performing].title}", size: 12
      end
      
      if metrics[:worst_performing].present?
        pdf.text "Worst Performing Campaign: #{metrics[:worst_performing].title}", size: 12
      end
      
      pdf.text "Time-Weighted Return: #{(metrics[:time_weighted_return] || 0).round(2)}%", size: 12
      pdf.text "Annualized Volatility: #{metrics[:annualized_volatility] || 0}%", size: 12
      
      pdf.move_down 20
    end
    
    def add_risk_assessment(pdf, risk)
      risk = risk || {}
      
      pdf.text "Risk Assessment", size: 16, style: :bold
      pdf.move_down 10
      
      data = [
        ["Concentration Risk", "#{((risk[:concentration_risk] || 0) * 100).round(1)}%"],
        ["Sector Diversification", "#{((risk[:sector_diversification] || 0) * 100).round(1)}%"],
        ["Liquidity Risk", "#{((risk[:liquidity_risk] || 0) * 100).round(1)}%"],
        ["Overall Risk Score", "#{((risk[:overall_risk_score] || 0) * 100).round(1)}%"],
        ["Risk Category", (risk[:risk_category] || 'UNKNOWN').upcase]
      ]
      
      pdf.table(data, width: 300, cell_style: { padding: [3, 10, 3, 0] }) do |t|
        t.column(0).style(width: 180)
        t.column(1).style(align: :right)
        
        # Color code risk category
        category_row = data.find { |r| r[0] == 'Risk Category' }
        if category_row
          color = case category_row[1].downcase
                  when 'low' then '00AA00'
                  when 'medium' then 'FF9900'
                  when 'high' then 'FF0000'
                  else '000000'
                  end
          t.cells[4, 1].text_color = color
          t.cells[4, 1].font_style = :bold
        end
      end
      
      pdf.move_down 20
    end
    
    def add_portfolio_footer(pdf, user)
      pdf.stroke_horizontal_rule
      pdf.move_down 20
      
      pdf.text "Important Disclosures:", size: 10, style: :bold
      pdf.text "1. Past performance is not indicative of future results.", size: 9
      pdf.text "2. Investment values are estimates and may fluctuate.", size: 9
      pdf.text "3. This statement is for informational purposes only.", size: 9
      pdf.move_down 10
      
      pdf.text "For questions about your portfolio, contact:", size: 10
      pdf.text "#{self.class.company_name} Investor Relations", size: 10
      pdf.text "#{self.class.support_email} | #{self.class.frontend_url}", size: 9
      pdf.text "Generated on #{Time.current.to_formatted_s(:long)}", size: 8, align: :center
    end
    
    def format_currency(amount, currency_or_campaign)
      amount = amount.to_f
      symbol = if currency_or_campaign.respond_to?(:currency_symbol)
                 currency_or_campaign.currency_symbol || '$'
               else
                 currency_or_campaign || '$'
               end
      
      "#{symbol}#{amount.round(2)}"
    rescue => e
      "$0.00"
    end
    
    def truncate(text, length: 30)
      text = text.to_s
      text.length > length ? "#{text[0..length-3]}..." : text
    end
    
    def find_logo_path
      # Check for compiled assets with fingerprints
      compiled_pattern = Rails.root.join('public', 'assets', 'bantuhive_logo-*.png')
      compiled_logos = Dir.glob(compiled_pattern.to_s)
      return compiled_logos.first if compiled_logos.any?
      
      # Fallback to source asset
      source_path = Rails.root.join('app', 'assets', 'images', 'bantuhive_logo.png')
      return source_path if File.exist?(source_path)
      
      # Check in public folder
      public_path = Rails.root.join('public', 'images', 'bantuhive_logo.png')
      return public_path if File.exist?(public_path)
      
      # Try with different extensions
      ['jpg', 'jpeg', 'gif', 'svg'].each do |ext|
        path = Rails.root.join('app', 'assets', 'images', "bantuhive_logo.#{ext}")
        return path if File.exist?(path)
      end
      
      nil
    rescue => e
      Rails.logger.warn "Could not find logo: #{e.message}"
      nil
    end
  end
end