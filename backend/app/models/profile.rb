class Profile < ApplicationRecord
  belongs_to :user # Each profile belongs to a user

  # Validations
  validates :name, presence: true, allow_blank: true
  validates :description, presence: true, allow_blank: true
  validates :funding_goal, numericality: { greater_than: 0 }, presence: true, allow_blank: true
  validates :amount_raised, numericality: { greater_than_or_equal_to: 0 }, presence: true, allow_blank: true
  validates :status, inclusion: { in: %w[active inactive], message: '%<value>s is not a valid status' }
  validates :end_date, presence: true, allow_blank: true
  validates :category, presence: true, allow_blank: true
  validates :location, presence: true, allow_blank: true
  validates :avatar, presence: true, allow_blank: true # Optional, depending on your requirements

  # Optional associations, depending on your app structure:
  # has_one_attached :avatar (if you're using Active Storage for file uploads)
end
