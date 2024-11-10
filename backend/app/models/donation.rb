class Donation < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  
  validates :transaction_reference, presence: true
end
