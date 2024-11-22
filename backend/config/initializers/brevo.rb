# config/initializers/brevo.rb
require 'sib-api-v3-sdk'

# Configure the Brevo API key using environment variables
SibApiV3Sdk.configure do |config|
  config.api_key['api-key'] = ENV['BREVO_API_KEY']  # Ensure this environment variable is set
end
