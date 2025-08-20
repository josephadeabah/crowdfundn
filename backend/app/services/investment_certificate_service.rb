# app/services/investment_certificate_service.rb
class InvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'

  # Brand colors
  BRAND_GREEN = '2E8B57'  # Sea Green
  BRAND_ORANGE = 'FF8C00' # Dark Orange

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

      # Add background image that covers the entire page
      add_background_image(pdf)

      # Add watermark background
      add_watermark(pdf)

      # Decorative header border with brand colors
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 3
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor + 10
      end
      pdf.move_down 20

      # Header with brand colors
      pdf.fill_color BRAND_GREEN
      pdf.text 'BANTUHIVE INVESTMENT CERTIFICATE', size: 28, align: :center, style: :bold
      pdf.move_down 15
      
      # Subtitle with orange accent
      pdf.fill_color BRAND_ORANGE
      pdf.text 'OFFICIAL CERTIFICATE OF OWNERSHIP', size: 14, align: :center, style: :italic
      pdf.move_down 30

      # Decorative separator
      pdf.stroke do
        pdf.stroke_color BRAND_ORANGE
        pdf.line_width 1
        pdf.horizontal_line pdf.bounds.width / 4, pdf.bounds.width * 3 / 4, at: pdf.cursor
      end
      pdf.move_down 30

      # Investor details
      pdf.fill_color '000000' # Black for main text
      investor_name = investment.user&.full_name || investment.full_name || 'Investor'
      campaign = investment.campaign
      
      pdf.text "This is to certify that", size: 16, align: :center
      pdf.move_down 10
      
      # Investor name with emphasis
      pdf.fill_color BRAND_GREEN
      pdf.text investor_name.upcase, size: 20, align: :center, style: :bold
      pdf.move_down 10
      
      pdf.fill_color '000000'
      pdf.text "has successfully invested", size: 16, align: :center
      pdf.move_down 10
      
      # Investment amount with brand orange
      pdf.fill_color BRAND_ORANGE
      pdf.text "#{campaign.currency_symbol}#{investment.amount.round(2)}", 
               size: 28, align: :center, style: :bold
      pdf.move_down 15
      
      pdf.fill_color '000000'
      pdf.text "in", size: 16, align: :center
      pdf.move_down 10
      
      # Company name with brand green
      pdf.fill_color BRAND_GREEN
      pdf.text campaign.company_name.to_s.upcase, size: 20, align: :center, style: :bold
      pdf.move_down 30

      # Decorative separator
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2
        pdf.horizontal_line 50, pdf.bounds.width - 50, at: pdf.cursor
      end
      pdf.move_down 30

      # Investment details section
      pdf.fill_color '000000'
      pdf.text 'INVESTMENT DETAILS', size: 18, align: :center, style: :bold
      pdf.move_down 20

      details = [
        ['Certificate Number:', { content: investment.certificate_number, color: BRAND_GREEN }],
        ['Date of Investment:', { content: investment.created_at.strftime('%B %d, %Y'), color: '000000' }],
        ['Shares Acquired:', { content: "#{investment.shares.round(4)} shares", color: '000000' }],
        ['Ownership Percentage:', { content: "#{investment.percentage.round(4)}%", color: BRAND_ORANGE }],
        ['Company Valuation:', { content: "#{campaign.currency_symbol}#{campaign.valuation.to_f.round(2)}", color: '000000' }],
        ['Equity Offered:', { content: "#{campaign.equity_offered}%", color: '000000' }],
        ['Investment ID:', { content: investment.id.to_s, color: BRAND_GREEN }],
        ['Campaign Title:', { content: campaign.title, color: '000000' }]
      ]

      pdf.table(details.map { |label, data| [label, data[:content]] }, 
                width: pdf.bounds.width - 100, 
                cell_style: { borders: [], padding: [8, 15, 8, 0] }) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 200, text_color: '000000')
        t.column(1).style(align: :left)
        
        # Apply colors to specific cells
        details.each_with_index do |(_, data), i|
          t.cells[i, 1].text_color = data[:color]
          t.cells[i, 1].font_style = :bold if data[:color] != '000000'
        end
      end

      pdf.move_down 40

      # Official footer section
      pdf.stroke do
        pdf.stroke_color BRAND_ORANGE
        pdf.line_width 1
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end
      pdf.move_down 20

      pdf.fill_color '000000'
      pdf.text "This certificate represents a legal ownership stake in #{campaign.company_name}", 
               size: 12, align: :center
      pdf.text "as per the terms outlined in the investment agreement and governed by the laws of the jurisdiction.", 
               size: 12, align: :center
      pdf.move_down 15

      # Issuance details with brand colors
      pdf.fill_color BRAND_GREEN
      pdf.text "ISSUED BY BANTUHIVE LIMITED", size: 14, align: :center, style: :bold
      pdf.move_down 5
      pdf.fill_color BRAND_ORANGE
      pdf.text "on #{Time.current.strftime('%B %d, %Y')}", size: 12, align: :center, style: :italic

      pdf.move_down 30

      # Final decorative border
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 3
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end

      # Add company registration footnote
      pdf.move_down 20
      pdf.fill_color '666666'
      pdf.text "Bantuhive Limited • Registered Investment Platform • www.bantuhive.com", 
               size: 10, align: :center

      # Create and verify temp file
      temp_file = Tempfile.new(["certificate_#{investment.certificate_number}", ".pdf"], binmode: true)
      pdf.render_file(temp_file.path)
      
      # Ensure file is properly written
      temp_file.close
      temp_file.open if temp_file.closed?
      
      unless File.exist?(temp_file.path) && File.size(temp_file.path) > 0
        raise "Failed to generate PDF file"
      end

      # Attach certificate
      investment.certificate.attach(
        io: File.open(temp_file.path),
        filename: "investment_certificate_#{investment.certificate_number}.pdf",
        content_type: 'application/pdf',
        identify: false
      )

      unless investment.certificate.attached?
        raise "Failed to attach certificate"
      end

      investment.save! if investment.changed?

      Rails.logger.info "Successfully generated and attached certificate for investment #{investment.id}"
      true
    rescue => e
      Rails.logger.error "Certificate generation failed: #{e.message}\n#{e.backtrace.join("\n")}"
      false
    ensure
      temp_file.close! if temp_file && !temp_file.closed?
      temp_file.unlink if temp_file
    end
  end

  private

  def self.add_background_image(pdf)
    background_path = Rails.root.join('app', 'assets', 'images', 'certificate.png')
    
    # Check if the background image exists
    unless File.exist?(background_path)
      Rails.logger.warn "Background image not found: #{background_path}"
      return
    end

    # Get the page dimensions (A4 size in points: 595.28 x 841.89)
    page_width = 595.28
    page_height = 841.89

    # Add the background image to cover the entire page
    pdf.image background_path,
              at: [0, page_height],  # Start from top-left corner
              width: page_width,
              height: page_height
  end

  def self.add_watermark(pdf)
    # Simple, reliable watermark
    pdf.transparent(0.03) do
      pdf.fill_color 'DDDDDD'
      
      # Single centered watermark
      pdf.text_box "BANTUHIVE",
                   at: [pdf.bounds.width / 2 - 100, pdf.bounds.height / 2],
                   size: 60,
                   style: :bold,
                   width: 200,
                   height: 100,
                   align: :center,
                   valign: :center
    end
    pdf.fill_color '000000'
  end

  def self.certificate_url(investment)
    return unless investment.certificate.attached?
    
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{investment.certificate.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(investment.certificate)
    end
  rescue => e
    Rails.logger.error "Failed to generate certificate URL for investment #{investment.id}: #{e.message}"
    nil
  end
end