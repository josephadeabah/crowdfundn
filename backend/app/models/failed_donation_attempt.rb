# app/models/failed_donation_attempt.rb
class FailedDonationAttempt < ApplicationRecord
  validates :transaction_reference, presence: true
  
  serialize :payload, JSON
  serialize :metadata, JSON
  serialize :error_messages, JSON

  STATUSES = %w[creation_failed processing_failed verification_failed].freeze
  validates :status, inclusion: { in: STATUSES }

  scope :recent, -> { where('created_at >= ?', 7.days.ago) }
  scope :requires_attention, -> { where(resolved: false) }

  def self.log_failure(transaction_reference, payload, metadata, error_messages, status)
    create!(
      transaction_reference: transaction_reference,
      payload: payload,
      metadata: metadata,
      error_messages: error_messages,
      status: status
    )
  end

  def mark_as_resolved!
    update!(resolved: true, resolved_at: Time.current)
  end

  def to_frontend_format
    {
      id: id,
      transaction_reference: transaction_reference,
      status: status,
      error_messages: error_messages,
      created_at: created_at,
      resolved: resolved,
      resolved_at: resolved_at,
      payload: payload,
      metadata: metadata
    }
  end
end