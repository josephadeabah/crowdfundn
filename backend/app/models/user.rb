class User < ApplicationRecord
  has_secure_password

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :payment_methods, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :subscribed_campaigns, through: :subscriptions, source: :campaign

  validates :email, presence: true, uniqueness: true
  validates :currency_symbol, presence: true
  validates :phone_code, presence: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount,
            :duration_in_days, :national_id, presence: true
  has_one :profile, dependent: :destroy
  has_many :campaigns, foreign_key: 'fundraiser_id', dependent: :destroy
  has_many :donations
  has_many :archived_campaigns
  accepts_nested_attributes_for :profile

  before_create :generate_confirmation_token
  after_create :send_confirmation_email
  after_create :assign_default_role
  after_create :create_default_profile

  def confirmation_token_expired?
    begin
      decoded = JWT.decode(confirmation_token, Rails.application.secret_key_base).first
      decoded['exp'] < Time.current.to_i
    rescue JWT::DecodeError, JWT::ExpiredSignature
      true
    end
  end
  

  def send_confirmation_email
    host = Rails.application.routes.default_url_options[:host] || 'https://bantuhive.com'
    UserConfirmationEmailService.send_confirmation_email(self, host)
  rescue StandardError => e
    Rails.logger.error "Failed to send confirmation email to user #{id}: #{e.message}"
  end
  

  # Override to generate JWT confirmation token with expiration
  def generate_confirmation_token
    payload = {
      user_id: id,
      exp: 2.days.from_now.to_i # Token expires in 2 days
    }
    self.confirmation_token = JWT.encode(payload, Rails.application.secret_key_base)
    self.confirmation_sent_at = Time.current
    self.email_confirmed = false
  end

  # Mark the user as confirmed
  def confirm_email!
    update(email_confirmed: true, confirmed_at: Time.current, confirmation_token: nil)
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
end
