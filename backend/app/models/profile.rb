class Profile < ApplicationRecord
  belongs_to :user # Each profile belongs to a user

  # Validations
  validates :name, presence: true
  validates :description, presence: true
  validates :funding_goal, numericality: { greater_than: 0 }, presence: true
  validates :amount_raised, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: %w[active inactive], message: '%<value>s is not a valid status' }
  validates :end_date, presence: true, allow_blank: true
  validates :category, presence: true, allow_blank: true
  validates :location, presence: true, allow_blank: true
  validates :avatar, presence: true, allow_blank: true # Optional, depending on your requirements

  # Validations for new fields
  # validates :currency, presence: true
  # validates :currency_code, presence: true
  # validates :currency_symbol, presence: true

  # Optional associations, depending on your app structure:
  # has_one_attached :avatar (if you're using Active Storage for file uploads)
end
