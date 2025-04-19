class EquityCampaign < Campaign
  has_many :equity_investments, foreign_key: 'campaign_id', dependent: :destroy
  has_many :investors, through: :equity_investments, source: :user
  has_many :campaign_team_members, foreign_key: 'campaign_id', dependent: :destroy
  has_many :founders, -> { where(campaign_team_members: { role: 'founder' }) }, 
           through: :campaign_team_members, source: :user
  
  validates :valuation, :equity_offered, :minimum_investment, :maximum_investment, 
            presence: true, numericality: { greater_than: 0 }
  validates :equity_offered, numericality: { less_than_or_equal_to: 100 }
  validate :founders_equity_allocation
  validate :maximum_greater_than_minimum

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
    return 0 if equity_offered.nil? || valuation.nil? || equity_offered <= 0 || valuation <= 0
    (equity_offered.to_f * valuation.to_f / 100) - equity_investments.sum(:amount)
  end

  def percentage_raised
    return 0 if equity_offered.nil? || valuation.nil? || equity_offered <= 0 || valuation <= 0
    (equity_investments.sum(:amount) / (equity_offered.to_f * valuation.to_f / 100)) * 100
  end
  
  def founder_equity_percentage
    campaign_team_members.sum(:equity_percentage).to_f
  end

  def as_json(options = {})
  super(options).merge(
    type: 'EquityCampaign',
    company_info: {
      name: company_name,
      description: company_description,
      headquarters: company_headquarters,
      website: company_website,
      contract_term: contract_term,
    },
    shares_available: shares_available,
    percentage_raised: percentage_raised,
    equity_status: equity_status,
    maximum_investment: maximum_investment,
    team_members: campaign_team_members.includes(:user).map do |member|
      {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        title: member.title,
        equity_percentage: member.equity_percentage,
        description: member.description,
        avatar_url: member.avatar_url,
        user: member.user ? {
          id: member.user.id,
          email: member.user.email,
          profile: {
            first_name: member.user.profile&.first_name,
            last_name: member.user.profile&.last_name
          }
        } : nil
      }
    end
  )
end
  
  private
  
  def founders_equity_allocation
    if founder_equity_percentage > (100 - equity_offered.to_f)
      errors.add(:base, "Founders' combined equity cannot exceed #{100 - equity_offered.to_f}%")
    end
  end

  def maximum_greater_than_minimum
    if maximum_investment.present? && minimum_investment.present? && maximum_investment <= minimum_investment
      errors.add(:maximum_investment, "must be greater than minimum investment")
    end
  end
end