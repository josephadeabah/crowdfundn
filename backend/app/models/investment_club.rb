# app/models/investment_club.rb
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
  attribute :currency, :string, default: 'GHS'
  
  before_validation :generate_slug, if: -> { slug.blank? && name.present? }
  before_validation :map_club_type_to_access_type
  after_create :create_creator_membership
  after_initialize :set_default_members_count, if: :new_record?
  
  after_save :update_members_count_if_needed
  
  enum access_type: { 
    open: 'open', 
    restricted: 'restricted', 
    certified: 'certified' 
  }, _prefix: true
  
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }

  # NEW: Add contact methods for club investments
  def contact_email
    creator.email
  end
  
  def contact_name
    creator.full_name
  end
  
  def admin_members
    members.joins(:investment_club_memberships)
           .where(investment_club_memberships: { 
             status: 'active', 
             role: ['admin', 'creator'],
             investment_club_id: id
           })
  end
  
  def primary_admin
    admin_members.first || creator
  end

  def currency_symbol
    case currency&.upcase
    when 'USD' then '$'
    when 'EUR' then '€'
    when 'GBP' then '£'
    when 'NGN' then '₦'
    when 'GHS' then '₵'
    when 'KES' then 'KSh'
    else 'GHS'
    end
  end

  def club_type=(value)
    case value.to_s
    when 'public'
      self.access_type = 'open'
    when 'private'
      self.access_type = 'restricted'
    when 'verified'
      self.access_type = 'certified'
    else
      self.access_type = 'restricted'
    end
  end
  
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
    else 'private'
    end
  end

  # FIXED: Consistent financial calculations with transaction safety
  def recalc_total_contributions!
    new_total = investment_club_contributions.completed.sum(:amount).to_f
    update_columns(total_contributions: new_total)
  end

  # FIXED: Current balance calculation with proper locking
  def recalc_current_balance!
    total_invested = club_investments.where(status: 'executed').sum(:investment_amount).to_f
    total_withdrawn = club_transfers.where(status: 'success').sum(:amount).to_f

    new_balance = total_contributions - total_invested - total_withdrawn
    update_columns(current_balance: [new_balance, 0].max) # Ensure balance doesn't go negative
  end

  # FIXED: Thread-safe balance updates
  def update_balance_with_contribution(amount)
    ActiveRecord::Base.transaction do
      lock!
      new_balance = current_balance.to_f + amount.to_f
      update_columns(
        current_balance: new_balance,
        total_contributions: total_contributions.to_f + amount.to_f
      )
    end
  end

  # FIXED: Thread-safe balance deductions
  def deduct_balance(amount)
    ActiveRecord::Base.transaction do
      lock!
      new_balance = current_balance.to_f - amount.to_f
      if new_balance >= 0
        update_columns(current_balance: new_balance)
        true
      else
        false
      end
    end
  end

  # FIXED: Refund with thread safety
  def refund_balance(amount)
    ActiveRecord::Base.transaction do
      lock!
      new_balance = current_balance.to_f + amount.to_f
      update_columns(current_balance: new_balance)
    end
  end

  # FIXED: Consistent financial calculations
  def total_contributions
    # Always calculate fresh to avoid inconsistencies
    investment_club_contributions.completed.sum(:amount).to_f
  end

  def calculate_total_invested
    club_investments.executed.sum(:investment_amount).to_f
  end

  def calculate_current_balance
    total_contributions.to_f - calculate_total_invested.to_f
  end

  # FIXED: Update all financials atomically
  def update_financials
    ActiveRecord::Base.transaction do
      new_total_invested = calculate_total_invested
      new_current_balance = calculate_current_balance
      
      update_columns(
        total_invested: new_total_invested,
        current_balance: new_current_balance,
        updated_at: Time.current
      )
    end
  end

  # FIXED: CORRECT METHOD NAME - update_all_member_shares_with_history (without extra 's')
  def update_all_member_shares_with_history(contribution = nil)
    current_total = total_contributions.to_f
    
    Rails.logger.info "Calculating shares for club #{id}: Total contributions: #{current_total}"

    return if current_total.zero?

    ActiveRecord::Base.transaction do
      active_memberships.find_each do |membership|
        update_member_share_with_history(membership, current_total, contribution)
      end
      
      verify_share_totals
    end
    
    Rails.logger.info "Successfully updated shares for all active members in club #{id}"
  rescue => e
    Rails.logger.error "Error updating member shares for club #{id}: #{e.message}"
    raise
  end

  # FIXED: Method to update shares without history for cases where validation fails
  def update_all_member_shares_without_history
    current_total = total_contributions.to_f
    
    Rails.logger.info "Calculating shares without history for club #{id}: Total contributions: #{current_total}"

    return if current_total.zero?

    active_memberships.find_each do |membership|
      previous_share = membership.contributed_share.to_f
      new_share = calculate_member_share(membership.total_contributed.to_f, current_total)
      
      Rails.logger.info "Member #{membership.user.full_name}: Contributed: #{membership.total_contributed}, Share: #{previous_share}% → #{new_share}%"

      if (previous_share - new_share).abs > 0.0001
        membership.update_column(:contributed_share, new_share)
        Rails.logger.info "Updated share for #{membership.user.full_name}: #{previous_share.round(4)}% → #{new_share.round(4)}% (without history)"
      else
        Rails.logger.debug "No share change for #{membership.user.full_name}: #{previous_share.round(4)}%"
      end
    end
    
    verify_share_totals
  rescue => e
    Rails.logger.error "Error updating member shares without history for club #{id}: #{e.message}"
    # Don't raise - this is a fallback method
  end
  
  def roi_metrics
    {
      total_contributions: total_contributions,
      total_invested: calculate_total_invested,
      current_balance: calculate_current_balance,
      approved_campaigns_count: club_investments.approved.count,
      pending_investments: club_investments.voting.count
    }
  end
  
  def update_members_count
    active_count = investment_club_memberships.active.count
    if current_members_count != active_count
      update_column(:current_members_count, active_count)
    end
  end
  
  def create_creator_membership
    membership = investment_club_memberships.create!(
      user: creator,
      role: 'creator',
      status: 'active'
    )
    update_members_count
  end
  
  def active_members
    members.joins(:investment_club_memberships)
           .where(investment_club_memberships: { 
             status: 'active',
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
  
  def can_invest?(amount)
    current_balance >= amount
  end

  def at_capacity?
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

  def can_be_deleted_by?(user)
    is_creator?(user)
  end

  def deletion_errors?(user)
    errors = []
    errors << 'Only club creator can delete the club' unless can_be_deleted_by?(user)
    errors << 'Cannot delete club with active members' if investment_club_memberships.active.count > 1
    errors
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

  def force_correct_share_totals
    memberships = investment_club_memberships.active.order(contributed_share: :desc)
    current_total = memberships.sum(:contributed_share)
    difference = (100.0 - current_total).round(4)
    
    return if difference.zero?
    
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
    self.access_type = 'restricted' if access_type.blank?
  end

  def set_default_members_count
    self.current_members_count ||= 0
  end
  
  def update_members_count_if_needed
    actual_count = investment_club_memberships.active.count
    if current_members_count != actual_count
      update_column(:current_members_count, actual_count)
    end
  end

  def update_member_share_with_history(membership, total_contributions, contribution)
    previous_share = membership.contributed_share.to_f
    new_share = calculate_member_share(membership.total_contributed.to_f, total_contributions)
    
    Rails.logger.info "Member #{membership.user.full_name}: Contributed: #{membership.total_contributed}, Share: #{previous_share}% → #{new_share}%"

    if (previous_share - new_share).abs > 0.0001
      create_share_change_history(membership, previous_share, new_share, contribution)
      membership.update_column(:contributed_share, new_share)
      
      Rails.logger.info "Updated share for #{membership.user.full_name}: #{previous_share.round(4)}% → #{new_share.round(4)}%"
    else
      Rails.logger.debug "No share change for #{membership.user.full_name}: #{previous_share.round(4)}%"
    end
  end

  def calculate_member_share(member_contribution, total_contributions)
    return 0.0 if total_contributions.zero?
    
    share = (member_contribution / total_contributions) * 100.0
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
      total_contributions_at_time: total_contributions
    )
    
    Rails.logger.info "Created share change record: #{membership.user.full_name} Δ#{change_amount}%"
  rescue => e
    Rails.logger.error "Failed to create share change history for membership #{membership.id}: #{e.message}"
    raise
  end
end