# app/services/admin_action_logger.rb
class AdminActionLogger
  def self.log(user:, action:, target_user:, details: {})
    AdminAction.create!(
      admin_user: user,
      target_user: target_user,
      action: action,
      metadata: details
      # Remove ip_address and user_agent if you don't have those columns
    )
  rescue => e
    Rails.logger.error "Failed to log admin action: #{e.message}"
  end
end