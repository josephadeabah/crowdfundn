class Donation < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  belongs_to :reward, optional: true
  
  validates :transaction_reference, presence: true
  validates :email, presence: true  # Email is required
  
  # Define the `successful` scope
  scope :successful, -> { where(status: 'successful') }

  # Define the `successful?` method for individual donation check
  def successful?
    status == 'successful'
  end

  # Callback to update fundraiser leaderboard when a donation is successful
  after_create :update_campaign_leaderboard, if: :successful?

  private

  def update_campaign_leaderboard
    campaign.update_fundraiser_leaderboard
  end
end
