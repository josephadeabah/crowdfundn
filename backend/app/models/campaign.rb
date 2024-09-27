class Campaign < ApplicationRecord
  belongs_to :fundraiser, class_name: 'User', foreign_key: 'fundraiser_id'
  has_many :updates, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :backers, through: :donations  # assuming a Backer model related to donations
  has_rich_text :description

  validates :title, :description, :goal_amount, :start_date, :end_date, :currency, presence: true
  validates :goal_amount, numericality: { greater_than: 0 }
  validates :current_amount, numericality: { greater_than_or_equal_to: 0 }

  enum status: { active: 0, completed: 1, canceled: 2 }

  # Attachments for images/videos, you can use ActiveStorage or another service
  # has_many_attached :media
  # has_many_attached :media_files

  # Method to return media as a string
  def media_string
    media.present? ? media.split(",").map(&:strip) : []
  end
    # Method to return media file URLs
  # def media_urls
  #   media_files.map { |file| Rails.application.routes.url_helpers.url_for(file) }
  # end
end

class Update < ApplicationRecord
  belongs_to :campaign
  validates :content, presence: true
end

class Comment < ApplicationRecord
  belongs_to :campaign
  belongs_to :user
  validates :content, presence: true
end
