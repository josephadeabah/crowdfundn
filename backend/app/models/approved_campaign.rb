class ApprovedCampaign < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  belongs_to :club_investment, optional: true, dependent: :destroy

  
  validates :investment_club_id, uniqueness: { scope: :campaign_id }
  
  after_create :notify_members
  
  scope :for_club, ->(club) { where(investment_club: club) }
  
  def voting_stats
    club_investment.voting_stats
  end
  
  def approved_at
    created_at
  end
  
  private
  
  def notify_members
    # Notify club members about the newly approved campaign
    investment_club.active_members.each do |member|
      # You'll need to implement this email service method
      # ClubEmailService.send_campaign_approved_notification(
      #   user: member,
      #   campaign: campaign,
      #   club: investment_club,
      #   approved_campaign: self
      # )
    end
  end
end