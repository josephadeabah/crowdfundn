class User < ApplicationRecord
  has_secure_password
  STATUSES = %w[active blocked].freeze

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :subscriptions, dependent: :destroy
  has_many :subscribed_campaigns, through: :subscriptions, source: :campaign

  validates :status, inclusion: { in: STATUSES }
  validates :email, presence: true, uniqueness: true
  validates :currency_symbol, presence: true
  validates :phone_code, presence: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount, :national_id, presence: true
  has_one :profile, dependent: :destroy
  has_many :campaigns, foreign_key: 'fundraiser_id', dependent: :destroy
  has_many :donations
  has_many :transfers, dependent: :destroy
  has_many :archived_campaigns
  has_one :subaccount, dependent: :destroy
  accepts_nested_attributes_for :profile

  after_create :generate_confirmation_token
  after_create :send_confirmation_email
  after_create :assign_default_role
  after_create :create_default_profile
  after_initialize :set_default_status, if: :new_record?
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
    unless profile.save
      Rails.logger.error "Failed to create profile for user #{id}: #{profile.errors.full_messages}"
    end
  end 

  private

  def set_default_status
    self.status ||= 'active'
  end
end
