class ClubInvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'
  require 'open-uri'

  BRAND_GREEN = '2E8B57'
  BRAND_ORANGE = 'FF8C00'

  def self.generate_certificate(club_investment)
    return false unless club_investment.is_a?(ClubInvestment) && club_investment.successful?

    begin
      Rails.logger.info "=== CLUB CERTIFICATE GENERATION STARTED ==="
      Rails.logger.info "Club Investment ID: #{club_investment.id}"
      Rails.logger.info "Club: #{club_investment.investment_club.name}"

      # Get signatures with safe fallbacks
      club_signature_url = get_club_signature_url(club_investment)
      issuer_signature_url = get_issuer_signature_url(club_investment)
      
      Rails.logger.info "Club signature URL: #{club_signature_url}"
      Rails.logger.info "Issuer signature URL: #{issuer_signature_url}"

      pdf = Prawn::Document.new(
        page_size: 'A4',
        page_layout: :portrait,
        margin: [30, 40, 30, 40],
        info: {
          Title: 'Club Investment Certificate',
          Creator: 'Bantuhive',
          CreationDate: Time.now
        }
      )

      # Add background and watermark
      add_background_image(pdf)
      add_watermark(pdf)

      # Header
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor + 3
      end
      pdf.move_down 10

      pdf.fill_color BRAND_GREEN
      pdf.text 'BANTUHIVE CLUB INVESTMENT CERTIFICATE', size: 20, align: :center, style: :bold
      pdf.move_down 3
      
      pdf.fill_color '444444'
      pdf.text '---------- ENDORSED & APPROVED BY THE SECURITIES & EXCHANGE COMMISSION • GHANA ---------', 
               size: 8, align: :center, style: :bold
      pdf.move_down 3
      
      pdf.fill_color BRAND_ORANGE
      pdf.text 'OFFICIAL CERTIFICATE OF CLUB OWNERSHIP', size: 11, align: :center, style: :italic
      pdf.move_down 12

      # Club details
      pdf.fill_color '000000'
      club = club_investment.investment_club
      campaign = club_investment.campaign
      
      # FIXED: Safe access to campaign data
      campaign_title = campaign&.title || 'Unknown Campaign'
      campaign_company = campaign&.company_name || 'Unknown Company'
      campaign_currency = campaign&.currency_symbol || '$'
      campaign_description = campaign&.company_description || 'No description available'
      campaign_headquarters = campaign&.company_headquarters || 'Not specified'
      campaign_website = campaign&.company_website || 'Not specified'
      campaign_valuation = campaign&.valuation&.to_f || 0
      campaign_equity_offered = campaign&.equity_offered&.to_f || 0
      
      pdf.text "This is to certify that the investment club", size: 12, align: :center
      pdf.move_down 4
      
      pdf.fill_color BRAND_GREEN
      pdf.text club.name.upcase, size: 14, align: :center, style: :bold
      pdf.move_down 4
      
      pdf.fill_color '000000'
      pdf.text "has successfully invested on behalf of its members", size: 12, align: :center
      pdf.move_down 4
      
      pdf.fill_color BRAND_ORANGE
      # FIXED: Safe rounding of investment amount
      investment_amount = club_investment.investment_amount.to_f.round(2)
      pdf.text "#{campaign_currency}#{investment_amount}", 
               size: 18, align: :center, style: :bold
      pdf.move_down 8
      
      pdf.fill_color '000000'
      pdf.text "in", size: 12, align: :center
      pdf.move_down 4
      
      pdf.fill_color BRAND_GREEN
      pdf.text campaign_company.to_s.upcase, size: 14, align: :center, style: :bold
      pdf.move_down 12

      # Company information
      pdf.fill_color '000000'
      pdf.text 'COMPANY INFORMATION', size: 13, align: :center, style: :bold
      pdf.move_down 8

      company_details = [
        ['Company:', campaign_company],
        ['Description:', campaign_description.to_s.truncate(80)],
        ['Headquarters:', campaign_headquarters],
        ['Website:', campaign_website],
        ['Valuation:', "#{campaign_currency} #{campaign_valuation.round(2)}"],
        ['Equity Offered:', "#{campaign_equity_offered.round(2)}%"]
      ]

      pdf.table(company_details, 
                width: pdf.bounds.width,
                cell_style: { borders: [], padding: [3, 6, 3, 0], size: 8 }
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 90, text_color: '000000')
        t.column(1).style(align: :left)
      end

      pdf.move_down 10

      # Club information
      pdf.text 'INVESTMENT CLUB INFORMATION', size: 13, align: :center, style: :bold
      pdf.move_down 8

      club_details = [
        ['Club Name:', club.name],
        ['Total Members:', club.current_members_count.to_s],
        ['Club Type:', club.club_type&.humanize || 'Not specified'],
        ['Investment Focus:', club.investment_focus || 'Diversified']
      ]

      pdf.table(club_details, 
                width: pdf.bounds.width,
                cell_style: { borders: [], padding: [3, 6, 3, 0], size: 8 }
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 90, text_color: '000000')
        t.column(1).style(align: :left)
      end

      pdf.move_down 12

      # Investment details
      pdf.fill_color '000000'
      pdf.text 'INVESTMENT DETAILS', size: 14, align: :center, style: :bold
      pdf.move_down 10

      # FIXED: Safe rounding of shares and percentage
      shares = club_investment.shares&.to_f&.round(4) || 0
      percentage = club_investment.percentage&.to_f&.round(4) || 0
      certificate_number = club_investment.certificate_number || "CLUB-#{club_investment.id}"

      details = [
        ['Certificate Number:', { content: certificate_number, color: BRAND_GREEN }],
        ['Date of Investment:', { content: club_investment.created_at.strftime('%B %d, %Y'), color: '000000' }],
        ['Shares Acquired:', { content: "#{shares} shares", color: '000000' }],
        ['Ownership Percentage:', { content: "#{percentage}%", color: BRAND_ORANGE }],
        ['Club Investment ID:', { content: club_investment.id.to_s, color: BRAND_GREEN }]
      ]

      pdf.table(details.map { |label, data| [label, data[:content]] }, 
                width: pdf.bounds.width,
                cell_style: { borders: [], padding: [4, 8, 4, 0], size: 8 }
               ) do |t|
        t.column(0).style(align: :right, font_style: :bold, width: 130, text_color: '000000')
        t.column(1).style(align: :left)
        
        details.each_with_index do |(_, data), i|
          t.cells[i, 1].text_color = data[:color]
          t.cells[i, 1].font_style = :bold if data[:color] != '000000'
        end
      end

      # Add signatures section
      add_club_signatures_section(pdf, club_signature_url, issuer_signature_url, club.name, campaign&.fundraiser&.full_name || 'Issuer')

      pdf.move_down 15

      # Official footer
      pdf.stroke do
        pdf.stroke_color BRAND_ORANGE
        pdf.line_width 1
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end
      pdf.move_down 10

      pdf.fill_color '000000'
      pdf.text "This certificate represents legal ownership stake held by #{club.name} in #{campaign_company}", 
               size: 8, align: :center
      pdf.text "as per the terms outlined in the investment agreement and governed by the laws of the jurisdiction.", 
               size: 8, align: :center
      pdf.move_down 8

      pdf.fill_color BRAND_GREEN
      pdf.text "ISSUED BY BANTUHIVE LIMITED", size: 10, align: :center, style: :bold
      pdf.move_down 2
      pdf.fill_color BRAND_ORANGE
      pdf.text "on #{Time.current.strftime('%B %d, %Y')}", size: 8, align: :center, style: :italic

      pdf.move_down 12

      # Final decorative border
      pdf.stroke do
        pdf.stroke_color BRAND_GREEN
        pdf.line_width 2
        pdf.horizontal_line 0, pdf.bounds.width, at: pdf.cursor
      end

      # Footer
      pdf.move_down 10
      pdf.fill_color '666666'
      pdf.text "Bantuhive Limited • Registered Investment Platform • www.bantuhive.com", 
               size: 6, align: :center

      # Create temp file and attach
      temp_file = Tempfile.new(["club_certificate_#{certificate_number}", ".pdf"], binmode: true)
      pdf.render_file(temp_file.path)
      
      temp_file.close
      temp_file.open if temp_file.closed?
      
      unless File.exist?(temp_file.path) && File.size(temp_file.path) > 0
        raise "Failed to generate PDF file"
      end

      club_investment.certificate.attach(
        io: File.open(temp_file.path),
        filename: "club_investment_certificate_#{certificate_number}.pdf",
        content_type: 'application/pdf',
        identify: false
      )

      unless club_investment.certificate.attached?
        raise "Failed to attach certificate"
      end

      club_investment.save! if club_investment.changed?

      Rails.logger.info "Successfully generated and attached certificate for club investment #{club_investment.id}"
      true
    rescue => e
      Rails.logger.error "Club certificate generation failed: #{e.message}\n#{e.backtrace.join("\n")}"
      false
    ensure
      temp_file.close! if temp_file && !temp_file.closed?
      temp_file.unlink if temp_file
    end
  end

  def self.add_club_signatures_section(pdf, club_sig_url, issuer_sig_url, club_name, issuer_name)
    pdf.move_down 15
    
    signature_base_y = pdf.cursor
    
    signature_data = [
      ["CLUB REPRESENTATIVE SIGNATURE", "ISSUER SIGNATURE"],
      ["", ""],
      [club_name, issuer_name],
      ["_________________________", "_________________________"]
    ]

    pdf.table(signature_data, 
              width: pdf.bounds.width,
              cell_style: { 
                borders: [], 
                padding: [1, 0, 1, 0],
                align: :center
              }
            ) do |t|
      t.column(0).width = pdf.bounds.width / 2
      t.column(1).width = pdf.bounds.width / 2
      
      t.row(0).font_style = :bold
      t.row(0).size = 8
      
      t.row(2).font_style = :italic
      t.row(2).size = 7
      t.row(2).padding = [12, 0, 4, 0]
      
      t.row(3).size = 6
      
      t.row(1).height = 40
    end

    signature_image_y = signature_base_y - 20

    # Add club signature
    if club_sig_url.present?
      begin
        Rails.logger.info "Loading club signature from: #{club_sig_url}"
        signature_image = URI.open(club_sig_url)
        pdf.image signature_image, 
                  width: 80,
                  height: 30,
                  at: [pdf.bounds.width / 4 - 40, signature_image_y]
        Rails.logger.info "Club signature added successfully"
      rescue => e
        Rails.logger.warn "Could not load club signature: #{e.message}"
      end
    end

    # Add issuer signature
    if issuer_sig_url.present?
      begin
        Rails.logger.info "Loading issuer signature from: #{issuer_sig_url}"
        signature_image = URI.open(issuer_sig_url)
        pdf.image signature_image, 
                  width: 80,
                  height: 30,
                  at: [pdf.bounds.width * 3 / 4 - 40, signature_image_y]
        Rails.logger.info "Issuer signature added successfully"
      rescue => e
        Rails.logger.warn "Could not load issuer signature: #{e.message}"
      end
    end

    pdf.move_down 30
  end

  # FIXED: Safe signature URL methods
  def self.get_club_signature_url(club_investment)
    club = club_investment.investment_club
    return nil unless club
    
    # Try to get club president's signature
    club_president = club.admin_members.first
    return nil unless club_president
    
    kyc = club_president.latest_kyc
    return nil unless kyc
    
    kyc.signature_image_url
  rescue => e
    Rails.logger.warn "Could not get club signature: #{e.message}"
    nil
  end

  def self.get_issuer_signature_url(club_investment)
    campaign = club_investment.campaign
    return nil unless campaign
    
    issuer = campaign.fundraiser
    return nil unless issuer
    
    kyc = issuer.latest_kyc
    return nil unless kyc
    
    kyc.signature_image_url
  rescue => e
    Rails.logger.warn "Could not get issuer signature: #{e.message}"
    nil
  end

  class << self
    private

    def add_background_image(pdf)
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

    def add_watermark(pdf)
      pdf.transparent(0.03) do
        pdf.fill_color 'DDDDDD'
        
        pdf.text_box "BANTUHIVE CLUB",
                     at: [pdf.bounds.width / 2 - 60, pdf.bounds.height / 2],
                     size: 40,
                     style: :bold,
                     width: 120,
                     height: 60,
                     align: :center,
                     valign: :center
      end
      pdf.fill_color '000000'
    end
  end
end