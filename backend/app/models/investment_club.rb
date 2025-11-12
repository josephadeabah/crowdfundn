# app/models/investment_club.rb
class InvestmentClub < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  has_many :investment_club_memberships, dependent: :destroy
  has_many :members, through: :investment_club_memberships, source: :user
  has_many :investment_club_contributions, dependent: :destroy
  has_many :club_investments, dependent: :destroy
  has_many :invested_campaigns, through: :club_investments, source: :campaign
  has_many :club_transactions, dependent: :destroy
  
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
  
  # Financial methods
  def total_contributions
    investment_club_contributions.completed.sum(:amount) || 0
  end
  
  def total_invested
    club_investments.executed.sum(:investment_amount) || 0
  end
  
  def current_balance
    total_contributions - total_invested
  end
  
  def roi_metrics
    total_return = club_investments.executed.sum(:current_value).to_f
    total_invested_amount = total_invested.to_f
    
    if total_invested_amount > 0
      roi_percentage = ((total_return - total_invested_amount) / total_invested_amount) * 100
    else
      roi_percentage = 0
    end
    
    {
      total_contributions: total_contributions,
      total_invested: total_invested,
      current_balance: current_balance,
      total_return: total_return,
      roi_percentage: roi_percentage.round(2),
      active_investments: club_investments.executed.count,
      completed_investments: club_investments.completed.count
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
    errors << 'Cannot delete club with active investments' if club_investments.executed.any?
    errors << 'Cannot delete club with active members' if investment_club_memberships.active.count > 1
    errors
  end

  def get_ai_recommendations(limit: 10, user: nil)
    AI::ClubRecommendationService.new(self, user).recommend_campaigns(limit: limit)
  end

  def explain_campaign_recommendation(campaign, user: nil)
    AI::ClubRecommendationService.new(self, user).explain_recommendation(campaign)
  end

  def ai_risk_profile
    AI::ClubRecommendationService.new(self).get_club_risk_profile
  end

  def recommended_campaigns(limit: 5)
    # Quick method for getting recommendations without full AI analysis
    service = AI::ClubRecommendationService.new(self)
    result = service.recommend_campaigns(limit: limit)
    
    if result[:success]
      result[:recommendations].map { |r| r[:campaign] }
    else
      [] # Fallback to recently active campaigns
      Campaign.active
              .where(is_public: true)
              .where(appear_in_search_results: true)
              .order(created_at: :desc)
              .limit(limit)
    end
  end

  def update_all_member_shares
    total_contributions = self.total_contributions
    return if total_contributions.zero?
    
    investment_club_memberships.active.each do |membership|
      new_share = (membership.total_contributed / total_contributions) * 100
      membership.update_column(:contributed_share, new_share.round(4))
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
end