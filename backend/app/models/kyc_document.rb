# app/models/kyc_document.rb
class KycDocument < ApplicationRecord
  belongs_to :kyc
  belongs_to :verified_by, class_name: '::User', optional: true

  enum :verification_status, {
    pending: 'pending',
    verified: 'verified',
    rejected: 'rejected'
  }, default: 'pending'

  has_one_attached :file

  validates :document_type, presence: true
  validates :document_type, uniqueness: { scope: :kyc_id }

  before_save :set_file_name
  after_commit :process_file_upload, on: [:create, :update]

  DOCUMENT_TYPES = %w[
    id_front
    id_back
    proof_of_address
    selfie_with_id
    business_registration
    tax_clearance
    financial_statements
  ].freeze

  def file_url
    return unless file.attached?
    
    # Check if file exists in storage
    return unless file_exists?
    
    if Rails.env.production?
      # Generate DigitalOcean Spaces URL
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/" \
      "#{Rails.application.credentials.dig(:digitalocean, :bucket)}/" \
      "#{file.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(file, only_path: false)
    end
  rescue => e
    Rails.logger.error "Failed to generate file URL for KycDocument #{id}: #{e.message}"
    nil
  end

  def file_name
    file.attached? ? file.filename.to_s : read_attribute(:file_name)
  end

  def file_exists?
    return false unless file.attached?
    return false unless file.blob.present?
    
    # Check if file exists in storage
    file.blob.service.exist?(file.blob.key)
  rescue => e
    Rails.logger.error "Failed to check file existence for KycDocument #{id}: #{e.message}"
    false
  end

  def to_frontend_format
    {
      id: id,
      document_type: document_type,
      file_name: file_name,
      file_url: file_url,
      verification_status: verification_status,
      rejection_reason: rejection_reason,
      verified_at: verified_at,
      verified_by: verified_by&.full_name,
      created_at: created_at,
      updated_at: updated_at
    }
  end

  private

  def set_file_name
    self.file_name = file.filename.to_s if file.attached?
  end

  def process_file_upload
    return unless file.attached?
    return if file_exists?

    # Ensure the file gets processed and stored properly
    file.blob.analyze if file.blob.analyzed?
  end
end