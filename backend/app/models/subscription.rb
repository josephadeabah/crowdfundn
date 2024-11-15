class Subscription < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  validates :subscription_code, presence: true, uniqueness: true
  validates :status, presence: true
end
