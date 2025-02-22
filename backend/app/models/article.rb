# app/models/article.rb
class Article < ApplicationRecord
  # Relationships
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  has_rich_text :description
  has_one_attached :featured_image

  # Validations
  validates :title, :slug, :description, presence: true
  validates :slug, uniqueness: true

  # Enums
  enum status: { draft: 0, published: 1, archived: 2 }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? && title.present? }

  # Scopes
  scope :published, -> { where(status: :published) }
  scope :recent, -> { order(published_at: :desc) }

  # Instance Methods
  def to_param
    slug
  end

  # Method to return featured_image URL
  def featured_image_url
    return unless featured_image.attached?

    "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{featured_image.blob.key}"
  end

  # Method to return featured_image filename
  def featured_image_filename
    featured_image.attached? ? featured_image.filename.to_s : nil
  end

  # Custom JSON representation
  def as_json(options = {})
    super(options).merge(
      featured_image: featured_image_url,
      featured_image_filename: featured_image_filename,
      description: description.as_json
    )
  end

  private

  def generate_slug
    self.slug = title.parameterize
  end
end