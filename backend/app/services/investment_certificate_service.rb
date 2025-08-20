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
        margin: [50, 50, 50, 50], # Reduced margins
        info: {
          Title: 'Investment Certificate',
          Creator: 'Bantuhive',
          CreationDate: Time.now
        }
      )

      # Add background image with transparent overlay
      add_background_image(pdf)

      # Add watermark background
      add_watermark(pdf)

      # Decorative header border with brand colors
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2 # Reduced from 3
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor + 5 # Reduced spacing
      end
      pdf.move_down 15 # Reduced from 20

      # Header with brand colors - Reduced font sizes
      pdf.fill_color BRAND_GREEN
      pdf.text 'BANTUHIVE INVESTMENT CERTIFICATE', size: 22, align: :center, style: :bold # Reduced from 28
      pdf.move_down 10 # Reduced from 15
      
      # Subtitle with orange accent - Reduced font size
      pdf.fill_color BRAND_ORANGE
      pdf.text 'OFFICIAL CERTIFICATE OF OWNERSHIP', size: 12, align: :center, style: :italic # Reduced from 14
      pdf.move_down 20 # Reduced from 30

      # Decorative separator
      pdf.stroke do
        pdf.stroke_color BRAND_ORANGE
        pdf.line_width 1
        pdf.horizontal_line pdf.bounds.width / 4, pdf.bounds.width * 3 / 4, at: pdf.cursor
      end
      pdf.move_down 20 # Reduced from 30

      # Investor details - Reduced font sizes
      pdf.fill_color '000000' # Black for main text
      investor_name = investment.user&.full_name || investment.full_name || 'Investor'
      campaign = investment.campaign
      
      pdf.text "This is to certify that", size: 14, align: :center # Reduced from 16
      pdf.move_down 8 # Reduced from 10
      
      # Investor name with emphasis - Reduced font size
      pdf.fill_color BRAND_GREEN
      pdf.text investor_name.upcase, size: 16, align: :center, style: :bold # Reduced from 20
      pdf.move_down 8 # Reduced from 10
      
      pdf.fill_color '000000'
      pdf.text "has successfully invested", size: 14, align: :center # Reduced from 16
      pdf.move_down 8 # Reduced from 10
      
      # Investment amount with brand orange - Reduced font size
      pdf.fill_color BRAND_ORANGE
      pdf.text "#{campaign.currency_symbol}#{investment.amount.round(2)}", 
               size: 22, align: :center, style: :bold # Reduced from 28
      pdf.move_down 12 # Reduced from 15
      
      pdf.fill_color '000000'
      pdf.text "in", size: 14, align: :center # Reduced from 16
      pdf.move_down 8 # Reduced from 10
      
      # Company name with brand green - Reduced font size
      pdf.fill_color BRAND_GREEN
      pdf.text campaign.company_name.to_s.upcase, size: 16, align: :center, style: :bold # Reduced from 20
      pdf.move_down 20 # Reduced from 30

      # Decorative separator
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 1.5 # Reduced from 2
        pdf.horizontal_line 40, pdf.bounds.width - 40, at: pdf.cursor # Reduced width
      end
      pdf.move_down 20 # Reduced from 30

      # Investment details section - Reduced font sizes
      pdf.fill_color '000000'
      pdf.text 'INVESTMENT DETAILS', size: 16, align: :center, style: :bold # Reduced from 18
      pdf.move_down 15 # Reduced from 20

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
                width: pdf.bounds.width - 80, # Reduced width
                cell_style: { borders: [], padding: [6, 12, 6, 0], size: 10 } # Reduced padding and font size
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 180, text_color: '000000') # Reduced width
        t.column(1).style(align: :left)
        
        # Apply colors to specific cells
        details.each_with_index do |(_, data), i|
          t.cells[i, 1].text_color = data[:color]
          t.cells[i, 1].font_style = :bold if data[:color] != '000000'
        end
      end

      pdf.move_down 30 # Reduced from 40

      # Official footer section - Reduced font sizes
      pdf.stroke do
        pdf.stroke_color BRAND_ORANGE
        pdf.line_width 1
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end
      pdf.move_down 15 # Reduced from 20

      pdf.fill_color '000000'
      pdf.text "This certificate represents a legal ownership stake in #{campaign.company_name}", 
               size: 10, align: :center # Reduced from 12
      pdf.text "as per the terms outlined in the investment agreement and governed by the laws of the jurisdiction.", 
               size: 10, align: :center # Reduced from 12
      pdf.move_down 12 # Reduced from 15

      # Issuance details with brand colors - Reduced font sizes
      pdf.fill_color BRAND_GREEN
      pdf.text "ISSUED BY BANTUHIVE LIMITED", size: 12, align: :center, style: :bold # Reduced from 14
      pdf.move_down 4 # Reduced from 5
      pdf.fill_color BRAND_ORANGE
      pdf.text "on #{Time.current.strftime('%B %d, %Y')}", size: 10, align: :center, style: :italic # Reduced from 12

      pdf.move_down 20 # Reduced from 30

      # Final decorative border
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2 # Reduced from 3
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end

      # Add company registration footnote - Reduced font size
      pdf.move_down 15 # Reduced from 20
      pdf.fill_color '666666'
      pdf.text "Bantuhive Limited • Registered Investment Platform • www.bantuhive.com", 
               size: 8, align: :center # Reduced from 10

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

    # Add background with original transparency
    pdf.transparent(0.1) do  # Keep original 10% opacity
      # Use fit option to maintain aspect ratio while making width 100%
      pdf.image background_path,
                at: [0, pdf.bounds.top],  # Position from bottom-left
                width: pdf.bounds.width,  # 100% width
                position: :absolute       # Ensure proper positioning
  end

    # Get the page dimensions (A4 size in points: 595.28 x 841.89)
    page_width = 595.28
    page_height = 841.89

    # Add background with transparency for a subtle overlay effect
    pdf.transparent(0.1) do  # Adjust transparency (0.0 to 1.0) - 0.1 = 10% opacity
      pdf.image background_path,
                at: [0, page_height],  # Start from top-left corner
                width: page_width,
                height: page_height
    end
  end

  def self.add_watermark(pdf)
    # Simple, reliable watermark with reduced size
    pdf.transparent(0.03) do
      pdf.fill_color 'DDDDDD'
      
      # Single centered watermark - Reduced size
      pdf.text_box "BANTUHIVE",
                   at: [pdf.bounds.width / 2 - 80, pdf.bounds.height / 2], # Adjusted position
                   size: 48, # Reduced from 60
                   style: :bold,
                   width: 160, # Reduced from 200
                   height: 80, # Reduced from 100
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