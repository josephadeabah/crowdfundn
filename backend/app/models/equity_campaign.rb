class EquityCampaign < Campaign
  has_many :equity_investments, foreign_key: 'campaign_id', dependent: :destroy
  has_many :investors, through: :equity_investments, source: :user
  has_many :campaign_team_members, foreign_key: 'campaign_id', dependent: :destroy
  has_many :founders, -> { where(campaign_team_members: { role: 'founder' }) }, 
           through: :campaign_team_members, source: :user
  
  validates :valuation, :equity_offered, :minimum_investment, :maximum_investment, 
            presence: true, numericality: { greater_than: 0 }
  validates :equity_offered, numericality: { less_than_or_equal_to: 100 }
  validate :equity_issued_within_limits
  validate :founders_equity_allocation
  validate :maximum_greater_than_minimum
  validate :type_cannot_change, on: :update
  validate :shares_within_equity_limits

  attribute :equity_status, :integer, default: 0
  
  enum equity_status: {
    draft: 0,
    pending_approval: 1,
    live: 2,
    funded: 3,
    failed: 4,
    closed: 5
  }

  after_update :update_investments_valuation, if: :saved_change_to_valuation?

  # Add this method to update all investments when valuation changes
  def update_all_investment_values
    equity_investments.completed.each do |investment|
      InvestmentUpdateJob.perform_later(investment.id)
    end
  end
  
  def update_shares_available
    update_columns(
      shares_issued: equity_investments.sum(:shares),
      equity_issued: equity_investments.sum(:percentage)
    )
  end

  def create_investment(user, amount)
  price_per_share = valuation.to_f / total_shares.to_f
  shares = (amount / price_per_share).round(2)
  percentage = ((amount / (valuation.to_f * equity_offered.to_f / 100)) * 100).round(4)
  
  equity_investments.create(
    user: user,
    amount: amount,
    shares: shares,
    percentage: percentage,
    status: :pending  # Changed from :completed to :pending
  )
end

  def shares_available
    return 0 if equity_offered.nil? || valuation.nil? || total_shares.nil?
    
    total_equity_shares = (equity_offered.to_f / 100) * total_shares.to_f
    total_equity_shares - equity_investments.sum(:shares)
  end

  def percentage_available
    equity_offered.to_f - equity_investments.sum(:percentage)
  end

  def percentage_raised
    (equity_investments.sum(:percentage) / equity_offered.to_f) * 100
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

  # Add this method in your private section with other validation methods
  def equity_issued_within_limits
    if equity_issued.to_f > equity_offered.to_f
      errors.add(:equity_issued, "cannot exceed equity offered")
    end
  end

  def update_investments_valuation
    UpdateCampaignInvestmentsJob.perform_later(id)
  end

  def shares_within_equity_limits
    if shares_issued > (equity_offered.to_f / 100) * total_shares.to_f
      errors.add(:base, "Total shares issued cannot exceed equity offered")
    end
  end

  def type_cannot_change
    if type_changed? && persisted?
      errors.add(:type, "cannot be changed once created")
    end
  end
  
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