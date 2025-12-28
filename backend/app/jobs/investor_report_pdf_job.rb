# app/jobs/investor_report_pdf_job.rb
class InvestorReportPdfJob < ApplicationJob
  queue_as :default
  
  def perform(report_id)
    report = InvestorReport.find(report_id)
    
    # Generate PDF
    generator = InvestorReporting::DocumentGenerator.new
    pdf = generator.generate_investor_report_pdf(report)
    
    # Save PDF to ActiveStorage
    temp_file = Tempfile.new(["investor_report_#{report.id}", ".pdf"], binmode: true)
    pdf.render_file(temp_file.path)
    temp_file.close
    
    # Create document record
    document = report.documents.create!(
      document_type: 'full_report',
      title: "#{report.title} - Full Report",
      description: "PDF version of the investor report",
      file_format: 'pdf',
      is_public: false
    )
    
    document.file.attach(
      io: File.open(temp_file.path),
      filename: "investor_report_#{report.id}_#{Time.current.to_i}.pdf",
      content_type: 'application/pdf'
    )
    
    # Also generate executive summary
    generate_executive_summary(report, pdf)
    
  ensure
    temp_file&.unlink
  end
  
  private
  
  def generate_executive_summary(report, full_pdf)
    # Extract first few pages for executive summary
    # This is a simplified version - you might want to generate a separate PDF
    executive_pdf = Prawn::Document.new(
      page_size: 'A4',
      page_layout: :portrait,
      margin: [50, 50, 50, 50]
    )
    
    executive_pdf.text "Executive Summary", size: 20, style: :bold, align: :center
    executive_pdf.move_down 20
    
    if report.executive_summary.present?
      executive_pdf.text report.executive_summary, size: 12
    end
    
    if report.key_highlights.present?
      executive_pdf.move_down 20
      executive_pdf.text "Key Highlights", size: 16, style: :bold
      executive_pdf.move_down 10
      executive_pdf.text report.key_highlights, size: 11
    end
    
    # Save executive summary
    temp_file = Tempfile.new(["executive_summary_#{report.id}", ".pdf"], binmode: true)
    executive_pdf.render_file(temp_file.path)
    temp_file.close
    
    report.documents.create!(
      document_type: 'executive_summary',
      title: "#{report.title} - Executive Summary",
      description: "Executive summary of the investor report",
      file_format: 'pdf',
      is_public: true
    ).file.attach(
      io: File.open(temp_file.path),
      filename: "executive_summary_#{report.id}_#{Time.current.to_i}.pdf",
      content_type: 'application/pdf'
    )
    
  ensure
    temp_file&.unlink
  end
end