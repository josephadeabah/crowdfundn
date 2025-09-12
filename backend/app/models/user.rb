# app/models/user.rb
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

  # Equity investment
  has_many :equity_investments, dependent: :destroy
  has_many :invested_campaigns, through: :equity_investments, source: :campaign
  has_many :investor_documents, dependent: :destroy

  # Premium subscriptions
  has_many :premium_subscriptions, dependent: :destroy

  # KYC
  has_many :kycs, class_name: '::Kyc', dependent: :destroy
  has_one :latest_kyc, -> { where.not(status: 'superseded').order(created_at: :desc) }, class_name: '::Kyc'

  validates :status, inclusion: { in: STATUSES }
  validates :user_type, inclusion: { in: USER_TYPES }
  validates :email, presence: true, uniqueness: true
  validates :currency_symbol, :phone_code, presence: true
  validates :full_name, :phone_number, :country, :payment_method, :currency,
            :birth_date, :category, :target_amount, presence: true

  # Equity investment tax ID check
  validates :tax_id,
            format: { with: /\A[A-Z0-9]+\z/ },
            allow_blank: true,
            if: -> { investor? && tax_id.present? }

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

  # === SCOPES ===
  scope :active, -> { where(status: 'active') }
  scope :blocked, -> { where(status: 'blocked') }

  # === EMAIL CONFIRMATION ===
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

  # === ROLES ===
  def assign_default_role
    roles << Role.find_by(name: 'User') unless has_role?('User')
  end

  def has_role?(role_name)
    roles.exists?(name: role_name)
  end

  def has_any_role?(*role_names)
    roles.where(name: role_names).exists?
  end

  # === PROFILE ===
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

  # === POINTS ===
  def total_points
    points.sum(:amount) + campaign_share_count
  end

  def campaign_share_count
    campaign_shares.count - 0.75
  end

  # === INVESTORS ===
  def investor?
    equity_investments.any? || invested_campaigns.any?
  end

  def accredited_investor?
    return false unless net_worth.present? && annual_income.present?

    net_worth >= 1_000_000 || annual_income >= 200_000
  end

  # === PREMIUM ACCESS (refactored) ===
  def active_premium_subscription
    premium_subscriptions.active.last
  end

  def premium_access?
    active_premium_subscription.present? && !active_premium_subscription.expired?
  end

  # Alias for compatibility with frontend
  def has_premium_access?
    premium_access?
  end

  def current_premium_plan
    active_premium_subscription&.premium_plan
  end

  def premium_expires_at
    active_premium_subscription&.expires_at
  end

  # === KYC ===
  def kyc_verified?
    latest_kyc&.verified? && !latest_kyc.expired?
  end

  def investor_kyc_verified?
    kyc_verified? && (latest_kyc.investor? || latest_kyc.both?)
  end

  def issuer_kyc_verified?
    kyc_verified? && (latest_kyc.issuer? || latest_kyc.both?)
  end

  def requires_kyc?
    (investor? || campaigns.any?) && !kyc_verified?
  end

  def pending_kyc?
    latest_kyc&.pending? || latest_kyc&.in_review?
  end

  def verified_investor?
    investor_kyc_verified?
  end

  def verified_issuer?
    issuer_kyc_verified?
  end

  def verified_both?
    latest_kyc&.verified? && latest_kyc.both?
  end

  def kyc_status_info
    return { verified: false, has_kyc: false } unless latest_kyc

    {
      verified: latest_kyc.verified?,
      has_kyc: true,
      status: latest_kyc.status,
      kyc_type: latest_kyc.kyc_type,
      verified_at: latest_kyc.verified_at,
      expires_at: latest_kyc.verified_at ? latest_kyc.verified_at + 1.year : nil,
      is_expired: latest_kyc.expired?
    }
  end

  def can_invest?
    verified_investor? && !latest_kyc.expired?
  end

  def can_create_campaign?
    verified_issuer? && !latest_kyc.expired?
  end

  def can_upgrade_to_both?
    latest_kyc&.verified? && (latest_kyc.investor? || latest_kyc.issuer?)
  end

  def upgrade_kyc_to_both!
    return false unless can_upgrade_to_both?

    new_kyc = kycs.build(
      kyc_type: 'both',
      verification_type: latest_kyc.verification_type,
      id_number: latest_kyc.id_number,
      id_expiry_date: latest_kyc.id_expiry_date,
      date_of_birth: latest_kyc.date_of_birth,
      nationality: latest_kyc.nationality,
      occupation: latest_kyc.occupation,
      source_of_funds: latest_kyc.source_of_funds,
      upgraded_from_type: latest_kyc.kyc_type,
      is_upgrade: true
    )

    new_kyc.save
  end

  def admin?
    has_role?('Admin') || self[:admin] == true
  end

  private

  def set_default_status
    self.status ||= 'active'
    self.user_type = 'individual' if new_record? && user_type.blank?
  end
end
