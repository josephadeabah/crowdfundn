class EquityCampaign < Campaign
  has_many :equity_investments, foreign_key: 'campaign_id', dependent: :destroy
  has_many :investors, through: :equity_investments, source: :user
  has_many :campaign_team_members, foreign_key: 'campaign_id', dependent: :destroy
  has_many :founders, -> { where(campaign_team_members: { role: 'founder' }) },
           through: :campaign_team_members, source: :user

  attribute :equity_status, :integer, default: 0
  attribute :total_shares, :integer, default: 1_000_000 # Default 1M shares
  attribute :shares_issued, :integer, default: 0
  attribute :equity_issued, :decimal, default: 0.0

  validates :valuation, :equity_offered, :minimum_investment, :maximum_investment,
            presence: true, numericality: { greater_than: 0 }
  validates :equity_offered, numericality: { less_than_or_equal_to: 100 }
  validate :equity_issued_within_limits
  validate :founders_equity_allocation
  validate :maximum_greater_than_minimum
  validate :type_cannot_change, on: :update
  validate :shares_within_equity_limits
  validates :total_shares, presence: true, numericality: { greater_than: 0 }


  enum :equity_status, {
    draft: 0,
    pending_approval: 1,
    approved: 2,
    live: 3,
    funded: 4,
    failed: 5,
    closed: 6
  }

  after_update :update_investments_valuation, if: :saved_change_to_valuation?

  # Add this method to update all investments when valuation changes
  def update_all_investment_values
    equity_investments.completed.each do |investment|
      InvestmentUpdateJob.perform_later(investment.id)
    end
  end
    
  # State transition methods with improved error handling
  def submit_for_approval
    return false unless may_submit_for_approval?
    
    unless valid_for_approval?
      errors.add(:base, "Cannot submit for approval: #{validation_errors_for_approval.join(', ')}")
      return false
    end
    
    update(equity_status: :pending_approval)
  end

  def approve
    if may_approve?
      update(equity_status: :approved)
    else
      errors.add(:base, "Cannot approve campaign that is not pending approval")
      false
    end
  end

  def reject
    if may_reject?
      update(equity_status: :draft)
    else
      errors.add(:base, "Cannot reject campaign that is not pending approval")
      false
    end
  end

  def launch
    if may_launch?
      update(equity_status: :live)
    else
      errors.add(:base, "Cannot launch campaign that is not approved")
      false
    end
  end

  def close
    if may_close?
      update(equity_status: :closed)
    else
      errors.add(:base, "Cannot close campaign that is not live or funded")
      false
    end
  end

  # State predicate methods
  def may_submit_for_approval?
    draft? && valid_for_approval?
  end

  def may_approve?
    pending_approval?
  end

  def may_reject?
    pending_approval?
  end

  def may_launch?
    approved?
  end

  def may_close?
    live? || funded?
  end

  def valid_for_approval?
    validation_errors_for_approval.empty?
  end
  
  def validation_errors_for_approval
    errors = []
    
    errors << "Title is required" if title.blank?
    errors << "Description is required" if description.blank?
    errors << "Valuation is required" if valuation.blank?
    errors << "Equity offered is required" if equity_offered.blank?
    errors << "Minimum investment is required" if minimum_investment.blank?
    errors << "Maximum investment is required" if maximum_investment.blank?
    errors << "Company name is required" if company_name.blank?
    errors << "Company description is required" if company_description.blank?
    errors << "At least one founder is required" unless campaign_team_members.exists?(role: 'founder')
    
    errors
  end
  
  # This method is used to determine the number of shares in money available for investment.
  def shares_available
    return 0 if equity_offered.nil? || valuation.nil? || equity_offered <= 0 || valuation <= 0
    (equity_offered.to_f * valuation.to_f / 100) - equity_investments.sum(:amount)
  end

  def update_shares_available
    update_columns(
      shares_issued: equity_investments.sum(:shares),
      equity_issued: equity_investments.sum(:percentage)
    )
  end

  # Update this method for accurate share calculation
  def create_investment(user, amount)
    return unless amount >= minimum_investment && amount <= maximum_investment

    # Calculate percentage first
    total_equity_value = (valuation.to_f * equity_offered.to_f / 100)
    percentage = ((amount / total_equity_value) * 100).round(8)
    
    # Then calculate shares based on percentage
    total_available_shares = (equity_offered.to_f / 100) * total_shares.to_f
    shares = (percentage / 100 * total_available_shares).round(4)

    equity_investments.create(
      user: user,
      amount: amount,
      shares: shares,
      percentage: percentage,
      status: :pending
    ).tap do |investment|
      update_shares_available if investment.persisted?
    end
  end

  def shares_available
    return 0 if equity_offered.nil? || valuation.nil? || total_shares.nil?

    total_equity_shares = (equity_offered.to_f / 100) * total_shares.to_f
    remaining_shares = total_equity_shares - shares_issued.to_f
    remaining_shares.positive? ? remaining_shares : 0
  end

  def update_shares_available
    update_columns(
      shares_issued: equity_investments.sum(:shares),
      equity_issued: equity_investments.sum(:percentage)
    )
  end

    # Add this validation
  def validate_shares_available(investment_amount)
    return true if shares_available > 0
    
    estimated_shares = (investment_amount / (valuation.to_f / total_shares.to_f)).round(4)
    if estimated_shares > shares_available
      errors.add(:base, "Not enough shares available for this investment")
      false
    else
      true
    end
  end

  def price_per_share
  return 0 if valuation.nil? || total_shares.nil? || total_shares.zero?
  valuation.to_f / total_shares.to_f
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
    super.merge(
      type: 'EquityCampaign',
      company_info: {
        name: company_name,
        description: company_description,
        headquarters: company_headquarters,
        website: company_website,
        contract_term: contract_term
      },
      shares_available: shares_available,
      price_per_share: price_per_share,
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
          user: if member.user
                  {
                    id: member.user.id,
                    email: member.user.email,
                    profile: {
                      first_name: member.user.profile&.first_name,
                      last_name: member.user.profile&.last_name
                    }
                  }
                end
        }
      end
    )
  end

  private

  # Add this method in your private section with other validation methods
  def equity_issued_within_limits
    return unless equity_issued.to_f > equity_offered.to_f

    errors.add(:equity_issued, 'cannot exceed equity offered')
  end

  def update_investments_valuation
    UpdateCampaignInvestmentsJob.perform_later(id)
  end

  def shares_within_equity_limits
    return unless shares_issued > (equity_offered.to_f / 100) * total_shares.to_f

    errors.add(:base, 'Total shares issued cannot exceed equity offered')
  end

  def type_cannot_change
    return unless type_changed? && persisted?

    errors.add(:type, 'cannot be changed once created')
  end

  def founders_equity_allocation
    return unless founder_equity_percentage > (100 - equity_offered.to_f)

    errors.add(:base, "Founders' combined equity cannot exceed #{100 - equity_offered.to_f}%")
  end

  def maximum_greater_than_minimum
    return unless maximum_investment.present? && minimum_investment.present? && maximum_investment <= minimum_investment

    errors.add(:maximum_investment, 'must be greater than minimum investment')
  end
end
