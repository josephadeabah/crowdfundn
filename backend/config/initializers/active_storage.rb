# config/initializers/active_storage.rb
Rails.application.config.to_prepare do
  ActiveStorage::PurgeJob.class_eval do
    discard_on ActiveRecord::RecordNotFound
    discard_on Aws::S3::Errors::NoSuchKey
    
    retry_on Aws::S3::Errors::ServiceError, wait: :exponentially_longer, attempts: 3
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