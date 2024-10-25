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

  # Permissions settings
  attribute :accept_donations, :boolean, default: true
  attribute :leave_words_of_support, :boolean, default: true
  attribute :appear_in_search_results, :boolean, default: true
  attribute :suggested_fundraiser_lists, :boolean, default: true
  attribute :receive_donation_email, :boolean, default: true
  attribute :receive_daily_summary, :boolean, default: false
  attribute :is_public, :boolean, default: false

  # Promotions settings
  attribute :enable_promotions, :boolean, default: false
  attribute :schedule_promotion, :boolean, default: false
  attribute :promotion_frequency, :string, default: 'daily'
  attribute :promotion_duration, :integer, default: 1
  

  # Attachments for images or videos
  has_one_attached :media # Use `has_many_attached` if there are multiple files

  # Method to return media URL (you can adjust this to return an array for multiple attachments)
  def media_url
    if media.attached?
      "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{media.blob.key}"
    else
      nil
    end
  end
  
  

  def media_filename
    media.attached? ? media.filename.to_s : nil
  end

  def as_json(options = {})
    super(only: [
      :id, :title, :goal_amount, :current_amount, :start_date, :end_date,
      :category, :location, :currency, :currency_code, :currency_symbol, :status,
      :fundraiser_id, :created_at, :updated_at
    ]).merge(
      media: media_url,  # Returning the media URL
      media_filename: media_filename,
      description: description.as_json,
      permissions: {
        accept_donations: accept_donations,
        leave_words_of_support: leave_words_of_support,
        appear_in_search_results: appear_in_search_results,
        suggested_fundraiser_lists: suggested_fundraiser_lists,
        receive_donation_email: receive_donation_email,
        receive_daily_summary: receive_daily_summary,
        is_public: is_public
      },
      promotions: {
        enable_promotions: enable_promotions,
        schedule_promotion: schedule_promotion,
        promotion_frequency: promotion_frequency,
        promotion_duration: promotion_duration
      }
    )
  end
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
