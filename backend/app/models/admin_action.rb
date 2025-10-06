# app/models/admin_action.rb
class AdminAction < ApplicationRecord
  belongs_to :admin_user, class_name: 'User'
  belongs_to :target_user, class_name: 'User'
  belongs_to :campaign, optional: true # Add this association

  validates :action, presence: true

  enum action: {
    lock_transfers: 'lock_transfers',
    unlock_transfers: 'unlock_transfers',
    reset_transferred_amount: 'reset_transferred_amount'
  }

  # Add method to handle campaign-specific reset
  def self.reset_campaign_transfers(admin_user, campaign, reason = nil)
    transaction do
      # Reset the campaign's transferred amount
      campaign.reset_transferred_amount!(admin_user)
      
      # Create the admin action record
      create!(
        admin_user: admin_user,
        target_user: campaign.fundraiser,
        campaign: campaign,
        action: 'reset_transferred_amount',
        metadata: {
          campaign_title: campaign.title,
          amount_reset: campaign.transferred_amount_before_last_save || 0,
          reason: reason
        }
      )
    end
  end
end