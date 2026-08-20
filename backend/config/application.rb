require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    config.api_only = true
    config.active_job.queue_adapter = ENV.fetch("ACTIVE_JOB_ADAPTER", "async").to_sym

    config.active_record.migration_error = :page_load

    # Add services directory to autoload paths
    config.autoload_paths << Rails.root.join('app/services')
    
    # ===== ADD THIS =====
    # Add lib directory to autoload paths for custom services (like Supabase Storage)
    config.autoload_paths << Rails.root.join('lib')
    config.eager_load_paths << Rails.root.join('lib')
    # ===== END ADD =====

    # Autoload lib settings
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end