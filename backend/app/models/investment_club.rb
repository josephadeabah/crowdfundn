# app/models/investment_club.rb
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
  
  before_validation :generate_slug, if: -> { slug.blank? && name.present? }
  before_validation :map_club_type_to_access_type
  
  # FIX: Use prefix with non-conflicting names
  enum access_type: { 
    restricted: 'private', 
    open: 'public', 
    certified: 'verified' 
  }, _prefix: true
  
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }
  
  # Allow setting club_type from params (maps to access_type internally)
  attr_accessor :club_type
  
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
    when 'restricted' then 'private'
    when 'open' then 'public' 
    when 'certified' then 'verified'
    end
  end
  
  # All your existing methods remain the same...
  def active_members
    members.joins(:investment_club_memberships)
           .where(investment_club_memberships: { status: 'active' })
  end
  
  def admin_members
    members.joins(:investment_club_memberships)
           .where(investment_club_memberships: { status: 'active', role: ['admin', 'creator'] })
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
    total_contributions - total_invested
  end
  
  def map_club_type_to_access_type
    return if club_type.blank?
    
    case club_type
    when 'public'
      self.access_type = 'open'
    when 'private'
      self.access_type = 'restricted'
    when 'verified'
      self.access_type = 'certified'
    end
  end
end