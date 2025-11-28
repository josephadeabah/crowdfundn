# app/models/subaccount.rb
class Subaccount < ApplicationRecord
  belongs_to :user, optional: true
  has_many :transfers, dependent: :nullify

  validates :business_name, presence: true
  validates :account_number, presence: true
  validates :percentage_charge, numericality: { greater_than_or_equal_to: 0 }
  
  # Add these validations to prevent duplicates
  validates :user_id, uniqueness: true, allow_nil: false
  validates :subaccount_code, uniqueness: true
  
  # Prevent duplicate subaccounts for the same user
  before_validation :check_existing_subaccount, on: :create
  
  # Clear recipient code when account details change
  before_save :clear_recipient_code_if_account_changed
  
  private
  
  def check_existing_subaccount
    if user_id.present? && Subaccount.exists?(user_id: user_id)
      errors.add(:user_id, 'already has a subaccount')
      throw :abort
    end
  end

  def clear_recipient_code_if_account_changed
    # Clear recipient code if account number or bank details change
    if (account_number_changed? || bank_code_changed? || settlement_bank_changed?) && recipient_code.present?
      self.recipient_code = nil
      # Also clear any pending transfers' recipient codes
      transfers.where(recipient_code: self.recipient_code_was).update_all(recipient_code: nil)
    end
  end
end