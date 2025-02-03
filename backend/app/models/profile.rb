class Profile < ApplicationRecord
  belongs_to :user # Each profile belongs to a user
  has_one_attached :avatar

  validates :avatar, content_type: %w[image/png image/jpeg] 

  # Validations
  validates :name, presence: true, allow_blank: true
  validates :description, presence: true, allow_blank: true
  validates :funding_goal, numericality: { greater_than: 0 }, presence: true, allow_blank: true
  validates :amount_raised, numericality: { greater_than_or_equal_to: 0 }, presence: true, allow_blank: true
  validates :status, inclusion: { in: %w[active inactive], message: '%<value>s is not a valid status' }
  validates :end_date, presence: true, allow_blank: true
  validates :category, presence: true, allow_blank: true
  validates :location, presence: true, allow_blank: true
  validates :avatar, presence: true, allow_blank: true # Optional, depending on your requirements

  # Method to return avatar URL like the campaign's media_url
  def avatar_url
    if avatar.attached?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{avatar.blob.key}"
    else
      "https://www.svgrepo.com/show/36727/user.svg"
    end
  end
  

  def avatar_filename
    avatar.attached? ? avatar.filename.to_s : nil
  end

  def as_json(options = {})
    super(only: %i[id name description funding_goal amount_raised status end_date category location]).merge(
      avatar: avatar_url,
      avatar_filename: avatar_filename
    )
  end
end