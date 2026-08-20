# app/models/investor_report_document.rb
class InvestorReportDocument < ApplicationRecord
  belongs_to :investor_report
  
  validates :document_type, presence: true
  validates :document_type, inclusion: { in: %w[full_report executive_summary financials presentation] }
  validates :document_type, uniqueness: { scope: :investor_report_id }
  
  has_one_attached :file
  
  before_save :extract_file_metadata, if: -> { file.attached? && file_changed? }
  
  scope :publicly_accessible, -> { where(is_public: true) }
  
  def file_url
    if file.attached?
      if Rails.env.production?
        "#{ENV.fetch('SUPABASE_URL')}/storage/v1/object/public/#{ENV.fetch('SUPABASE_STORAGE_BUCKET')}/#{file.blob.key}"
      else
        Rails.application.routes.url_helpers.rails_blob_url(file)
      end
    end
  end
  
  def increment_download_count!
    increment!(:download_count)
  end
  
  def as_json(options = {})
    super(options).merge(
      file_url: file_url,
      file_name: file.attached? ? file.filename.to_s : nil,
      file_size: file.attached? ? ActiveSupport::NumberHelper.number_to_human_size(file.byte_size) : nil
    )
  end
  
  private
  
  def extract_file_metadata
    self.file_format = file.filename.extension.downcase if file.filename.present?
    self.file_size = file.byte_size if file.attached?
  end
  
  def file_changed?
    file.attached? && (file.attachment.created_at != updated_at)
  end
end