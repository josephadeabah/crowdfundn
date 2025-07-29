class InvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'

  def self.generate_certificate(investment)
    return nil unless investment.is_a?(EquityInvestment)

    begin
      pdf = initialize_pdf
      campaign = investment.campaign
      
      add_certificate_header(pdf)
      add_investor_details(pdf, investment, campaign)
      add_investment_details(pdf, investment, campaign)
      add_footer(pdf, campaign)
      
      attach_certificate(pdf, investment)
    rescue Prawn::Errors::CannotRender => e
      log_error("PDF generation failed", e, investment)
      nil
    rescue ActiveStorage::Error => e
      log_error("Certificate upload failed", e, investment)
      nil
    rescue => e
      log_error("Unexpected error", e, investment)
      nil
    end
  end

  private

  def self.initialize_pdf
    Prawn::Document.new(
      page_size: 'A4',
      page_layout: :portrait,
      margin: [1.inch, 1.inch, 1.inch, 1.inch]
    ).tap do |pdf|
      pdf.canvas { pdf.stroke_bounds }
      pdf.move_down 20
    end
  end

  def self.add_certificate_header(pdf)
    pdf.text "BANTUHIVE INVESTMENT CERTIFICATE", 
             size: 24, align: :center, style: :bold
    pdf.move_down 30
  end

  def self.add_investor_details(pdf, investment, campaign)
    pdf.text "This certifies that #{sanitize_text(investment.user.full_name)} has invested", 
             size: 16, align: :center
    pdf.text "#{campaign.currency_symbol}#{investment.amount.round(2)}", 
             size: 24, align: :center, style: :bold
    pdf.move_down 20
    pdf.text "in #{sanitize_text(campaign.company_name)}", 
             size: 16, align: :center
    pdf.move_down 30
  end

  def self.add_investment_details(pdf, investment, campaign)
    pdf.text "Investment Details:", size: 16, style: :bold
    pdf.move_down 10
    
    details = [
      ["Certificate Number:", investment.certificate_number],
      ["Date:", investment.created_at.strftime("%B %d, %Y")],
      ["Shares Purchased:", investment.shares.round(2).to_s],
      ["Ownership Percentage:", "#{investment.percentage.round(4)}%"],
      ["Company Valuation:", "#{campaign.currency_symbol}#{campaign.valuation.to_f.round(2)}"],
      ["Equity Offered:", "#{campaign.equity_offered}%"]
    ]
    
    pdf.table(details, width: 500, cell_style: { borders: [] }) do |t|
      t.cells.padding = [5, 10, 5, 0]
      t.column(0).style(align: :right, font_style: :bold)
      t.column(1).style(align: :left)
    end
    
    pdf.move_down 40
  end

  def self.add_footer(pdf, campaign)
    pdf.text "This certificate represents a legal ownership stake in #{sanitize_text(campaign.company_name)}", 
             size: 12, align: :center
    pdf.text "as per the terms outlined in the investment agreement.", 
             size: 12, align: :center
  end

  def self.attach_certificate(pdf, investment)
    filename = "investment_certificate_#{investment.certificate_number}.pdf"
    
    Tempfile.create(filename, binmode: true) do |tempfile|
      pdf.render_file(tempfile.path)
      
      investment.certificate.attach(
        io: File.open(tempfile.path),
        filename: filename,
        content_type: 'application/pdf',
        identify: false
      )
    end
    
    investment.certificate
  end

  def self.sanitize_text(text)
    ActionController::Base.helpers.sanitize(text.to_s, tags: []).strip
  end

  def self.log_error(message, error, investment)
    full_message = "#{message} for investment #{investment.id}: #{error.message}"
    Rails.logger.error(full_message)
    Sentry.capture_exception(error, extra: { investment_id: investment.id }) if defined?(Sentry)
  end
end