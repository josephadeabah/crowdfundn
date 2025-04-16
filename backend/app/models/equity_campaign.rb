# app/models/equity_campaign.rb
class EquityCampaign < Campaign
  has_many :equity_investments, dependent: :destroy
  has_many :investors, through: :equity_investments, source: :user
  has_many :campaign_team_members, dependent: :destroy
  has_many :founders, through: :campaign_team_members, source: :user
  
  validates :valuation, :equity_offered, :minimum_investment, presence: true
  validates :valuation, :minimum_investment, numericality: { greater_than: 0 }
  validates :equity_offered, numericality: { greater_than: 0, less_than_or_equal_to: 100 }
  validate :founders_equity_allocation

  attribute :equity_status, :integer, default: 0
  
  enum equity_status: {
    draft: 0,
    pending_approval: 1,
    live: 2,
    funded: 3,
    failed: 4,
    closed: 5
  }
  
  def shares_available
    (equity_offered * valuation / 100) - equity_investments.sum(:amount)
  end
  
  def percentage_raised
    equity_investments.sum(:amount) / (equity_offered * valuation / 100).to_f * 100
  end
  
  def founder_equity_percentage
    campaign_team_members.sum(:equity_percentage)
  end
  
  private
  
  def founders_equity_allocation
    if founder_equity_percentage > (100 - equity_offered)
      errors.add(:base, "Founders' combined equity cannot exceed #{100 - equity_offered}%")
    end
  end
end