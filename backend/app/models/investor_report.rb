class InvestorReport < ApplicationRecord
  belongs_to :campaign
  belongs_to :published_by, class_name: 'User', optional: true
  
  has_many :documents, class_name: 'InvestorReportDocument', dependent: :destroy
  has_many_attached :attachments
  
  validates :report_type, :title, :report_date, presence: true
  validates :report_type, inclusion: { in: %w[monthly quarterly annual valuation_update special] }
  validates :status, inclusion: { in: %w[draft published archived] }
  
  validate :validate_period_dates, if: -> { period_start.present? && period_end.present? }
  
  before_create :set_initial_published_at, if: -> { status == 'published' && published_at.blank? }
  after_save :notify_investors_on_publish, if: -> { saved_change_to_status?(to: 'published') && notify_investors? }
  after_save :generate_pdf_report, if: -> { saved_change_to_status?(to: 'published') }
  
  scope :published, -> { where(status: 'published') }
  scope :recent, -> { order(report_date: :desc) }
  scope :by_type, ->(type) { where(report_type: type) }
  
  REPORT_TYPES = {
    monthly: 'Monthly Investor Update',
    quarterly: 'Quarterly Financial Report',
    annual: 'Annual Report',
    valuation_update: 'Valuation Update',
    special: 'Special Announcement'
  }.freeze

  def set_initial_published_at
    self.published_at = Time.current
  end
  
  def period_description
    if period_start.present? && period_end.present?
      "#{period_start.to_formatted_s(:short)} - #{period_end.to_formatted_s(:short)}"
    else
      "As of #{report_date.to_formatted_s(:long)}"
    end
  end
  
  def generate_pdf_report
    InvestorReportPdfJob.perform_later(id)
  end
  
  def notify_investors_on_publish
    InvestorReportNotificationJob.perform_later(id)
  end
  
  def increment_download_count!
    increment!(:download_count)
  end
  
  def attachments_urls
    attachments.map do |attachment|
      {
        filename: attachment.filename.to_s,
        url: rails_blob_url(attachment),
        content_type: attachment.content_type,
        file_size: attachment.byte_size
      }
    end
  end
  
  def as_json(options = {})
    super(options).merge(
      period_description: period_description,
      report_type_display: REPORT_TYPES[report_type.to_sym],
      attachments: attachments_urls,
      documents: documents.map(&:as_json),
      campaign_name: campaign.title,
      published_by_name: published_by&.full_name
    )
  end
  
  private
  
  def validate_period_dates
    if period_end <= period_start
      errors.add(:period_end, 'must be after period start')
    end
    
    if report_date < period_end
      errors.add(:report_date, 'must be after period end')
    end
  end
  
  def rails_blob_url(attachment)
    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{attachment.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(attachment)
    end
  end
end