class Donation < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  belongs_to :reward, optional: true
  
  validates :transaction_reference, presence: true
  validates :email, presence: true  # Email is required
  
  # Define the `successful` scope
  scope :successful, -> { where(status: 'successful') }
end
