module PaystackWebhook::JsonHelper
  def fix_malformed_json(json_string)
    if json_string.end_with?('"')
      json_string + '"}'
    elsif json_string.end_with?('}')
      json_string
    else
      json_string + '"}'
    end
  rescue => e
    Rails.logger.error "Failed to fix JSON string: #{e.message}"
    json_string
  end
  module_function :fix_malformed_json # This makes it available as both instance and module method
end