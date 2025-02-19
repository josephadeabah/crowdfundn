class Reward < ApplicationRecord
  belongs_to :campaign
  has_one_attached :image
  has_many :donations

  validates :title, :description, :amount, presence: true
  validates :amount, numericality: { greater_than: 0 }

  # Generates the image URL for DigitalOcean Spaces or other storage
  def image_url
    return unless image.attached?

    "#{Rails.application.credentials.dig(:digitalocean,
                                         :endpoint)}/#{Rails.application.credentials.dig(:digitalocean,
                                                                                         :bucket)}/#{image.blob.key}"
  end

  # Return image filename if attached
  def image_filename
    image.attached? ? image.filename.to_s : nil
  end

  # Custom JSON serialization
  def as_json(_options = {})
    super(only: %i[id title description amount]).merge(
      image: image_url, # Return the image URL
      image_filename: image_filename
    )
  end
end
