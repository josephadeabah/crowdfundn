# app/models/donation.rb
class Donation < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  belongs_to :reward, optional: true
  has_many :points, dependent: :destroy
  has_many :pledges, dependent: :destroy

  validates :transaction_reference, presence: true
  validates :email, presence: true # Email is required

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

  # Define the `successful` scope
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

  private

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard if successful?
  end
end