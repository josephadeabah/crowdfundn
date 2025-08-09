class Kyc < ApplicationRecord
  belongs_to :user, class_name: '::User'
  belongs_to :verified_by, class_name: '::User', optional: true

  # KYC types
  enum kyc_type: {
    investor: 'investor',
    issuer: 'issuer',
    both: 'both'
  }, default: :investor

  # Statuses
  enum status: {
    pending: 'pending',
    verified: 'verified',
    rejected: 'rejected',
    expired: 'expired'
  }, default: :pending

  # Verification document types
  enum verification_type: {
    national_id: 'national_id',
    passport: 'passport',
    drivers_license: 'drivers_license',
    voter_id: 'voter_id'
  }

  # ActiveStorage attachments
  has_one_attached :id_image
  has_one_attached :address_proof
  has_one_attached :signature_image
  has_one_attached :issuer_signature

  # Validations
  validates :verification_type, presence: true
  validates :id_number, presence: true, uniqueness: true
  validates :id_expiry_date, presence: true
  validate :expiry_date_cannot_be_in_past
  validate :validate_kyc_type_based_on_user

  # Callbacks
  before_validation :generate_kyc_reference, on: :create
  before_validation :set_default_kyc_type, on: :create
  after_save :process_signature, if: :saved_change_to_signature_data?

  # Scopes
  scope :for_investors, -> { where(kyc_type: [:investor, :both]) }
  scope :for_issuers, -> { where(kyc_type: [:issuer, :both]) }
  scope :verified, -> { where(status: :verified) }
  scope :pending_review, -> { where(status: :pending) }

  def verified?
    status == 'verified' && verified_at.present?
  end

  def expired?
    id_expiry_date.past?
  end

  def verify!(verified_by_user)
    update!(
      status: :verified,
      verified_at: Time.current,
      verified_by: verified_by_user
    )
    attach_issuer_signature_if_needed
  end

  def reject!
    update!(status: :rejected, verified_at: nil)
  end

  def signature_image_url
    return unless signature_image.attached?
    Rails.application.routes.url_helpers.url_for(signature_image)
  end

  def issuer_signature_url
    return unless issuer_signature.attached?
    Rails.application.routes.url_helpers.url_for(issuer_signature)
  end

  private

  def expiry_date_cannot_be_in_past
    if id_expiry_date.present? && id_expiry_date < Date.today
      errors.add(:id_expiry_date, "can't be in the past")
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

  def process_signature
    return unless signature_data.present?

    image_data = SignatureImageGenerator.generate(signature_data)
    signature_image.attach(
      io: StringIO.new(image_data),
      filename: "signature-#{reference}.png",
      content_type: 'image/png'
    )
  rescue => e
    Rails.logger.error "Failed to process signature: #{e.message}"
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
    # Could be generated or loaded from a file
    SignatureImageGenerator.generate_issuer_signature
  end
end