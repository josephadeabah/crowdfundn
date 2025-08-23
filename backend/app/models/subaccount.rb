class Subaccount < ApplicationRecord
  belongs_to :user, optional: true

  validates :business_name, presence: true
  validates :account_number, presence: true
  validates :percentage_charge, numericality: { greater_than_or_equal_to: 0 }
  
  # Add these validations to prevent duplicates
  validates :user_id, uniqueness: true, allow_nil: false
  validates :subaccount_code, uniqueness: true
  
  # Prevent duplicate subaccounts for the same user
  before_validation :check_existing_subaccount, on: :create
  
  private
  
  def check_existing_subaccount
    if user_id.present? && Subaccount.exists?(user_id: user_id)
      errors.add(:user_id, 'already has a subaccount')
      throw :abort
    end
  end
end