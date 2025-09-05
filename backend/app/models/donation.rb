# app/models/donation.rb
class Donation < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  belongs_to :reward, optional: true
  has_many :points, dependent: :destroy
  has_many :pledges, dependent: :destroy

  validates :transaction_reference, presence: true
  validates :email, presence: true

  # Define status constants like EquityInvestment
  STATUS_PENDING = 'pending'
  STATUS_INITIALIZED = 'initialized'
  STATUS_SUCCESSFUL = 'successful'
  STATUS_FAILED = 'failed'
  STATUS_ABANDONED = 'abandoned'
  STATUS_CANCELED = 'canceled'
  STATUS_REFUNDED = 'refunded'

  VALID_STATUSES = [
    STATUS_PENDING,
    STATUS_INITIALIZED,
    STATUS_SUCCESSFUL,
    STATUS_FAILED,
    STATUS_ABANDONED,
    STATUS_CANCELED,
    STATUS_REFUNDED
  ].freeze

  validates :status, inclusion: { in: VALID_STATUSES }

  scope :successful, -> { where(status: STATUS_SUCCESSFUL) }

  # Status query methods like EquityInvestment
  def pending?
    status == STATUS_PENDING
  end

  def initialized?
    status == STATUS_INITIALIZED
  end

  def successful?
    status == STATUS_SUCCESSFUL
  end

  def failed?
    status == STATUS_FAILED
  end

  def abandoned?
    status == STATUS_ABANDONED
  end

  def canceled?
    status == STATUS_CANCELED
  end

  def refunded?
    status == STATUS_REFUNDED
  end

  # Class methods like EquityInvestment
  def self.total_donated(campaign_id = nil)
    scope = successful
    scope = scope.where(campaign_id: campaign_id) if campaign_id
    scope.sum(:amount)
  end

  def self.total_donors(campaign_id = nil)
    scope = successful
    scope = scope.where(campaign_id: campaign_id) if campaign_id
    scope.distinct.count(:email) + scope.where(email: nil).count
  end

  # Callback to update fundraiser leaderboard when a donation becomes successful
  after_update :update_campaign_leaderboard, if: :saved_change_to_status?

  # New method to check if refund is needed (based on your conditions)
  def requires_refund?
    # Conditions for refund: failure or data save errors
    failed? || data_save_failed?
  end

  # Method to initiate refund
  def initiate_refund(reason = 'donation_failure')
    return unless requires_refund?

    begin
      PaystackWebhook::Handlers::DonationRefundHandler.new(
        donation: self,
        reason: reason
      ).call
    rescue => e
      Rails.logger.error "Failed to initiate refund for donation #{id}: #{e.message}"
      false
    end
  end

  private

  def data_save_failed?
    # Check if there were issues saving data to donations table
    # You can implement specific checks based on your application logic
    metadata&.dig('data_save_errors').present? || metadata&.dig('processing_errors').present?
  end

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard if successful?
  end
end