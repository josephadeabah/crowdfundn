# app/models/partner.rb
class Partner < ApplicationRecord
  belongs_to :user
  belongs_to :verified_by, class_name: 'User', optional: true
  has_many :campaign_partnerships
  has_many :campaigns, through: :campaign_partnerships

  before_create :generate_referral_token, :generate_slug

  validates :company_name, presence: true
  validates :niche, presence: true
  validates :user_id, uniqueness: true
  validate :validate_social_media_urls

  enum verification_status: {
    pending: 'pending',
    verified: 'verified',
    rejected: 'rejected',
    suspended: 'suspended'
  }

  scope :verified, -> { where(verification_status: 'verified') }

  def active_partnerships
    campaign_partnerships.where(status: 'accepted')
  end

  # Helper method to get URLs as array
  def social_media_urls_array
    social_media_urls.to_s.split(',').map(&:strip).reject(&:blank?)
  end

  private

  def validate_social_media_urls
    return if social_media_urls.blank?

    invalid_urls = social_media_urls_array.reject do |url|
      url.match?(URI::DEFAULT_PARSER.make_regexp)
    end

    if invalid_urls.any?
      errors.add(:social_media_urls, "contains invalid URLs: #{invalid_urls.join(', ')}")
    end
  end

  def generate_referral_token
    self.referral_token = SecureRandom.hex(10)
  end

  def generate_slug
    self.slug = company_name.parameterize
  end
end