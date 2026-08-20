# config/initializers/active_storage.rb
# This file ensures the custom Active Storage service is loaded

# Explicitly require the custom Active Storage service
require_relative '../../lib/active_storage/service/supabase_storage_service'

Rails.logger.info "✅ Supabase Storage Service loaded"

# Override the purge job to handle missing files gracefully
Rails.application.config.to_prepare do
  ActiveStorage::PurgeJob.class_eval do
    discard_on ActiveRecord::RecordNotFound
    
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