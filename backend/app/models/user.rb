class User < ApplicationRecord
  has_secure_password

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles

  validates :email, presence: true, uniqueness: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount,
            :duration_in_days, :national_id, presence: true
  has_one :profile, dependent: :destroy
  has_many :campaigns, foreign_key: 'fundraiser_id', dependent: :destroy
  accepts_nested_attributes_for :profile
  before_create :create_default_profile

  after_create :assign_default_role
  after_create :create_default_profile

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

  private

  def create_default_profile
    profile = build_profile(
      name: full_name,
      description: 'This is the default profile description.',
      funding_goal: 1000,
      amount_raised: 0,
      status: 'active'
    )
    unless profile.save
      Rails.logger.error "Failed to create profile for user #{id}: #{profile.errors.full_messages}"
    end
  end

  # Create a profile for existing users who don't have one
  User.where.missing(:profile).find_each do |user|
    user.create_default_profile
  end  
end
