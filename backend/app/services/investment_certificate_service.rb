# app/services/investment_certificate_service.rb
class InvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'
  require 'open-uri'

  def self.generate_certificate(investment)
    return false unless investment.is_a?(EquityInvestment) && investment.successful?

    begin
      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [72, 72, 72, 72],
        info: {
          Title: 'Investment Certificate',
          Creator: 'Bantuhive',
          CreationDate: Time.now
        }
      )

      # Add content to PDF
      add_certificate_content(pdf, investment)

      # Save to temp file and attach
      filename = "investment_certificate_#{investment.certificate_number}.pdf"
      temp_file = Tempfile.new(filename, binmode: true)
      
      pdf.render_file(temp_file.path)
      temp_file.rewind

      investment.certificate.attach(
        io: temp_file,
        filename: filename,
        content_type: 'application/pdf'
      )

      temp_file.close
      temp_file.unlink

      investment.certificate.attached?
    rescue => e
      Rails.logger.error "Certificate generation failed: #{e.message}\n#{e.backtrace.join("\n")}"
      false
    end
  end

  private

  def self.add_certificate_content(pdf, investment)
    campaign = investment.campaign
    
    # Header
    pdf.text 'BANTUHIVE INVESTMENT CERTIFICATE', size: 24, align: :center, style: :bold
    pdf.move_down 30
    pdf.stroke_horizontal_rule
    pdf.move_down 30

    # Investor details
    investor_name = investment.user&.full_name || investment.full_name || 'Investor'
    pdf.text "This certifies that #{investor_name}", size: 16, align: :center
    pdf.text "has invested #{campaign.currency_symbol}#{investment.amount.round(2)}", 
             size: 24, align: :center, style: :bold
    pdf.move_down 20
    pdf.text "in #{campaign.company_name}", size: 16, align: :center
    pdf.move_down 30
    pdf.stroke_horizontal_rule
    pdf.move_down 30

    # Investment details
    pdf.text 'Investment Details:', size: 16, style: :bold
    pdf.move_down 15

    details = [
      ['Certificate Number:', investment.certificate_number],
      ['Date:', investment.created_at.strftime('%B %d, %Y')],
      ['Shares Purchased:', "#{investment.shares.round(4)} shares"],
      ['Ownership Percentage:', "#{investment.percentage.round(4)}%"],
      ['Company Valuation:', "#{campaign.currency_symbol}#{campaign.valuation.to_f.round(2)}"],
      ['Equity Offered:', "#{campaign.equity_offered}%"],
      ['Investment ID:', investment.id],
      ['Campaign:', campaign.title]
    ]

    pdf.table(details, width: pdf.bounds.width - 100, cell_style: { borders: [] }) do |t|
      t.cells.padding = [5, 15, 5, 0]
      t.column(0).style(align: :right, font_style: :bold, width: 200)
      t.column(1).style(align: :left)
    end

    pdf.move_down 40

    # Footer
    pdf.text "This certificate represents a legal ownership stake in #{campaign.company_name}",
             size: 12, align: :center
    pdf.text 'as per the terms outlined in the investment agreement.',
             size: 12, align: :center
    pdf.move_down 20
    pdf.text "Issued by Bantuhive on #{Time.current.strftime('%B %d, %Y')}",
             size: 12, align: :center
  end
end