Aws.config.update({
    credentials: Aws::Credentials.new(
      Rails.application.credentials.dig(:digitalocean, :access_key_id),
      Rails.application.credentials.dig(:digitalocean, :secret_access_key)
    ),
    region: 'nyc3', # or your specific region
    endpoint: Rails.application.credentials.dig(:digitalocean, :endpoint),
    bucket: Rails.application.credentials.dig(:digitalocean, :bucket),
    force_path_style: true # Necessary for Spaces
  })
  