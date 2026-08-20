# config/initializers/active_storage.rb
# This file ensures the custom Active Storage service is loaded

Rails.application.config.to_prepare do
  # The service will be autoloaded from lib/
  ActiveStorage::Service::SupabaseStorage
rescue NameError
  # If the service isn't loaded yet, require it directly
  require_relative '../../lib/active_storage/service/supabase_storage'
end

# Override the purge job to handle missing files gracefully
Rails.application.config.to_prepare do
  ActiveStorage::PurgeJob.class_eval do
    discard_on ActiveRecord::RecordNotFound
    discard_on Aws::S3::Errors::NoSuchKey if defined?(Aws::S3::Errors::NoSuchKey)
    
    retry_on ActiveStorage::FileNotFoundError, wait: :exponentially_longer, attempts: 3
    
    def perform(blob)
      if blob.service.exist?(blob.key)
        blob.purge
      else
        # If file doesn't exist, just destroy the record
        blob.destroy
      end
    end
  end
end