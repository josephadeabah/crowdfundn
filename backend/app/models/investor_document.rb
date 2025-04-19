# app/models/investor_document.rb
class InvestorDocument < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  DOCUMENT_TYPES = %w[
    accreditation_form 
    id_proof 
    tax_document 
    agreement
    certificate_of_incorporation
    business_registration
    tin_certificate
    company_constitution
    director_shareholder_info
    pitch
    contract
    bank_account_details
    proof_of_address
    founders_id
    licenses_permits
  ].freeze

  validates :document_type, inclusion: { in: DOCUMENT_TYPES }
  has_many_attached :files

  validate :validate_files

  def display_name
    {
      'accreditation_form' => 'Accreditation Form',
      'id_proof' => 'Government ID Proof',
      'tax_document' => 'Tax Document',
      'agreement' => 'Agreement',
      'certificate_of_incorporation' => 'Certificate of Incorporation',
      'business_registration' => 'Business Registration',
      'tin_certificate' => 'TIN Certificate',
      'company_constitution' => 'Company Constitution',
      'director_shareholder_info' => 'Director & Shareholder Info',
      'pitch' => 'Pitch Deck',
      'contract' => 'Contract',
      'bank_account_details' => 'Bank Account Details',
      'proof_of_address' => 'Proof of Address',
      'founders_id' => "Founder's ID",
      'licenses_permits' => 'Licenses & Permits'
    }[document_type] || document_type.titleize
  end

  scope :required, -> { where(document_type: ['accreditation_form', 'id_proof', 'tax_document', 'agreement']) }

  def as_json(options = {})
  {
    id: id,
    user_id: user_id,
    campaign_id: campaign_id,
    document_type: document_type,
    display_name: display_name,
    files: file_metadata,
    created_at: created_at,
    updated_at: updated_at,
    required: required_document?
  }
end

  def file_metadata
    return [] unless files.attached?
    
    files.map do |file|
      {
        url: "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{file.key}",
        filename: file.filename.to_s,
        content_type: file.content_type,
        byte_size: file.byte_size,
        human_size: ActiveSupport::NumberHelper.number_to_human_size(file.byte_size),
        uploaded_at: file.created_at
      }
    end
  end

  def required_document?
    %w[accreditation_form id_proof tax_document agreement].include?(document_type)
  end

  private

  def validate_files
    return unless files.attached?

    files.each do |file|
      if file.blob.byte_size > 100.megabytes
        errors.add(:files, "size must be less than 100MB")
      end

      unless file.content_type == 'application/pdf'
        errors.add(:files, "must be PDF files")
      end
    end
  end
end