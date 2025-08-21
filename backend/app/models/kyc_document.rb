# app/models/kyc_document.rb
class KycDocument < ApplicationRecord
  belongs_to :kyc
  belongs_to :verified_by, class_name: '::User', optional: true

  enum :verification_status, {
    pending: 'pending',
    verified: 'verified',
    rejected: 'rejected'
  }, default: 'pending'

  # ActiveStorage attachment
  has_one_attached :file

  validates :document_type, presence: true
  validates :document_type, uniqueness: { scope: :kyc_id }

  def file_url
    return unless file.attached?
    Rails.application.routes.url_helpers.url_for(file)
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
end