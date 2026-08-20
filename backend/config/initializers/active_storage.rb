# config/initializers/active_storage.rb

# Explicitly require the custom Active Storage service
require_relative '../../lib/active_storage/service/supabase_storage_service'

Rails.logger.info "✅ Supabase Storage Service loaded"

Rails.application.config.to_prepare do
  ActiveStorage::PurgeJob.class_eval do
    discard_on ActiveRecord::RecordNotFound
    retry_on ActiveStorage::FileNotFoundError,
             wait: :exponentially_longer,
             attempts: 3

    def perform(blob)
      if blob.service.exist?(blob.key)
        blob.purge
      else
        blob.destroy
      end
    end
  end
end