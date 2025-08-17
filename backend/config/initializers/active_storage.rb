# config/initializers/active_storage.rb
Rails.application.config.to_prepare do
  # Make purge job more resilient
  ActiveStorage::PurgeJob.class_eval do
    discard_on ActiveRecord::RecordNotFound
    discard_on Aws::S3::Errors::NoSuchKey
    
    retry_on Aws::S3::Errors::ServiceError, wait: 5.seconds, attempts: 3
    
    def perform(blob)
      blob.purge if blob.service.exist?(blob.key)
    rescue Aws::S3::Errors::NoSuchKey
      blob.destroy
    end
  end
end