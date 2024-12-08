class Transfer < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  validates :recipient_code, presence: true
  validates :bank_name, :account_number, :amount, :transfer_code, :reference, presence: true
end
