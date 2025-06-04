class User < ApplicationRecord
  has_secure_password
  STATUSES = %w[active blocked].freeze
  USER_TYPES = %w[ngo business_owner entrepreneur investor individual].freeze

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :subscriptions, dependent: :destroy
  has_many :subscribed_campaigns, through: :subscriptions, source: :campaign
  has_many :points, dependent: :destroy
  has_many :leaderboard_entries, dependent: :destroy
  has_many :fundraiser_leaderboard_entries, dependent: :destroy
  has_many :backer_rewards, dependent: :destroy
  has_many :campaign_shares, dependent: :destroy
  has_many :pledges, dependent: :destroy
  # Add these associations for equity investment
  has_many :equity_investments, dependent: :destroy
  has_many :invested_campaigns, through: :equity_investments, source: :campaign
  has_many :investor_documents, dependent: :destroy
  has_many :premium_subscriptions, dependent: :destroy

  validates :status, inclusion: { in: STATUSES }
  validates :user_type, inclusion: { in: USER_TYPES }
  validates :email, presence: true, uniqueness: true
  validates :currency_symbol, presence: true
  validates :phone_code, presence: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount, presence: true
  # Add this validation for equity investment
  validates :tax_id, format: { with: /\A[A-Z0-9]+\z/ }, if: :investor?
  has_one :profile, dependent: :destroy
  has_many :campaigns, foreign_key: 'fundraiser_id', dependent: :destroy
  has_many :donations
  has_many :transfers, dependent: :destroy
  has_many :archived_campaigns
  has_many :articles, foreign_key: 'author_id', dependent: :destroy
  has_one :subaccount, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_campaigns, through: :favorites, source: :campaign
  accepts_nested_attributes_for :profile

  after_initialize :set_default_status, if: :new_record?
  after_create :generate_confirmation_token
  after_create :send_confirmation_email
  after_create :assign_default_role
  after_create :create_default_profile
  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :blocked, -> { where(status: 'blocked') }

  def generate_confirmation_token
    self.confirmation_token = UserConfirmationService.generate_confirmation_token(self)
    self.confirmation_sent_at = Time.current
    self.email_confirmed = false
  end

  def send_confirmation_email
    UserConfirmationService.send_confirmation_email(self)
  rescue StandardError => e
    Rails.logger.error "Failed to send confirmation email to user #{id}: #{e.message}"
  end

  def assign_default_role
    roles << Role.find_by(name: 'User') unless has_role?('User')
  end

  # Check if the user has a specific role
  def has_role?(role_name)
    roles.exists?(name: role_name)
  end

  # Check if user has any of the specified roles
  def has_any_role?(*role_names)
    roles.where(name: role_names).exists?
  end

  def create_default_profile
    profile = build_profile(
      name: full_name,
      description: 'This is the default fundraiser profile description.',
      funding_goal: 1000,
      amount_raised: 0,
      status: 'active'
    )
    return if profile.save

    Rails.logger.error "Failed to create profile for user #{id}: #{profile.errors.full_messages}"
  end

  def total_points
    points.sum(:amount) + campaign_share_count
  end

  def campaign_share_count
    campaign_shares.count - 0.75
  end

  # Add investor status check
  def investor?
    equity_investments.any? || invested_campaigns.any?
  end

  # Update accredited investor check with proper decimal handling
  def accredited_investor?
    return false unless net_worth.present? && annual_income.present?
    
    net_worth >= 1_000_000 || annual_income >= 200_000
  end

  def has_premium_access?
    # Check if user has an active subscription
    subscriptions.where("expires_at > ?", Time.current).exists? ||
      # Or if they have a lifetime access flag
      premium_access
  end

  def premium_access?
    premium_access && (premium_expires_at.nil? || premium_expires_at > Time.current)
  end

  def active_premium_subscription
    premium_subscriptions.active.last
  end

  private

  def set_default_status
    self.status ||= 'active'
    self.user_type ||= 'individual'
  end
end