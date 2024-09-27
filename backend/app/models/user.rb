class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true
  validates :full_name, :phone_number, :country, :payment_method, :currency, :birth_date, :category, :target_amount, :duration_in_days, :national_id, presence: true
  has_one :profile, dependent: :destroy
  accepts_nested_attributes_for :profile
end
