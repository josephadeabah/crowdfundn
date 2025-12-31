# app/services/investor_reporting/document_generator.rb
module InvestorReporting
  class DocumentGenerator
    require 'prawn'
    require 'prawn/table'
    
    def generate_investor_report_pdf(report)
      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [50, 50, 50, 50],
        info: {
          Title: "Investor Report: #{report.title}",
          Author: report.campaign.company_name,
          Creator: 'Bantuhive Investor Reporting',
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
      calculator = PortfolioCalculator.new(user)
      portfolio = calculator.calculate_detailed_portfolio
      
      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [50, 50, 50, 50],
        info: {
          Title: "Portfolio Statement",
          Author: user.full_name,
          Creator: 'Bantuhive Portfolio Management',
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
    
    def add_header(pdf, report)
        # Find the logo in compiled assets
      logo_path = Rails.root.join('public', 'assets', 'bantuhive_logo-*.png').glob.first || 
                  Rails.root.join('app', 'assets', 'images', 'bantuhive_logo.png')
      
      if File.exist?(logo_path)
        pdf.image logo_path, width: 100, position: :center
      else
        # Fallback to text if logo not found
        pdf.text "BANTUHIVE", size: 24, align: :center, style: :bold
      end
      pdf.move_down 20
      
      pdf.text "INVESTOR REPORT", size: 24, align: :center, style: :bold
      pdf.move_down 10
      
      pdf.text report.title, size: 16, align: :center
      pdf.move_down 5
      
      pdf.text "Period: #{report.period_description}", size: 12, align: :center
      pdf.text "Date: #{report.report_date.to_formatted_s(:long)}", size: 12, align: :center
      pdf.move_down 20
      
      pdf.stroke_horizontal_rule
      pdf.move_down 20
    end
    
    def add_executive_summary(pdf, report)
      pdf.text "Executive Summary", size: 16, style: :bold
      pdf.move_down 10
      
      if report.executive_summary.present?
        pdf.text report.executive_summary, size: 11
      else
        pdf.text "No executive summary provided.", size: 11, style: :italic
      end
      
      pdf.move_down 20
      
      if report.key_highlights.present?
        pdf.text "Key Highlights", size: 14, style: :bold
        pdf.move_down 5
        pdf.text report.key_highlights, size: 11
        pdf.move_down 20
      end
    end
    
    def add_financial_performance(pdf, report)
      pdf.text "Financial Performance", size: 16, style: :bold
      pdf.move_down 10
      
      # Get latest financial statements
      financials = report.campaign.financial_statements
                        .published
                        .where('period_end <= ?', report.period_end || report.report_date)
                        .order(period_end: :desc)
                        .first(3)
      
      if financials.any?
        financials.each do |fs|
          pdf.text "#{fs.period_type.capitalize} Period: #{fs.period_start.to_s(:short)} - #{fs.period_end.to_s(:short)}", size: 12, style: :bold
          pdf.move_down 5
          
          data = [
            ["Revenue", format_currency(fs.revenue, report.campaign)],
            ["Expenses", format_currency(fs.expenses, report.campaign)],
            ["Gross Profit", format_currency(fs.gross_profit, report.campaign)],
            ["Gross Margin", "#{fs.gross_margin}%"],
            ["Net Income", format_currency(fs.net_income, report.campaign)],
            ["Net Margin", "#{fs.net_margin}%"],
            ["Assets", format_currency(fs.assets, report.campaign)],
            ["Liabilities", format_currency(fs.liabilities, report.campaign)],
            ["Equity", format_currency(fs.equity, report.campaign)]
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
    end
    
    def add_portfolio_update(pdf, report)
      pdf.text "Portfolio Update", size: 16, style: :bold
      pdf.move_down 10
      
      # Get campaign valuation and investor metrics
      campaign = report.campaign
      
      data = [
        ["Company Valuation", format_currency(campaign.valuation, campaign)],
        ["Equity Offered", "#{campaign.equity_offered}%"],
        ["Equity Raised", "#{campaign.percentage_raised.round(2)}%"],
        ["Shares Issued", campaign.shares_issued.to_i.to_s],
        ["Shares Available", campaign.shares_available.to_i.to_s],
        ["Total Investors", campaign.total_investors.to_s],
        ["Total Invested", format_currency(campaign.total_equity_invested, campaign)]
      ]
      
      pdf.table(data, width: pdf.bounds.width, cell_style: { padding: [3, 10, 3, 0] }) do |t|
        t.column(0).style(width: 120)
        t.column(1).style(align: :right)
      end
      
      pdf.move_down 20
    end
    
    def add_forward_outlook(pdf, report)
      return unless report.forward_outlook.present?
      
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
      
      pdf.text "Bantuhive Limited", size: 10, align: :center
      pdf.text "27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana", 
               size: 9, align: :center
      pdf.text "www.bantuhive.com | help@bantuhive.com", size: 9, align: :center
      pdf.text "Generated on #{Time.current.to_formatted_s(:long)}", size: 8, align: :center
    end
    
    def add_portfolio_header(pdf, user, period)
      pdf.image Rails.root.join('app/assets/images/bantuhive_logo.png'), width: 100, position: :center
      pdf.move_down 20
      
      pdf.text "PORTFOLIO STATEMENT", size: 24, align: :center, style: :bold
      pdf.move_down 10
      
      pdf.text "Investor: #{user.full_name}", size: 14, align: :center
      pdf.text "Statement Date: #{period || Date.current.to_formatted_s(:long)}", size: 12, align: :center
      pdf.text "Account #: #{user.id.to_s.rjust(8, '0')}", size: 12, align: :center
      pdf.move_down 20
      
      pdf.stroke_horizontal_rule
      pdf.move_down 20
    end
    
    def add_portfolio_summary(pdf, summary)
      pdf.text "Portfolio Summary", size: 16, style: :bold
      pdf.move_down 10
      
      data = [
        ["Total Invested", format_currency(summary[:total_invested], summary[:currency_symbol])],
        ["Current Portfolio Value", format_currency(summary[:current_value], summary[:currency_symbol])],
        ["Total Returns", format_currency(summary[:total_returns], summary[:currency_symbol])],
        ["Return on Investment (ROI)", "#{summary[:roi]}%"],
        ["Multiple on Invested Capital (MOIC)", "#{summary[:moic]}x"],
        ["Internal Rate of Return (IRR)", "#{summary[:irr]}%"],
        ["Number of Investments", summary[:active_investments].to_s],
        ["Campaigns Invested In", summary[:invested_campaigns].to_s]
      ]
      
      pdf.table(data, width: pdf.bounds.width, cell_style: { padding: [5, 10, 5, 0] }) do |t|
        t.column(0).style(width: 200, font_style: :bold)
        t.column(1).style(align: :right)
        
        # Highlight positive/negative returns
        data.each_with_index do |row, i|
          if row[0].include?('Returns') && row[1].start_with?('-')
            t.cells[i, 1].text_color = 'FF0000'
          elsif row[0].include?('Returns') && !row[1].start_with?('-')
            t.cells[i, 1].text_color = '00AA00'
          end
        end
      end
      
      pdf.move_down 20
    end
    
    def add_campaign_breakdown(pdf, campaigns)
      return if campaigns.empty?
      
      pdf.text "Campaign Breakdown", size: 16, style: :bold
      pdf.move_down 10
      
      headers = ['Campaign', 'Invested', 'Current Value', 'Returns', 'ROI', 'Ownership %']
      rows = campaigns.map do |campaign|
        [
          truncate(campaign[:campaign_name], length: 30),
          format_currency(campaign[:invested], '$'),
          format_currency(campaign[:current_value], '$'),
          format_currency(campaign[:returns], '$'),
          "#{campaign[:roi]}%",
          "#{campaign[:ownership_percentage]}%"
        ]
      end
      
      pdf.table([headers] + rows, width: pdf.bounds.width, 
                header: true,
                cell_style: { padding: [3, 5, 3, 5], size: 9 }) do |t|
        t.row(0).style(background_color: 'f0f0f0', font_style: :bold)
        
        # Style returns column
        campaigns.each_with_index do |campaign, i|
          row_index = i + 1
          if campaign[:returns] < 0
            t.cells[row_index, 3].text_color = 'FF0000'
            t.cells[row_index, 4].text_color = 'FF0000'
          elsif campaign[:returns] > 0
            t.cells[row_index, 3].text_color = '00AA00'
            t.cells[row_index, 4].text_color = '00AA00'
          end
        end
      end
      
      pdf.move_down 20
    end
    
    def add_performance_analysis(pdf, metrics)
      pdf.text "Performance Analysis", size: 16, style: :bold
      pdf.move_down 10
      
      if metrics[:best_performing]
        pdf.text "Best Performing Campaign: #{metrics[:best_performing].title}", size: 12
      end
      
      if metrics[:worst_performing]
        pdf.text "Worst Performing Campaign: #{metrics[:worst_performing].title}", size: 12
      end
      
      pdf.text "Time-Weighted Return: #{metrics[:time_weighted_return].round(2)}%", size: 12
      pdf.text "Annualized Volatility: #{metrics[:annualized_volatility]}%", size: 12
      
      pdf.move_down 20
    end
    
    def add_risk_assessment(pdf, risk)
      pdf.text "Risk Assessment", size: 16, style: :bold
      pdf.move_down 10
      
      data = [
        ["Concentration Risk", "#{(risk[:concentration_risk] * 100).round(1)}%"],
        ["Sector Diversification", "#{(risk[:sector_diversification] * 100).round(1)}%"],
        ["Liquidity Risk", "#{(risk[:liquidity_risk] * 100).round(1)}%"],
        ["Overall Risk Score", "#{(risk[:overall_risk_score] * 100).round(1)}%"],
        ["Risk Category", risk[:risk_category].upcase]
      ]
      
      pdf.table(data, width: 300, cell_style: { padding: [3, 10, 3, 0] }) do |t|
        t.column(0).style(width: 180)
        t.column(1).style(align: :right)
        
        # Color code risk category
        data.each_with_index do |row, i|
          if row[0] == 'Risk Category'
            color = case row[1].downcase
                    when 'low' then '00AA00'
                    when 'medium' then 'FF9900'
                    when 'high' then 'FF0000'
                    else '000000'
                    end
            t.cells[i, 1].text_color = color
            t.cells[i, 1].font_style = :bold
          end
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
      pdf.text "Bantuhive Investor Relations", size: 10
      pdf.text "help@bantuhive.com | www.bantuhive.com", size: 9
      pdf.text "Generated on #{Time.current.to_formatted_s(:long)}", size: 8, align: :center
    end
    
    def format_currency(amount, currency_or_campaign)
      if currency_or_campaign.is_a?(Campaign)
        symbol = currency_or_campaign.currency_symbol
      else
        symbol = currency_or_campaign
      end
      
      "#{symbol}#{amount.to_f.round(2)}"
    end
    
    def truncate(text, length: 30)
      text.length > length ? "#{text[0..length-3]}..." : text
    end
  end
end