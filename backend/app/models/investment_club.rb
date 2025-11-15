class InvestmentClub < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  has_many :investment_club_memberships, dependent: :destroy
  has_many :members, through: :investment_club_memberships, source: :user
  has_many :investment_club_contributions, dependent: :destroy
  has_many :club_investments, dependent: :destroy
  has_many :invested_campaigns, through: :club_investments, source: :campaign
  has_many :club_transactions, dependent: :destroy
  has_many :active_memberships, -> { active }, class_name: 'InvestmentClubMembership'
  has_many :active_members, through: :active_memberships, source: :user
  has_many :club_transfers, dependent: :destroy
  
  validates :name, :slug, presence: true
  validates :slug, uniqueness: true
  validates :minimum_monthly_contribution, numericality: { greater_than_or_equal_to: 0 }
  validates :max_members, numericality: { greater_than: 0 }
  validates :current_members_count, numericality: { greater_than_or_equal_to: 0 }

  attribute :constitution_data, :json, default: -> { {} }
  attribute :current_members_count, :integer, default: 0
  attribute :max_members, :integer, default: 50
  attribute :minimum_monthly_contribution, :decimal, default: 0.0
  attribute :currency, :string, default: 'GHS' # Add this line
  
  before_validation :generate_slug, if: -> { slug.blank? && name.present? }
  before_validation :map_club_type_to_access_type
  after_create :create_creator_membership
  after_initialize :set_default_members_count, if: :new_record?
  
  # FIXED: Remove the problematic callback and use a simpler approach
  after_save :update_members_count_if_needed
  
  enum access_type: { 
    open: 'open', 
    restricted: 'restricted', 
    certified: 'certified' 
  }, _prefix: true
  
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }

  # Add currency_symbol method
  def currency_symbol
    case currency&.upcase
    when 'USD' then '$'
    when 'EUR' then '€'
    when 'GBP' then '£'
    when 'NGN' then '₦'
    when 'GHS' then '₵'
    when 'KES' then 'KSh'
    else 'GHS' # Default to GHS
    end
  end

  # Override the club_type setter to map to access_type
  def club_type=(value)
    case value.to_s
    when 'public'
      self.access_type = 'open'
    when 'private'
      self.access_type = 'restricted'
    when 'verified'
      self.access_type = 'certified'
    else
      self.access_type = 'restricted' # default
    end
  end
  
  # Helper methods for clean access
  def public?
    access_type_open?
  end
  
  def private?
    access_type_restricted?
  end
  
  def verified?
    access_type_certified?
  end
  
  def club_type
    case access_type
    when 'open' then 'public'
    when 'restricted' then 'private' 
    when 'certified' then 'verified'
    else 'private' # default fallback
    end
  end
  
  # Financial methods - UPDATED: Remove references to executed investments
  def total_contributions
    investment_club_contributions.completed.sum(:amount) || 0
  end
  
  # FIXED: Remove reference to executed scope since we don't have auto-investment anymore
  def total_invested
    # Since we're not doing auto-investment, total_invested should be 0
    # Or you could calculate based on approved campaigns if needed
    0
  end
  
  def current_balance
    total_contributions - total_invested
  end
  
  # UPDATED: Remove investment-related ROI metrics since we're not doing auto-investment
  def roi_metrics
    {
      total_contributions: total_contributions,
      total_invested: total_invested,
      current_balance: current_balance,
      # REMOVED: investment-related metrics
      approved_campaigns_count: club_investments.approved.count,
      pending_investments: club_investments.voting.count
    }
  end
  
  # Update members count method - SIMPLIFIED
  def update_members_count
    active_count = investment_club_memberships.active.count
    if current_members_count != active_count
      update_column(:current_members_count, active_count)
    end
  end
  
  def update_financials
    update_columns(
      total_contributions: total_contributions,
      total_invested: total_invested,
      current_balance: current_balance,
      updated_at: Time.current
    )
  end
  
  # Create creator membership after club creation
  def create_creator_membership
    membership = investment_club_memberships.create!(
      user: creator,
      role: 'creator',
      status: 'active'
    )
    # Immediately update count
    update_members_count
  end
  
  def active_members
    members.joins(:investment_club_memberships)
           .where(investment_club_memberships: { 
             status: 'active',
             investment_club_id: id
           })
  end
  
  def admin_members
    members.joins(:investment_club_memberships)
           .where(investment_club_memberships: { 
             status: 'active', 
             role: ['admin', 'creator'],
             investment_club_id: id
           })
  end
  
  def is_member?(user)
    investment_club_memberships.active.exists?(user: user)
  end
  
  def is_admin?(user)
    investment_club_memberships.active.exists?(user: user, role: ['admin', 'creator'])
  end
  
  def membership_for(user)
    investment_club_memberships.find_by(user: user)
  end
  
  # FIXED: Since we're not doing auto-investment, this should always return true
  # or you might want to remove this method entirely
  def can_invest?(amount)
    current_balance >= amount
  end

  def at_capacity?
    # Handle nil values gracefully
    return false if current_members_count.nil? || max_members.nil?
    current_members_count >= max_members
  end

  def is_creator?(user)
    creator_id == user.id
  end

  def can_join?(user)
    !at_capacity? && !is_member?(user)
  end

  def pending_members_count
    investment_club_memberships.pending.count
  end

  # SIMPLIFIED: Only check if user is creator - let the API handle other validations
  def can_be_deleted_by?(user)
    is_creator?(user)
  end

  def deletion_errors?(user)
    errors = []
    errors << 'Only club creator can delete the club' unless can_be_deleted_by?(user)
    # REMOVED: Investment-related deletion constraints since we're not doing auto-investment
    # errors << 'Cannot delete club with active investments' if club_investments.executed.any?
    errors << 'Cannot delete club with active members' if investment_club_memberships.active.count > 1
    errors
  end

  def update_all_member_shares
    total_contributions = self.total_contributions
    return if total_contributions.zero?
    
    memberships = investment_club_memberships.active.to_a
    return if memberships.empty?
    
    # Calculate proportional shares based on current contributions
    calculated_shares = {}
    total_calculated = 0.0
    
    memberships.each do |membership|
      raw_share = (membership.total_contributed / total_contributions) * 100
      calculated_shares[membership.id] = raw_share
      total_calculated += raw_share
    end
    
    # Apply proportional adjustment to ensure exactly 100%
    adjustment_factor = 100.0 / total_calculated
    
    # Update all memberships with adjusted shares
    ActiveRecord::Base.transaction do
      memberships.each do |membership|
        adjusted_share = (calculated_shares[membership.id] * adjustment_factor).round(4)
        membership.update_column(:contributed_share, adjusted_share)
      end
    end
    
    # Final verification
    final_total = investment_club_memberships.active.sum(:contributed_share)
    if (final_total - 100.0).abs > 0.01
      # Force correction by adjusting the largest shareholder
      force_correct_share_totals
    end
    
    Rails.logger.info "Updated member shares. Total: #{final_total}%"
  end

  def verify_share_totals
    current_total = investment_club_memberships.active.sum(:contributed_share)
    expected_total = 100.0
    
    if (current_total - expected_total).abs > 0.01
      Rails.logger.warn "Share total verification failed: #{current_total}% (expected 100%)"
      force_correct_share_totals
      return false
    else
      Rails.logger.info "Share total verification passed: #{current_total}%"
      return true
    end
  end

  # Force correction if there are still rounding errors
  def force_correct_share_totals
    memberships = investment_club_memberships.active.order(contributed_share: :desc)
    current_total = memberships.sum(:contributed_share)
    difference = (100.0 - current_total).round(4)
    
    return if difference.zero?
    
    # Apply the difference to the largest shareholder
    largest_member = memberships.first
    new_share = (largest_member.contributed_share + difference).round(4)
    largest_member.update_column(:contributed_share, new_share)
    
    Rails.logger.info "Force-corrected shares: Adjusted #{largest_member.user.full_name} by #{difference}%"
  end

  def simulate_share_change(member:, new_contribution:)
    current_shares = investment_club_memberships.active.each_with_object({}) do |m, hash|
      hash[m.id] = {
        user: m.user.full_name,
        current_contributed: m.total_contributed,
        current_share: m.contributed_share
      }
    end
    
    # Calculate new totals
    new_total_contributions = total_contributions + new_contribution
    new_shares = {}
    
    investment_club_memberships.active.each do |m|
      if m.id == member.id
        new_contributed = m.total_contributed + new_contribution
      else
        new_contributed = m.total_contributed
      end
      
      new_share = (new_contributed / new_total_contributions) * 100
      new_shares[m.id] = {
        user: m.user.full_name,
        new_contributed: new_contributed,
        new_share: new_share.round(4),
        share_change: (new_share - m.contributed_share).round(4)
      }
    end
    
    {
      current_state: current_shares,
      projected_state: new_shares,
      new_total_contributions: new_total_contributions,
      contribution_impact: {
        member: member.user.full_name,
        new_contribution: new_contribution,
        current_share: member.contributed_share,
        projected_share: new_shares[member.id][:new_share],
        share_increase: new_shares[member.id][:share_change]
      }
    }
  end

  def update_all_member_shares_with_history(contribution = nil)
    total_contributions = self.total_contributions.to_f
    
    # Return early if no contributions
    if total_contributions.zero?
      Rails.logger.info "No contributions to calculate shares for club #{id}"
      return
    end
    
    begin
      # Use the active memberships association
      active_memberships.find_each do |membership|
        update_member_share_with_history(membership, total_contributions, contribution)
      end
      
      Rails.logger.info "Successfully updated shares for all active members in club #{id}"
    rescue => e
      Rails.logger.error "Error updating member shares for club #{id}: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise
    end
  end

  # Update the process_completion! method to use the enhanced version
  def process_completion!
    return if processed_at.present?
    
    ActiveRecord::Base.transaction do
      membership = investment_club.membership_for(user)
      if membership
        previous_total = membership.total_contributed
        previous_share = membership.contributed_share
        
        new_total = membership.total_contributed + amount
        membership.update!(total_contributed: new_total)
        
        investment_club.update_financials
        
        # Use the enhanced method with history tracking
        investment_club.update_all_member_shares_with_history(self)
        
        # Log the changes
        new_share = membership.reload.contributed_share
        Rails.logger.info "Contribution processed: #{user.full_name} " +
                        "+#{format_currency(amount)} " +
                        "(#{previous_share}% → #{new_share}%)"
      end
      
      update_column(:processed_at, Time.current)
    end
  end

  private
  
  def generate_slug
    self.slug = name.parameterize
    counter = 1
    while InvestmentClub.exists?(slug: slug)
      self.slug = "#{name.parameterize}-#{counter}"
      counter += 1
    end
  end
  
  def map_club_type_to_access_type
    # This method is now handled by the club_type= setter
    # Set default if no access_type is set
    self.access_type = 'restricted' if access_type.blank?
  end

  def set_default_members_count
    self.current_members_count ||= 0
  end
  
  # FIXED: Simplified callback that doesn't rely on non-existent methods
  def update_members_count_if_needed
    # Only update if we think the count might be wrong
    # This is a conservative approach to avoid unnecessary updates
    actual_count = investment_club_memberships.active.count
    if current_members_count != actual_count
      update_column(:current_members_count, actual_count)
    end
  end

  def update_member_share_with_history(membership, total_contributions, contribution)
    previous_share = membership.contributed_share.to_f
    new_share = calculate_member_share(membership.total_contributed.to_f, total_contributions)
    
    # Only create history record if share actually changed
    if (previous_share - new_share).abs > 0.0001 # Small threshold for floating point comparison
      create_share_change_history(membership, previous_share, new_share, contribution)
      membership.update_column(:contributed_share, new_share)
      
      Rails.logger.info "Updated share for #{membership.user.full_name}: #{previous_share.round(4)}% → #{new_share.round(4)}%"
    else
      Rails.logger.debug "No share change for #{membership.user.full_name}: #{previous_share.round(4)}%"
    end
  end

  def calculate_member_share(member_contribution, total_contributions)
    return 0.0 if total_contributions.zero?
    
    # Calculate percentage with proper precision
    share = (member_contribution / total_contributions) * 100.0
    
    # Round to 4 decimal places to avoid floating point issues
    share.round(4)
  end

  def create_share_change_history(membership, previous_share, new_share, contribution)
    change_amount = (new_share - previous_share).round(4)
    
    MemberShareChange.create!(
      investment_club_membership: membership,
      investment_club_contribution: contribution,
      previous_share: previous_share.round(4),
      new_share: new_share.round(4),
      change_amount: change_amount,
      change_reason: contribution ? 'contribution' : 'recalculation',
      total_contributions_at_time: self.total_contributions
    )
    
    Rails.logger.info "Created share change record: #{membership.user.full_name} Δ#{change_amount}%"
  rescue => e
    Rails.logger.error "Failed to create share change history for membership #{membership.id}: #{e.message}"
    raise
  end
end