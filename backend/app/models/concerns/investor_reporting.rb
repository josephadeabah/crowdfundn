# app/models/concerns/investor_reporting.rb
module InvestorReporting
  extend ActiveSupport::Concern
  
  included do
    # Add any associations or validations if needed
  end
  
  def generate_quarterly_report(report_date = Date.current)
    # Determine quarter based on report_date
    quarter = ((report_date.month - 1) / 3) + 1
    year = report_date.year
    
    # Calculate period start and end for the quarter
    quarter_start_month = (quarter - 1) * 3 + 1
    period_start = Date.new(year, quarter_start_month, 1)
    period_end = period_start.end_of_quarter
    
    # Create a title for the report
    title = "Q#{quarter} #{year} Quarterly Report"
    
    # Check if a quarterly report already exists for this period
    existing_report = investor_reports.where(
      report_type: 'quarterly',
      report_date: report_date.beginning_of_quarter..report_date.end_of_quarter
    ).first
    
    if existing_report
      # Update existing report
      existing_report.update!(
        title: title,
        report_date: report_date,
        period_start: period_start,
        period_end: period_end
      )
      return existing_report
    else
      # Create new quarterly report
      investor_reports.create!(
        report_type: 'quarterly',
        title: title,
        report_date: report_date,
        period_start: period_start,
        period_end: period_end,
        status: 'draft',
        notify_investors: false,
        executive_summary: "Automatically generated quarterly report for Q#{quarter} #{year}.",
        key_highlights: "Quarterly financial performance review.",
        forward_outlook: "Continued growth and development in the coming quarter."
      )
    end
  end
end