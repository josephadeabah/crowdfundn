Aws.config.update({
    credentials: Aws::Credentials.new(
      Rails.application.credentials.dig(:digitalocean, :access_key_id),
      Rails.application.credentials.dig(:digitalocean, :secret_access_key)
    ),
    region: 'nyc3', # or the appropriate region for your setup
    endpoint: Rails.application.credentials.dig(:digitalocean, :endpoint)
  })
  