class Transfer < ApplicationRecord
    # Validations
    validates :transfer_code, presence: true, uniqueness: true
    validates :recipient_code, presence: true
    validates :amount, presence: true, numericality: { greater_than: 0 }
  
    # Statuses
    enum status: { pending: 'pending', success: 'success', failed: 'failed', reversed: 'reversed' }
  
    # Associations
    belongs_to :user
    belongs_to :campaign
    
  
    # Callbacks (Optional)
    before_save :log_status_change
  
    private
  
    def log_status_change
      if status_changed?
        Rails.logger.info "Transfer #{transfer_code} status changed to #{status}"
      end
    end
end
  