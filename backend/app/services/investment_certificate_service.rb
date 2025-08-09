class InvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'
  require 'open-uri'

  def self.generate_certificate(investment)
    return nil unless investment.is_a?(EquityInvestment) && investment.successful?

    begin
      pdf = initialize_pdf
      campaign = investment.campaign
      kyc = investment.user.latest_kyc

      add_certificate_header(pdf)
      add_investor_details(pdf, investment, campaign)
      add_investment_details(pdf, investment, campaign)
      add_signatures(pdf, kyc) if kyc&.verified?
      add_footer(pdf, campaign)

      attach_certificate(pdf, investment)
    rescue => e
      Rails.logger.error "Certificate generation failed: #{e.message}"
      nil
    end
  end

  private

  def self.initialize_pdf
    Prawn::Document.new(
      page_size: 'A4',
      page_layout: :portrait,
      margin: [1.inch, 1.inch, 1.inch, 1.inch],
      info: {
        Title: 'Investment Certificate',
        Creator: 'Bantuhive',
        CreationDate: Time.now
      }
    )
  end

  def self.add_certificate_header(pdf)
    pdf.text 'BANTUHIVE INVESTMENT CERTIFICATE',
             size: 24, align: :center, style: :bold
    pdf.move_down 30
    pdf.stroke_horizontal_rule
    pdf.move_down 30
  end

  def self.add_investor_details(pdf, investment, campaign)
    pdf.text "This certifies that #{sanitize_text(investment.user.full_name)}",
             size: 16, align: :center
    pdf.text "has invested #{campaign.currency_symbol}#{investment.amount.round(2)}",
             size: 24, align: :center, style: :bold
    pdf.move_down 20
    pdf.text "in #{sanitize_text(campaign.company_name)}",
             size: 16, align: :center
    pdf.move_down 30
    pdf.stroke_horizontal_rule
    pdf.move_down 30
  end

  def self.add_investment_details(pdf, investment, campaign)
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
  end

  def self.add_signatures(pdf, investment)
    kyc = investment.user.latest_kyc
    
    if kyc&.verified? && kyc.signature_image.attached?
      pdf.bounding_box([0, pdf.cursor], width: pdf.bounds.width) do
        # Investor signature
        pdf.bounding_box([0, pdf.cursor], width: pdf.bounds.width / 2 - 20) do
          pdf.text "Investor Signature:", size: 10, style: :bold
          pdf.move_down 5
          pdf.image open(kyc.signature_image.url), width: 120
        end

        # Issuer signature (if available)
        if kyc.issuer_signature.attached?
          pdf.bounding_box([pdf.bounds.width / 2 + 20, pdf.cursor], width: pdf.bounds.width / 2 - 20) do
            pdf.text "Authorized Signatory:", size: 10, style: :bold
            pdf.move_down 5
            pdf.image open(kyc.issuer_signature.url), width: 120
          end
        end
      end

      pdf.move_down 20
      pdf.stroke_horizontal_rule
    end
  end

  def self.add_footer(pdf, campaign)
    pdf.move_down 20
    pdf.text "This certificate represents a legal ownership stake in #{sanitize_text(campaign.company_name)}",
             size: 12, align: :center
    pdf.text 'as per the terms outlined in the investment agreement.',
             size: 12, align: :center
    pdf.move_down 20
    pdf.text "Issued by Bantuhive on #{Time.current.strftime('%B %d, %Y')}",
             size: 12, align: :center
  end

  def self.attach_certificate(pdf, investment)
    filename = "investment_certificate_#{investment.certificate_number}.pdf"
    
    Tempfile.create(filename, binmode: true) do |temp_file|
      pdf.render_file(temp_file.path)
      temp_file.rewind

      investment.certificate.attach(
        io: temp_file,
        filename: filename,
        content_type: 'application/pdf'
      )

      investment.certificate.attached?
    end
  end

  def self.sanitize_text(text)
    ActionController::Base.helpers.sanitize(text.to_s, tags: []).strip
  end
end