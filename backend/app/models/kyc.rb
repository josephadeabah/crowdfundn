# app/models/kyc.rb
class Kyc < ApplicationRecord
  belongs_to :user, class_name: '::User'
  belongs_to :verified_by, class_name: 'User', optional: true

  # Associations
  has_many :kyc_documents, dependent: :destroy
  has_many :kyc_addresses, dependent: :destroy
  
  # KYC types - explicitly string-based enum
  enum :kyc_type, {
    investor: 'investor',
    issuer: 'issuer',
    both: 'both'
  }, default: 'investor', _prefix: :kyc_type

  # Statuses - explicitly string-based enum
  enum :status, {
    pending: 'pending',
    in_review: 'in_review',
    verified: 'verified',
    rejected: 'rejected',
    expired: 'expired'
  }, default: 'pending', _prefix: true

  # Verification document types - explicitly string-based enum
  enum :verification_type, {
    national_id: 'national_id',
    passport: 'passport',
    drivers_license: 'drivers_license',
    voter_id: 'voter_id'
  }, _prefix: :verification

  # REMOVED: accepts_nested_attributes_for declarations

  # ActiveStorage attachments
  has_one_attached :id_image
  has_one_attached :address_proof
  has_one_attached :signature_image
  has_one_attached :issuer_signature

  # Validations
  validates :verification_type, presence: true
  validates :id_number, presence: true, uniqueness: true
  validates :id_expiry_date, presence: true
  validates :date_of_birth, presence: true, if: -> { investor? || both? }
  validates :nationality, presence: true, if: -> { investor? || both? }
  validates :occupation, presence: true, if: -> { investor? || both? }
  validates :source_of_funds, presence: true, if: -> { investor? || both? }
  
  # Business validations for issuers
  validates :business_name, presence: true, if: -> { issuer? || both? }
  validates :business_registration_number, presence: true, if: -> { issuer? || both? }
  validates :business_tax_id, presence: true, if: -> { issuer? || both? }

  validate :expiry_date_cannot_be_in_past
  validate :validate_kyc_type_based_on_user
  validate :validate_minimum_age

  # Callbacks
  before_validation :generate_kyc_reference, on: :create
  before_validation :set_default_kyc_type, on: :create
  after_save :process_signature, if: :saved_change_to_signature_data?
  after_create :create_required_documents

  # Scopes
  scope :for_investors, -> { where(kyc_type: [:investor, :both]) }
  scope :for_issuers, -> { where(kyc_type: [:issuer, :both]) }
  scope :verified, -> { where(status: :verified) }
  scope :pending_review, -> { where(status: [:pending, :in_review]) }
  scope :needs_review, -> { where(status: [:pending, :in_review]) }

  # Instance methods
  def verified?
    status == 'verified' && verified_at.present?
  end

  def expired?
    id_expiry_date.past? || (verified_at && verified_at < 1.year.ago)
  end

  def residential_address
    kyc_addresses.find_by(address_type: 'residential')
  end

  def mailing_address
    kyc_addresses.find_by(address_type: 'mailing') || residential_address
  end

  def business_address
    kyc_addresses.find_by(address_type: 'business')
  end

  def verify!(verified_by_user, notes = nil)
    update!(
      status: :verified,
      verified_at: Time.current,
      verified_by: verified_by_user,
      review_notes: notes,
      next_review_date: 1.year.from_now
    )
    attach_issuer_signature_if_needed
  end

  def reject!(reason)
    update!(status: :rejected, verified_at: nil, rejection_reason: reason)
  end

  def signature_image_url
    return unless signature_image.attached?

    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/"\
      "#{Rails.application.credentials.dig(:digitalocean, :bucket)}/"\
      "#{signature_image.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(signature_image, only_path: false)
    end
  rescue => e
    Rails.logger.error "Failed to generate signature URL for KYC #{id}: #{e.message}"
    nil
  end

  def process_signature
    return unless signature_data.present?
    
    begin
      # Convert signature data to image using our service
      image_data = SignatureImageGenerator.generate(signature_data)
      
      # Attach the generated image
      signature_image.attach(
        io: StringIO.new(image_data),
        filename: "signature-#{reference}.png",
        content_type: 'image/png'
      )
    rescue => e
      Rails.logger.error "Failed to process signature: #{e.message}"
      # You might want to add error handling here
    end
  end

  def issuer_signature_url
    return unless issuer_signature.attached?

    if Rails.env.production?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/"\
      "#{Rails.application.credentials.dig(:digitalocean, :bucket)}/"\
      "#{issuer_signature.blob.key}"
    else
      Rails.application.routes.url_helpers.rails_blob_url(issuer_signature, only_path: false)
    end
  rescue => e
    Rails.logger.error "Failed to generate issuer signature URL for KYC #{id}: #{e.message}"
    nil
  end

  def to_frontend_format
    {
      id: id,
      reference: reference,
      kyc_type: kyc_type,
      status: status,
      verification_type: verification_type,
      id_number: id_number,
      id_expiry_date: id_expiry_date,
      date_of_birth: date_of_birth,
      nationality: nationality,
      occupation: occupation,
      source_of_funds: source_of_funds,
      risk_level: risk_level,
      business_name: business_name,
      business_registration_number: business_registration_number,
      business_tax_id: business_tax_id,
      business_industry: business_industry,
      business_established_date: business_established_date,
      addresses: kyc_addresses.map(&:to_frontend_format),
      documents: kyc_documents.map(&:to_frontend_format),
      signature_data: signature_data,
      investor_signature_data: investor_signature_data,
      issuer_accepted_terms: issuer_accepted_terms,
      signature_completed_at: signature_completed_at,
      issuer_signature_completed_at: issuer_signature_completed_at,
      verified_at: verified_at,
      verified_by: verified_by&.full_name,
      rejection_reason: rejection_reason,
      created_at: created_at,
      updated_at: updated_at
    }
  end

  private

  def expiry_date_cannot_be_in_past
    if id_expiry_date.present? && id_expiry_date < Date.today
      errors.add(:id_expiry_date, "can't be in the past")
    end
  end

  def validate_minimum_age
    if date_of_birth.present? && date_of_birth > 18.years.ago.to_date
      errors.add(:date_of_birth, "must be at least 18 years old")
    end
  end

  def generate_kyc_reference
    self.reference ||= "KYC-#{SecureRandom.alphanumeric(10).upcase}"
  end

  def set_default_kyc_type
    return if kyc_type.present?

    if user.investor? && user.campaigns.any?
      self.kyc_type = :both
    elsif user.investor?
      self.kyc_type = :investor
    elsif user.campaigns.any?
      self.kyc_type = :issuer
    end
  end

  def validate_kyc_type_based_on_user
    if issuer? && !user.campaigns.any?
      errors.add(:kyc_type, "cannot be issuer for users without campaigns")
    end
  end

  def create_required_documents
    document_types = if issuer? || both?
      investor_documents + issuer_documents
    else
      investor_documents
    end

    document_types.each do |doc_type|
      kyc_documents.create!(document_type: doc_type)
    end
  end

  def investor_documents
    ['id_front', 'id_back', 'proof_of_address', 'selfie_with_id']
  end

  def issuer_documents
    ['business_registration', 'tax_clearance', 'financial_statements']
  end

  def attach_issuer_signature_if_needed
    return unless (issuer? || both?) && !issuer_signature.attached?

    signature = generate_issuer_signature
    issuer_signature.attach(
      io: StringIO.new(signature),
      filename: "issuer-signature-#{id}.png",
      content_type: 'image/png'
    )
  end

  def generate_issuer_signature
    # This would be your organization's digital signature
    # For now, return a placeholder
    "placeholder_signature_data"
  end
end