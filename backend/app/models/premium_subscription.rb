class PremiumSubscription < ApplicationRecord
  belongs_to :user

  validates :amount, :transaction_reference, presence: true
  validates :transaction_reference, uniqueness: true

  scope :active, -> { where('expires_at > ?', Time.current).where(status: 'active') }
end