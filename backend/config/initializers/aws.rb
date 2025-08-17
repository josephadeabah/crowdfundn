Aws.config.update({
                    credentials: Aws::Credentials.new(
                      Rails.application.credentials.dig(:digitalocean, :access_key_id),
                      Rails.application.credentials.dig(:digitalocean, :secret_access_key)
                    ),
                    region: 'nyc3', # or your specific region
                    endpoint: Rails.application.credentials.dig(:digitalocean, :endpoint),
                    force_path_style: true # Necessary for Spaces
                  })

                  # Add retry configuration
Aws.config.update(
  retry_limit: 3, # Default is 3
  retry_base_delay: 0.3 # Default is 0.3 seconds
) rescue nil # Don't fail if AWS config is already set