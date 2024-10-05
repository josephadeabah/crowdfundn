class User < ApplicationRecord
  has_secure_password

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles

  validates :email, presence: true, uniqueness: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount, :duration_in_days, :national_id, presence: true
  has_one :profile, dependent: :destroy
  has_many :campaigns, foreign_key: 'fundraiser_id', dependent: :destroy
  accepts_nested_attributes_for :profile

  after_create :assign_default_role

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
end
