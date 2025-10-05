# app/services/admin_action_logger.rb
class AdminActionLogger
  def self.log(user:, action:, target_user:, details: {})
    AdminAction.create!(
      admin_user: user,
      action: action,
      target_user: target_user,
      details: details,
      ip_address: Current.request&.remote_ip,
      user_agent: Current.request&.user_agent
    )
  rescue => e
    Rails.logger.error "Failed to log admin action: #{e.message}"
  end
end