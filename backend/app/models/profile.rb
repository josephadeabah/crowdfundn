class Profile < ApplicationRecord
  belongs_to :user # Each profile belongs to a user

  # Active Storage attachment for profile photo
  has_one_attached :avatar

  # Validations
  validates :name, presence: true
  validates :description, presence: true
  validates :funding_goal, numericality: { greater_than: 0 }, presence: true
  validates :amount_raised, numericality: { greater_than_or_equal_to: 0 }
  validates :status, inclusion: { in: %w[active inactive], message: '%<value>s is not a valid status' }
  validates :end_date, presence: true, allow_blank: true
  validates :category, presence: true, allow_blank: true
  validates :location, presence: true, allow_blank: true

  # Avatar validations (Optional or Required)
  validates :avatar, attached: true, content_type: ['image/png', 'image/jpg', 'image/jpeg'], size: { less_than: 5.megabytes }

  # Custom validation for avatar file type and size
  validate :avatar_content_type
  validate :avatar_file_size

  # Method to return avatar URL
  def avatar_url
    return nil unless avatar.attached? && avatar.blob.present?

    "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/" \
    "#{Rails.application.credentials.dig(:digitalocean, :bucket)}/" \
    "#{avatar.blob.key}"
  end

  # Ensure avatar URL is included in JSON response
  def as_json(options = {})
    super(options.merge(methods: [:avatar_url]))
  end

  private

  # Validate the content type of the avatar
  def avatar_content_type
    return unless avatar.attached?

    unless avatar.content_type.in?(%w[image/jpeg image/png image/jpg])
      errors.add(:avatar, 'must be a JPEG, PNG, or JPG')
    end
  end

  # Validate the file size of the avatar
  def avatar_file_size
    return unless avatar.attached?

    if avatar.byte_size > 5.megabytes
      errors.add(:avatar, 'should be less than 5MB')
    end
  end
end
