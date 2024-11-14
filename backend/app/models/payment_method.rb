class PaymentMethod < ApplicationRecord
  belongs_to :user

  validates :authorization_code, :card_type, :last4, :exp_month, :exp_year, :bank, :brand, presence: true
  validates :reusable, inclusion: { in: [true, false] }
end
