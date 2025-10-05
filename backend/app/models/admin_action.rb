# app/models/admin_action.rb
class AdminAction < ApplicationRecord
  belongs_to :admin_user, class_name: 'User'
  belongs_to :target_user, class_name: 'User'

  validates :action, presence: true

  enum action: {
    lock_transfers: 'lock_transfers',
    unlock_transfers: 'unlock_transfers',
    reset_transferred_amount: 'reset_transferred_amount'
  }
end