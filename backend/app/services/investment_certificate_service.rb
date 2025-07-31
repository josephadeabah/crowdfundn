# app/services/investment_certificate_service.rb
class InvestmentCertificateService
  require 'prawn'
  require 'prawn/table'
  require 'prawn/measurement_extensions'

  def self.generate_certificate(investment)
    return nil unless investment.is_a?(EquityInvestment) && investment.success?

    begin
      pdf = initialize_pdf
      campaign = investment.campaign

      add_certificate_header(pdf)
      add_investor_details(pdf, investment, campaign)
      add_investment_details(pdf, investment, campaign)
      add_footer(pdf, campaign)

      attach_certificate(pdf, investment)
    rescue Prawn::Errors::CannotRender => e
      log_error('PDF generation failed', e, investment)
      nil
    rescue ActiveStorage::Error => e
      log_error('Certificate upload failed', e, investment)
      nil
    rescue StandardError => e
      log_error('Unexpected error', e, investment)
      nil
    end
  end

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
    ).tap do |pdf|
      pdf.canvas { pdf.stroke_bounds }
      pdf.move_down 20
    end
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

  def self.add_footer(pdf, campaign)
    pdf.stroke_horizontal_rule
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
    temp_file = Tempfile.new(filename, binmode: true)

    begin
      # Render PDF to temp file
      pdf.render_file(temp_file.path)
      temp_file.close

      # Attach to investment
      investment.certificate.attach(
        io: File.open(temp_file.path),
        filename: filename,
        content_type: 'application/pdf',
        identify: false
      )

      # Verify attachment
      if investment.certificate.attached?
        Rails.logger.info "Successfully attached certificate to investment #{investment.id}"
        investment.certificate
      else
        Rails.logger.error "Failed to attach certificate to investment #{investment.id}"
        nil
      end
    ensure
      temp_file.close unless temp_file.closed?
      temp_file.unlink
    end
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
