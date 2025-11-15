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
  # Add this association to the existing ones
  has_many :reported_reports, class_name: 'Report', foreign_key: 'reporter_id', dependent: :destroy
  has_many :reports_against, class_name: 'Report', foreign_key: 'reported_user_id', dependent: :destroy
  # Add these associations for equity investment
  has_many :equity_investments, dependent: :destroy
  has_many :invested_campaigns, through: :equity_investments, source: :campaign
  has_many :investor_documents, dependent: :destroy
  has_many :investment_club_memberships, dependent: :destroy
  has_many :investment_clubs, through: :investment_club_memberships
  has_many :premium_subscriptions
  # Add archive association
  has_many :archived_campaigns, dependent: :destroy
  has_many :archived_campaigns_list, through: :archived_campaigns, source: :campaign
  belongs_to :premium_plan, optional: true
  # Update KYC associations to use full namespace
  has_many :kycs, class_name: '::Kyc', dependent: :destroy
  has_one :latest_kyc, -> { where.not(status: 'superseded').order(created_at: :desc) }, class_name: '::Kyc'

  validates :status, inclusion: { in: STATUSES }
  validates :user_type, inclusion: { in: USER_TYPES }
  validates :email, presence: true, uniqueness: true
  validates :currency_symbol, presence: true
  validates :phone_code, presence: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount,
            presence: true
  # Add this validation for equity investment
  validates :tax_id, format: { with: /\A[A-Z0-9]+\z/ }, 
                    allow_blank: true, 
                    if: -> { investor? && tax_id.present? }
  has_one :profile, dependent: :destroy
  has_many :campaigns, foreign_key: 'fundraiser_id', dependent: :destroy
  has_many :donations
  has_many :transfers, dependent: :destroy
  has_many :club_transfers, dependent: :nullify
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

  # Add this method to check if user has pending reports
  def has_pending_reports?
    reports_against.pending.exists?
  end

  def recent_reports_against(limit = 5)
    reports_against.order(created_at: :desc).limit(limit)
  end

  def archived_campaigns_with_details
    archived_campaigns.includes(campaign: [:fundraiser, :rewards, :updates])
                      .order(archived_at: :desc)
  end

  # Add this method if it doesn't exist
  def archive_campaign(campaign, reason = nil)
    archived_campaigns.create!(campaign: campaign, reason: reason)
  end

  def unarchive_campaign(campaign)
    archived_campaigns.where(campaign: campaign).destroy_all
  end
  
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
    subscriptions.where('expires_at > ?', Time.current).exists? ||
      # Or if they have a lifetime access flag
      premium_access
  end

  def premium_access?
    premium_access && (premium_expires_at.nil? || premium_expires_at > Time.current)
  end
  
  def active_premium_subscription
    premium_subscriptions.active.last
  end
  
  def upgrade_to_premium(plan, transaction_reference)
    transaction do 
      update_columns(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_premium_expiry(plan),
        premium_subscription_id: nil,
        updated_at: Time.current
      )
      
      PremiumSubscription.create!(
        user: self,
        premium_plan: plan,
        paystack_subscription_code: nil,
        amount: plan.price,
        currency: plan.currency,
        interval: plan.interval, # Add this line
        status: 'active',
        start_date: Time.current,
        expires_at: calculate_premium_expiry(plan),
        auto_renew: false,
        transaction_reference: transaction_reference
      )
    end
  end

  def downgrade_from_premium
    transaction do
      update_columns(
        premium_access: false,
        premium_plan_id: nil,
        premium_expires_at: nil,
        premium_subscription_id: nil,
        updated_at: Time.current
      )
      
      # Cancel any active subscriptions locally
      active_premium_subscription&.cancel!
    end
  end

  # Add KYC status methods
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

  def admin?
    has_role?('Admin') || self[:admin] == true
  end

  # New methods for KYC verification
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

  # Upgrade methods
  def can_upgrade_to_both?
    return false unless latest_kyc&.verified?
    latest_kyc.investor? || latest_kyc.issuer?
  end

  def upgrade_kyc_to_both!
    return false unless can_upgrade_to_both?
    
    # Create a new KYC with both type
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

    # Add transfer locking methods
  def lock_transfers!(admin_user, reason = nil)
    # Use update_columns to bypass validations
    update_columns(
      transfer_locked: true,
      transfer_locked_reason: reason,
      transfer_locked_at: Time.current,
      transfer_locked_by: admin_user.id
    )
    true # Return true to indicate success
  rescue => e
    Rails.logger.error "Failed to lock transfers: #{e.message}"
    false
  end

  def unlock_transfers!
    # Use update_columns to bypass validations
    update_columns(
      transfer_locked: false,
      transfer_locked_reason: nil,
      transfer_locked_at: nil,
      transfer_locked_by: nil
    )
    true # Return true to indicate success
  rescue => e
    Rails.logger.error "Failed to unlock transfers: #{e.message}"
    false
  end

  # Add method to reset specific campaign
  def reset_campaign_transferred_amount(campaign_id, admin_user = nil)
    campaign = campaigns.find(campaign_id)
    campaign.reset_transferred_amount!(admin_user)
  end

  def can_make_transfers?
    return false if transfer_locked?
    return false if status == 'blocked'  # Use status check instead of blocked?
    true
  end

  def transfer_lock_info
    return nil unless transfer_locked?
    
    {
      locked: true,
      reason: transfer_locked_reason,
      locked_at: transfer_locked_at,
      locked_by: User.find_by(id: transfer_locked_by)&.full_name,
      locked_by_id: transfer_locked_by
    }
  end

  # Update the as_json method to include transfer lock status
  def as_json(options = {})
    super(options).merge(
      transfer_locked: transfer_locked?,
      transfer_lock_info: transfer_lock_info,
      can_make_transfers: can_make_transfers?,
      last_transfer_reset_at: last_transfer_reset_at,
      total_transferred_amount: total_transferred_amount
    )
  end

  private

  def set_default_status
    self.status ||= 'active'
    self.user_type = 'individual' if new_record? && user_type.blank?
  end

  def calculate_premium_expiry(plan)
    case plan.interval
    when 'monthly'
      1.month.from_now
    when 'quarterly'
      3.months.from_now
    when 'annually'
      1.year.from_now
    else
      Rails.logger.warn("Unknown plan interval: #{plan.interval}, defaulting to 1 month")
      1.month.from_now
    end
  end

end