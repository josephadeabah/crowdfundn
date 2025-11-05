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
  
  enum club_type: { private: 'private', public: 'public', verified: 'verified' }
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }
  
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
end