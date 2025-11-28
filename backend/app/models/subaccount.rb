# app/models/subaccount.rb
class Subaccount < ApplicationRecord
  belongs_to :user, optional: true
  has_many :transfers, dependent: :nullify

  validates :business_name, presence: true
  validates :account_number, presence: true
  validates :percentage_charge, numericality: { greater_than_or_equal_to: 0 }
  
  validates :user_id, uniqueness: true, allow_nil: false
  validates :subaccount_code, uniqueness: true
  
  before_validation :check_existing_subaccount, on: :create
  
  # Clear recipient code when account details change and delete old recipient from Paystack
  before_save :handle_recipient_code_on_account_change
  
  private
  
  def check_existing_subaccount
    if user_id.present? && Subaccount.exists?(user_id: user_id)
      errors.add(:user_id, 'already has a subaccount')
      throw :abort
    end
  end

  def handle_recipient_code_on_account_change
    # Check if account details changed and we have an existing recipient code
    if (account_number_changed? || bank_code_changed? || settlement_bank_changed?) && recipient_code.present?
      old_recipient_code = self.recipient_code
      
      # Delete old recipient from Paystack
      delete_old_recipient(old_recipient_code)
      
      # Clear recipient code
      self.recipient_code = nil
      
      # Also clear any pending transfers' recipient codes
      transfers.where(recipient_code: old_recipient_code).update_all(recipient_code: nil)
    end
  end

  def delete_old_recipient(recipient_code)
    return if recipient_code.blank?
    
    begin
      paystack_service = PaystackService.new
      response = paystack_service.delete_transfer_recipient(recipient_code)
      
      if response[:status]
        Rails.logger.info "Successfully deleted old recipient #{recipient_code} from Paystack"
      else
        Rails.logger.warn "Failed to delete old recipient #{recipient_code} from Paystack: #{response[:message]}"
      end
    rescue StandardError => e
      Rails.logger.error "Error deleting old recipient #{recipient_code} from Paystack: #{e.message}"
    end
  end
end