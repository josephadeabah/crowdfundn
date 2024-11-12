require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Add services directory to autoload paths
    config.autoload_paths << Rails.root.join('app/services')

    # Autoload lib settings
    config.autoload_lib(ignore: %w[assets tasks])

    # CORS configuration
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'https://www.bantuhive.com',            # Replace with your production Next.js URL
                'http://localhost:3000',                         # Local development for Next.js
                'https://bantuhive-api-dicht.ondigitalocean.app' # Rails API on DigitalOcean

        resource '*',
                 headers: :any,
                 methods: [:get, :post, :put, :patch, :delete, :options, :head],
                 expose: ['Authorization']
      end
    end

    # Configuration for the application, engines, and railties goes here.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
