class InvestmentClub < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  has_many :investment_club_memberships, dependent: :destroy
  has_many :members, through: :investment_club_memberships, source: :user
  has_many :investment_club_contributions, dependent: :destroy
  has_many :club_investments, dependent: :destroy
  has_many :invested_campaigns, through: :club_investments, source: :campaign
  
  validates :name, :slug, presence: true
  validates :slug, uniqueness: true
  validates :minimum_monthly_contribution, numericality: { greater_than_or_equal_to: 0 }
  validates :max_members, numericality: { greater_than: 0 }
  validates :current_members_count, numericality: { greater_than_or_equal_to: 0 }

  attribute :constitution_data, :json, default: -> { {} }
  
  before_validation :generate_slug, if: -> { slug.blank? && name.present? }
  before_validation :map_club_type_to_access_type
  after_create :create_creator_membership
  
  # FIXED: Simple enum without complex mappings
  enum access_type: { 
    open: 'open', 
    restricted: 'restricted', 
    certified: 'certified' 
  }, _prefix: true
  
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }

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
  
  # Update members count method
  def update_members_count
    active_count = investment_club_memberships.active.count
    if current_members_count != active_count
      update_columns(current_members_count: active_count)
    end
  end
  
  # Create creator membership after club creation
  def create_creator_membership
    investment_club_memberships.create!(
      user: creator,
      role: 'creator',
      status: 'active'
    )
    update_members_count # This will set current_members_count to 1
  end
  
  # All your existing methods remain the same...
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
  
  def update_financials
    update(
      total_contributions: investment_club_contributions.completed.sum(:amount),
      current_balance: calculate_current_balance,
      total_invested: club_investments.executed.sum(:investment_amount)
    )
  end
  
  def can_invest?(amount)
    current_balance >= amount
  end

    def at_capacity?
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
  
  private
  
  def generate_slug
    self.slug = name.parameterize
    counter = 1
    while InvestmentClub.exists?(slug: slug)
      self.slug = "#{name.parameterize}-#{counter}"
      counter += 1
    end
  end
  
  def calculate_current_balance
    (total_contributions || 0) - (total_invested || 0)
  end
  
  def map_club_type_to_access_type
    # This method is now handled by the club_type= setter
    # Set default if no access_type is set
    self.access_type = 'restricted' if access_type.blank?
  end
end