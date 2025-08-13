class Donation < ApplicationRecord
  belongs_to :campaign 
  belongs_to :user, optional: true
  belongs_to :reward, optional: true
  has_many :points, dependent: :destroy
  has_many :pledges, dependent: :destroy
  has_one_attached :certificate

  validates :email, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  
  validates :transaction_reference, uniqueness: {
    scope: :type,
    message: "has already been taken for this donation type"
  }, allow_nil: true

  validates :status, inclusion: { 
    in: %w[pending initialized successful failed abandoned canceled refunded] 
  }, allow_nil: false

  # STI Configuration
  def self.inheritance_column
    'type'
  end

  def self.descendants
    [EquityInvestment]
  end

  scope :successful, -> { where(status: 'successful') }
  scope :donations, -> { where(type: nil) }
  scope :investments, -> { where(type: 'EquityInvestment') }

  def successful?
    status == 'successful'
  end

  def current_value
    amount
  end

  def total_returns
    0
  end

  def roi
    0
  end

  def certificate_url
    return unless certificate.attached?
    Rails.application.routes.url_helpers.url_for(certificate)
  end

  def certificate_present?
    certificate.attached? && certificate.blob.present?
  end

  after_update :update_campaign_leaderboard, if: :saved_change_to_status?

  private

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard if successful?
  end
end