class Subaccount < ApplicationRecord
  belongs_to :user, optional: true

  validates :business_name, presence: true
  validates :account_number, presence: true
  validates :percentage_charge, numericality: { greater_than_or_equal_to: 0 }
end
