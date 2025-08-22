# app/jobs/kyc_document_processing_job.rb
class KycDocumentProcessingJob < ApplicationJob
  queue_as :default

  def perform(kyc_document_id)
    document = KycDocument.find(kyc_document_id)
    
    return unless document.file.attached?
    
    # Ensure the file is analyzed
    document.file.blob.analyze if document.file.blob.analyzed?
    
    # Update filename
    document.update_column(:file_name, document.file.filename.to_s)
  end
end