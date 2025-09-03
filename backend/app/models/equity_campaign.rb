class EquityCampaign < Campaign
  has_many :equity_investments, foreign_key: 'campaign_id', dependent: :destroy
  has_many :investors, through: :equity_investments, source: :user
  has_many :campaign_team_members, foreign_key: 'campaign_id', dependent: :destroy
  has_many :founders, -> { where(campaign_team_members: { role: 'founder' }) },
           through: :campaign_team_members, source: :user

  before_validation :set_default_total_shares, unless: :total_shares?
  after_update :update_investments_valuation, if: -> { saved_change_to_valuation? || saved_change_to_total_shares? }
  before_validation :calculate_shares_available, if: -> { new_record? || will_save_change_to_equity_offered? || will_save_change_to_total_shares? }
  after_save :update_shares_available_from_investments, if: -> { saved_change_to_shares_available? }

  validates :valuation, :equity_offered, :minimum_investment, :maximum_investment,
            presence: true, numericality: { greater_than: 0 }
  validates :total_shares, numericality: { greater_than: 0, message: "must be set based on valuation" }, unless: -> { valuation.blank? }
  validates :equity_offered, numericality: { less_than_or_equal_to: 100 }
  validate :equity_issued_within_limits
  validate :founders_equity_allocation
  validate :maximum_greater_than_minimum
  validate :type_cannot_change, on: :update
  validate :shares_within_equity_limits
  validate :total_shares_must_be_set
  validate :reasonable_share_structure
  validate :founder_equity_within_bounds

  attribute :company_name, :string
  attribute :company_description, :text
  attribute :company_headquarters, :string
  attribute :company_website, :string
  attribute :contract_term, :string
  attribute :equity_status, :integer, default: 0

  enum :equity_status, {
    draft: 0,
    pending_approval: 1,
    approved: 2,
    live: 3,
    funded: 4,
    failed: 5,
    closed: 6
  }
  
  def total_shares_must_be_set
    if (new_record? || will_save_change_to_total_shares?) && total_shares.to_i <= 0
      errors.add(:total_shares, "must be set and greater than 0")
    end
  end

  def total_shares
    self[:total_shares] || calculate_default_shares
  end

  def update_all_investment_values
    equity_investments.successful.each do |investment|
      InvestmentUpdateJob.perform_later(investment.id)
    end
  end
    
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
    
    # Basic validations
    errors << "Title is required" if title.blank?
    errors << "Description is required" if description.blank?
    errors << "Valuation is required" if valuation.blank?
    errors << "Equity offered is required" if equity_offered.blank?
    errors << "Minimum investment is required" if minimum_investment.blank?
    errors << "Maximum investment is required" if maximum_investment.blank?
    errors << "Company name is required" if company_name.blank?
    errors << "Company description is required" if company_description.blank?
    errors << "At least one founder is required" unless campaign_team_members.exists?(role: 'founder')
    
    # Ensure founder equity + public equity = 100%
    total_equity = founder_equity_percentage + equity_offered.to_f
    if (total_equity - 100.0).abs > 0.01
      errors << "Founder equity (#{founder_equity_percentage}%) + public offering (#{equity_offered}%) must equal 100%"
    end
    
    errors.empty?
  end
  
  def shares_available
    if persisted? && !will_save_change_to_shares_available?
      self[:shares_available] || 0
    else
      calculate_shares_available_value
    end
  end
  
  def shares_available=(value)
    self[:shares_available] = value
  end

  def shares_issued
    equity_investments.successful.sum(:shares)
  end

  def total_equity_invested
    equity_investments.successful.sum(:amount)
  end

  def total_investors
    authenticated_investors = equity_investments.successful.where.not(user_id: nil).distinct.count(:user_id)
    anonymous_investors = equity_investments.successful.where(user_id: nil).count
    authenticated_investors + anonymous_investors
  end

  # In your EquityCampaign model
  def create_investment(user, amount)
    Rails.logger.info "Creating investment: user_id=#{user&.id}, amount=#{amount}, campaign_id=#{id}"
    
    ActiveRecord::Base.transaction do
      campaign = EquityCampaign.lock.find(id)
      Rails.logger.info "Campaign locked: #{campaign.attributes}"
      
      price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
      shares = (amount / price_per_share).round(4)
      percentage = ((amount / (campaign.valuation.to_f * campaign.equity_offered.to_f / 100)) * 100).round(4)
      
      Rails.logger.info "Calculated: price_per_share=#{price_per_share}, shares=#{shares}, percentage=#{percentage}"
      Rails.logger.info "Campaign limits: shares_available=#{campaign.shares_available}, percentage_available=#{campaign.percentage_available}"
      
      # Double-check equity limits
      if shares > campaign.shares_available
        error_msg = "Not enough shares available for this investment (requested: #{shares}, available: #{campaign.shares_available})"
        Rails.logger.error error_msg
        campaign.errors.add(:base, error_msg)
        return nil
      end
      
      if percentage > campaign.percentage_available
        error_msg = "Not enough equity percentage available for this investment (requested: #{percentage}%, available: #{campaign.percentage_available}%)"
        Rails.logger.error error_msg
        campaign.errors.add(:base, error_msg)
        return nil
      end
      
      investment = campaign.equity_investments.create(
        user: user,
        amount: amount,
        shares: shares,
        percentage: percentage,
        status: EquityInvestment::STATUS_PENDING,
      )
      
      Rails.logger.info "Investment created: #{investment.persisted?}, errors: #{investment.errors.full_messages}"
      
      if investment.persisted?
        campaign.update!(shares_available: campaign.shares_available - shares)
        Rails.logger.info "Campaign shares updated: #{campaign.shares_available}"
      else
        # Add investment errors to campaign errors
        investment.errors.full_messages.each do |message|
          campaign.errors.add(:base, message)
        end
        Rails.logger.error "Investment validation failed: #{investment.errors.full_messages}"
      end
      
      investment
    end
  rescue ActiveRecord::RecordNotFound => e
    error_msg = "Campaign not found: #{e.message}"
    Rails.logger.error error_msg
    errors.add(:base, error_msg)
    nil
  rescue ActiveRecord::StaleObjectError => e
    error_msg = "Campaign was modified by another process. Please try again."
    Rails.logger.error error_msg
    errors.add(:base, error_msg)
    nil
  rescue StandardError => e
    error_msg = "Unexpected error: #{e.message}"
    Rails.logger.error "#{error_msg}\n#{e.backtrace.join("\n")}"
    errors.add(:base, error_msg)
    nil
  end

  def percentage_available
    equity_offered.to_f - equity_investments.successful.sum(:percentage)
  end

  def percentage_raised
    (equity_investments.successful.sum(:percentage) / equity_offered.to_f) * 100
  end

  def founder_equity_percentage
    campaign_team_members.sum(:equity_percentage).to_f
  end

  def reasonable_share_structure
    if total_shares > 1_000_000_000
      errors.add(:total_shares, "exceeds reasonable limit for company structure")
    end
    
    if valuation.to_f / total_shares.to_f < 0.0001
      errors.add(:total_shares, "would create unreasonably low share price")
    end
  end
  
  def founder_equity_within_bounds
    if founder_equity_percentage > 80
      errors.add(:base, "Founder equity allocation is too high for a credible offering")
    end
    
    if equity_offered.to_f < 5
      errors.add(:equity_offered, "is too low for a meaningful investment opportunity")
    end
  end
  
  def investment_ready?
    # Only check basics - no consistency validation needed
    valid? && live? && shares_available > 0
  end

  def as_json(options = {})
    super.merge(
      type: 'EquityCampaign',
      total_investors: total_investors,
      company_info: {
        name: company_name,
        description: company_description,
        headquarters: company_headquarters,
        website: company_website,
        contract_term: contract_term
      },
      shares_available: shares_available,
      shares_issued: shares_issued,
      total_equity_shares: total_shares,
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

  def calculate_shares_available
    self.shares_available = calculate_shares_available_value
  end
  
  def calculate_shares_available_value
    return 0 if equity_offered.nil? || valuation.nil? || total_shares.nil?
    
    # Total shares available for public offering ONLY
    total_equity_shares = (equity_offered.to_f / 100) * total_shares.to_f
    
    # Subtract already issued shares from public offering
    available = total_equity_shares - shares_issued
    
    available.positive? ? available.round(4) : 0
  end
  
  def update_shares_available_from_investments
    actual_shares_available = calculate_shares_available_value
    if self[:shares_available] != actual_shares_available
      update_column(:shares_available, actual_shares_available)
    end
  end
  
  def calculate_percentage(amount)
    total_equity_value = (valuation.to_f * equity_offered.to_f / 100)
    ((amount / total_equity_value) * 100).round(4)
  end

  def calculate_default_shares
    (valuation.to_f * 10).round(0) if valuation.present?
  end

  def set_default_total_shares
    return if total_shares.present? || valuation.blank?
    self.total_shares = calculate_default_shares
  end

  # REMOVE founder-related calculations from availability
  def calculate_founder_shares
    # Founder shares are pre-allocated and don't affect public offering
    0
  end

  def equity_issued_within_limits
    issued_percentage = equity_investments.successful.sum(:percentage)
    return unless issued_percentage > equity_offered.to_f
    errors.add(:base, 'Total equity issued cannot exceed equity offered')
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
  
  def equity_debug_info
    price_per_share = valuation.to_f / total_shares.to_f
    
    {
      valuation: valuation,
      total_shares: total_shares,
      equity_offered: equity_offered,
      shares_available: shares_available,
      percentage_available: percentage_available,
      shares_issued: shares_issued,
      founder_equity_percentage: founder_equity_percentage,
      price_per_share: price_per_share,
      max_investment_by_shares: (shares_available * price_per_share).round(2),
      max_investment_by_percentage: ((percentage_available / 100) * (valuation * equity_offered / 100)).round(2),
      consistency_check: (shares_available - (percentage_available / 100) * total_shares).abs < 0.01
    }
  end
end