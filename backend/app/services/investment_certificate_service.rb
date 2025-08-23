# app/services/investment_certificate_service.rb
class InvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'
  require 'open-uri'

  # Brand colors
  BRAND_GREEN = '2E8B57'  # Sea Green
  BRAND_ORANGE = 'FF8C00' # Dark Orange

  def self.generate_certificate(investment)
    return false unless investment.is_a?(EquityInvestment) && investment.successful?

    begin
      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [40, 40, 40, 40],
        info: {
          Title: 'Investment Certificate',
          Creator: 'Bantuhive',
          CreationDate: Time.now
        }
      )

      # Add background and watermark
      add_background_image(pdf)
      add_watermark(pdf)

      # Get signatures
      investor_signature_url = get_investor_signature_url(investment)
      issuer_signature_url = get_issuer_signature_url(investment)

      # Decorative header
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor + 3
      end
      pdf.move_down 12

      # Header
      pdf.fill_color BRAND_GREEN
      pdf.text 'BANTUHIVE INVESTMENT CERTIFICATE', size: 20, align: :center, style: :bold
      pdf.move_down 8
      
      pdf.fill_color BRAND_ORANGE
      pdf.text 'OFFICIAL CERTIFICATE OF OWNERSHIP', size: 11, align: :center, style: :italic
      pdf.move_down 15

      # Investor details
      pdf.fill_color '000000'
      investor_name = investment.user&.full_name || investment.full_name || 'Investor'
      campaign = investment.campaign
      fundraiser = campaign.fundraiser
      
      pdf.text "This is to certify that", size: 13, align: :center
      pdf.move_down 6
      
      pdf.fill_color BRAND_GREEN
      pdf.text investor_name.upcase, size: 15, align: :center, style: :bold
      pdf.move_down 6
      
      pdf.fill_color '000000'
      pdf.text "has successfully invested", size: 13, align: :center
      pdf.move_down 6
      
      pdf.fill_color BRAND_ORANGE
      pdf.text "#{campaign.currency}#{investment.amount.round(2)}", 
               size: 20, align: :center, style: :bold
      pdf.move_down 10
      
      pdf.fill_color '000000'
      pdf.text "in", size: 13, align: :center
      pdf.move_down 6
      
      pdf.fill_color BRAND_GREEN
      pdf.text campaign.company_name.to_s.upcase, size: 15, align: :center, style: :bold
      pdf.move_down 15

      # Company information
      pdf.fill_color '000000'
      pdf.text 'COMPANY INFORMATION', size: 14, align: :center, style: :bold
      pdf.move_down 10

      company_details = [
        ['Company:', campaign.company_name],
        ['Description:', campaign.company_description.to_s.truncate(100)],
        ['Headquarters:', campaign.company_headquarters],
        ['Website:', campaign.company_website],
        ['Valuation:', "#{campaign.currency} #{campaign.valuation.to_f.round(2)}"],
        ['Equity Offered:', "#{campaign.equity_offered}%"],
        ['Contract Terms:', campaign.contract_term || 'N/A'],
      ]

      pdf.table(company_details, 
                width: pdf.bounds.width,
                cell_style: { borders: [], padding: [4, 8, 4, 0], size: 9 }
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 100, text_color: '000000')
        t.column(1).style(align: :left)
      end

      pdf.move_down 12

      # Fundraiser information
      pdf.text 'FUNDRAISER INFORMATION', size: 14, align: :center, style: :bold
      pdf.move_down 10

      fundraiser_details = [
        ['Fundraiser:', fundraiser.full_name],
        ['Email:', fundraiser.email],
        ['Campaign:', campaign.title]
      ]

      pdf.table(fundraiser_details, 
                width: pdf.bounds.width,
                cell_style: { borders: [], padding: [4, 8, 4, 0], size: 9 }
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 100, text_color: '000000')
        t.column(1).style(align: :left)
      end

      pdf.move_down 15

      # Investment details
      pdf.fill_color '000000'
      pdf.text 'INVESTMENT DETAILS', size: 15, align: :center, style: :bold
      pdf.move_down 12

      details = [
        ['Certificate Number:', { content: investment.certificate_number, color: BRAND_GREEN }],
        ['Date of Investment:', { content: investment.created_at.strftime('%B %d, %Y'), color: '000000' }],
        ['Shares Acquired:', { content: "#{investment.shares.round(4)} shares", color: '000000' }],
        ['Ownership Percentage:', { content: "#{investment.percentage.round(4)}%", color: BRAND_ORANGE }],
        ['Investment ID:', { content: investment.id.to_s, color: BRAND_GREEN }]
      ]

      pdf.table(details.map { |label, data| [label, data[:content]] }, 
                width: pdf.bounds.width,
                cell_style: { borders: [], padding: [5, 10, 5, 0], size: 9 }
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 150, text_color: '000000')
        t.column(1).style(align: :left)
        
        details.each_with_index do |(_, data), i|
          t.cells[i, 1].text_color = data[:color]
          t.cells[i, 1].font_style = :bold if data[:color] != '000000'
        end
      end

      # Add signatures section
      add_signatures_section(pdf, investor_signature_url, issuer_signature_url, investor_name, fundraiser.full_name)

      pdf.move_down 20

      # Official footer
      pdf.stroke do
        pdf.stroke_color BRAND_ORANGE
        pdf.line_width 1
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end
      pdf.move_down 12

      pdf.fill_color '000000'
      pdf.text "This certificate represents a legal ownership stake in #{campaign.company_name}", 
               size: 9, align: :center
      pdf.text "as per the terms outlined in the investment agreement and governed by the laws of the jurisdiction.", 
               size: 9, align: :center
      pdf.move_down 10

      pdf.fill_color BRAND_GREEN
      pdf.text "ISSUED BY BANTUHIVE LIMITED", size: 11, align: :center, style: :bold
      pdf.move_down 3
      pdf.fill_color BRAND_ORANGE
      pdf.text "on #{Time.current.strftime('%B %d, %Y')}", size: 9, align: :center, style: :italic

      pdf.move_down 15

      # Final decorative border
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end

      # Footer
      pdf.move_down 12
      pdf.fill_color '666666'
      pdf.text "Bantuhive Limited • Registered Investment Platform • www.bantuhive.com", 
               size: 7, align: :center

      # Create temp file and attach
      temp_file = Tempfile.new(["certificate_#{investment.certificate_number}", ".pdf"], binmode: true)
      pdf.render_file(temp_file.path)
      
      temp_file.close
      temp_file.open if temp_file.closed?
      
      unless File.exist?(temp_file.path) && File.size(temp_file.path) > 0
        raise "Failed to generate PDF file"
      end

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

  def self.add_signatures_section(pdf, investor_sig_url, issuer_sig_url, investor_name, issuer_name)
    pdf.move_down 30
    
    # Create a table for signatures
    signature_data = [
      [
        { content: "INVESTOR SIGNATURE", align: :center, font_style: :bold },
        { content: "ISSUER SIGNATURE", align: :center, font_style: :bold }
      ],
      [
        { content: "", height: 60 },
        { content: "", height: 60 }
      ],
      [
        { content: investor_name, align: :center, size: 9 },
        { content: issuer_name, align: :center, size: 9 }
      ],
      [
        { content: "_________________________", align: :center, size: 8 },
        { content: "_________________________", align: :center, size: 8 }
      ]
    ]

    # Add signature images if available
    if investor_sig_url
      begin
        signature_image = open(investor_sig_url)
        pdf.image signature_image, width: 120, height: 40, at: [50, pdf.cursor - 20]
      rescue => e
        Rails.logger.warn "Could not load investor signature: #{e.message}"
      end
    end

    if issuer_sig_url
      begin
        signature_image = open(issuer_sig_url)
        pdf.image signature_image, width: 120, height: 40, at: [300, pdf.cursor - 20]
      rescue => e
        Rails.logger.warn "Could not load issuer signature: #{e.message}"
      end
    end

    pdf.move_down 80
  end

  def self.get_investor_signature_url(investment)
    return unless investment.user
    investment.user.latest_kyc&.signature_image_url
  end

  def self.get_issuer_signature_url(investment)
    issuer = investment.campaign.fundraiser
    return unless issuer
    issuer.latest_kyc&.signature_image_url
  end

  private_class_method :add_background_image, :add_watermark, :add_signatures_section,
                       :get_investor_signature_url, :get_issuer_signature_url

  def self.add_background_image(pdf)
    background_path = Rails.root.join('app', 'assets', 'images', 'certificate.png')
    
    return unless File.exist?(background_path)

    pdf.transparent(0.1) do
      pdf.canvas do
        pdf.image background_path,
                  at: [0, pdf.bounds.top],
                  fit: [pdf.bounds.width, pdf.bounds.height],
                  position: :absolute
      end
    end
  end

  def self.add_watermark(pdf)
    pdf.transparent(0.03) do
      pdf.fill_color 'DDDDDD'
      
      pdf.text_box "BANTUHIVE",
                   at: [pdf.bounds.width / 2 - 70, pdf.bounds.height / 2],
                   size: 45,
                   style: :bold,
                   width: 140,
                   height: 70,
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