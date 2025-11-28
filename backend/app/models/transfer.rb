# app/models/transfer.rb
class Transfer < ApplicationRecord
  belongs_to :user
  belongs_to :campaign, optional: true
  belongs_to :subaccount, optional: true  # Add this line

  validates :recipient_code, presence: true
  validates :bank_name, :account_number, :amount, :transfer_code, :reference, presence: true
end