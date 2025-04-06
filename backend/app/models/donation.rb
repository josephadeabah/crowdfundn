class Donation < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  belongs_to :reward, optional: true
  belongs_to :partner_referral, optional: true
  has_many :points, dependent: :destroy
  has_many :pledges, dependent: :destroy

  after_create :track_partner_referral
  validates :transaction_reference, presence: true
  validates :email, presence: true # Email is required

  # Define the `successful` scope
  scope :successful, -> { where(status: 'successful') }

  # Define the `successful?` method for individual donation check
  def successful?
    status == 'successful'
  end

  # Callback to update fundraiser leaderboard when a donation becomes successful
  after_update :update_campaign_leaderboard, if: :saved_change_to_status?

  private

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard if successful?
  end

  def track_partner_referral
    return unless metadata&.dig('partner_token').present?
    
    partner = Partner.find_by(referral_token: metadata['partner_token'])
    return unless partner
    
    campaign.partner_referrals.create(
      partner: partner,
      donation: self,
      commission_amount: amount * campaign.partner_commission_rate / 100,
      status: 'confirmed'
    )
  end
end
