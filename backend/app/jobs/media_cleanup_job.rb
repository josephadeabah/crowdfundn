# app/jobs/media_cleanup_job.rb
class MediaCleanupJob < ApplicationJob
  queue_as :default

  discard_on ActiveStorage::FileNotFoundError
  discard_on ActiveRecord::RecordNotFound
  discard_on Aws::S3::Errors::NoSuchKey

  def perform(blob_id)
    blob = ActiveStorage::Blob.find_by(id: blob_id)
    return unless blob

    # First check if file exists
    if blob.service.exist?(blob.key)
      blob.purge
    else
      blob.destroy
    end
  rescue => e
    Rails.logger.error "MediaCleanupJob failed for blob #{blob_id}: #{e.message}"
    raise
  end
end