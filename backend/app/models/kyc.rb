class Kyc < ApplicationRecord
  belongs_to :user, class_name: '::User'
  belongs_to :verified_by, class_name: 'User', optional: true

  # Associations
  has_many :kyc_documents, dependent: :destroy
  has_many :kyc_addresses, dependent: :destroy
  
  # Add this to accept nested attributes
  accepts_nested_attributes_for :kyc_addresses, allow_destroy: true
  
  # KYC types
  enum :kyc_type, {
    investor: 'investor',
    issuer: 'issuer',
    both: 'both'
  }, default: 'investor', _prefix: :kyc_type

  # Statuses
  enum :status, {
    pending: 'pending',
    in_review: 'in_review',
    verified: 'verified',
    rejected: 'rejected',
    expired: 'expired'
  }, default: 'pending', _prefix: true

  # Verification document types
  enum :verification_type, {
    national_id: 'national_id',
    passport: 'passport',
    drivers_license: 'drivers_license',
    voter_id: 'voter_id'
  }, _prefix: :verification

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
  validates :business_name, 
            presence: true, 
            uniqueness: { 
              case_sensitive: false, 
              message: "has already been taken. Please use a different business name." 
            }, 
            if: -> { issuer? || both? }
  
  validates :business_registration_number, 
            presence: true, 
            uniqueness: { 
              message: "has already been registered. Please check your registration number." 
            }, 
            if: -> { issuer? || both? }
  
  validates :business_tax_id, 
            presence: true, 
            uniqueness: { 
              message: "has already been registered. Please check your tax identification number." 
            }, 
            if: -> { issuer? || both? }

  validate :expiry_date_cannot_be_in_past
  validate :validate_kyc_type_based_on_user
  validate :validate_minimum_age
  validate :validate_business_uniqueness, if: -> { issuer? || both? }

  # Callbacks
  before_validation :generate_kyc_reference, on: :create
  before_validation :set_default_kyc_type, on: :create
  after_save :process_signature, if: -> { 
    (signature_data.present? && saved_change_to_signature_data?) ||
    (investor_signature_data.present? && saved_change_to_investor_signature_data?) ||
    (issuer_signature_data.present? && saved_change_to_issuer_signature_data?) ||
    (signature_data.present? && new_record?) ||
    (investor_signature_data.present? && new_record?) ||
    (issuer_signature_data.present? && new_record?)
  }
  after_create :create_required_documents
  after_update :bust_kyc_stats_cache_if_status_changed, if: :saved_change_to_status?

  # Scopes
  scope :for_investors, -> { where(kyc_type: [:investor, :both]) }
  scope :for_issuers, -> { where(kyc_type: [:issuer, :both]) }
  scope :verified, -> { where(status: :verified) }
  scope :pending_review, -> { where(status: [:pending, :in_review]) }
  scope :needs_review, -> { where(status: [:pending, :in_review]) }

  # Instance methods
  def pending?
    status == 'pending'
  end

  def in_review?
    status == 'in_review'
  end
  
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
    # Use update_columns to skip validations
    update_columns(
      status: :verified,
      verified_at: Time.current,
      verified_by_id: verified_by_user.id,
      review_notes: notes,
      next_review_date: 1.year.from_now,
      updated_at: Time.current
    )
    
    attach_issuer_signature_if_needed
    bust_kyc_stats_cache # Bust the cache after status change
      
    # Return true to indicate success
    true
  end

  def reject!(reason)
    # Use update_columns to skip validations and callbacks
    update_columns(
      status: 'rejected',
      verified_at: nil,
      rejection_reason: reason,
      review_notes: nil,
      updated_at: Time.current
    )
    
    bust_kyc_stats_cache # Bust the cache after status change
    
    # Return true to indicate success
    true
  end

  def process_signature
    Rails.logger.info "=== PROCESS SIGNATURE STARTED ==="
    Rails.logger.info "KYC ID: #{id}"
    Rails.logger.info "signature_data present: #{signature_data.present?}"
    Rails.logger.info "investor_signature_data present: #{investor_signature_data.present?}"
    Rails.logger.info "issuer_signature_data present: #{issuer_signature_data.present?}"
    
    # Process main signature if provided
    if signature_data.present? && (saved_change_to_signature_data? || new_record?)
      Rails.logger.info "Processing signature_data: #{signature_data.first(3).inspect}..."
      process_signature_image(signature_data, :signature_image)
      update_column(:signature_completed_at, Time.current) if signature_image.attached?
    end
    
    # Process investor signature if provided
    if investor_signature_data.present? && (saved_change_to_investor_signature_data? || new_record?)
      Rails.logger.info "Processing investor_signature_data: #{investor_signature_data.first(3).inspect}..."
      process_signature_image(investor_signature_data, :signature_image)
      update_column(:signature_completed_at, Time.current) if signature_image.attached?
    end
    
    # Process issuer signature if provided
    if issuer_signature_data.present? && (saved_change_to_issuer_signature_data? || new_record?)
      Rails.logger.info "Processing issuer_signature_data: #{issuer_signature_data.first(3).inspect}..."
      process_signature_image(issuer_signature_data, :issuer_signature)
      update_column(:issuer_signature_completed_at, Time.current) if issuer_signature.attached?
    end
  end

  def process_signature_image(signature_points, attachment_name)
    return unless signature_points.present?
    
    begin
      # Ensure signature_points is properly formatted
      points = if signature_points.is(a?(String)
                 JSON.parse(signature_points)
               else
                 signature_points
               end
      
      # Convert signature data to image using our service
      image_data = SignatureImageGenerator.generate(points)
      
      # Attach the generated image to Digital Ocean Spaces
      public_send(attachment_name).attach(
        io: StringIO.new(image_data),
        filename: "#{attachment_name}-#{reference}.png",
        content_type: 'image/png'
      )
      
      Rails.logger.info "Successfully processed #{attachment_name} for KYC #{id}"
      
    rescue => e
      Rails.logger.error "Failed to process #{attachment_name} for KYC #{id}: #{e.message}\n#{e.backtrace.join("\n")}"
    end
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

  def validate_business_uniqueness
    existing_kyc = Kyc.where.not(id: id)
                     .where('business_name ILIKE ? OR business_registration_number = ? OR business_tax_id = ?', 
                            business_name, business_registration_number, business_tax_id)
                     .first

    if existing_kyc
      errors.add(:base, "Business details conflict with an existing registration. Please verify your information.")
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
    ['id_front', 'id_back', 'proof_of_address', 'id_document', 'selfie_with_id']
  end

  def issuer_documents
    ['business_registration', 'tax_clearance', 'financial_statements']
  end

  def attach_issuer_signature_if_needed
    return unless (issuer? || both?) && !issuer_signature.attached?

    # Generate issuer signature from signature data if available
    if issuer_signature_data.present?
      signature_image_data = SignatureImageGenerator.generate(
        issuer_signature_data, 
        background_color: 'transparent',
        stroke_color: '2E8B57' # Brand green
      )
      
      issuer_signature.attach(
        io: StringIO.new(signature_image_data),
        filename: "issuer-signature-#{id}.png",
        content_type: 'image/png'
      )
    end
  end

  def bust_kyc_stats_cache
    # Bust all possible KYC stats cache keys
    Rails.cache.delete_matched("kyc_stats_*")
  end

  def bust_kyc_stats_cache_if_status_changed
    bust_kyc_stats_cache if saved_change_to_status?
  end
end