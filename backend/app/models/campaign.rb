class Campaign < ApplicationRecord
  belongs_to :fundraiser, class_name: 'User', foreign_key: 'fundraiser_id'
  has_many :rewards, dependent: :destroy
  has_many :updates, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :backers, through: :donations # assuming a Backer model related to donations
  has_many :donations, dependent: :destroy
  has_many :transfers, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :subscribers, through: :subscriptions, source: :user
  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user
  has_many :campaign_shares, dependent: :destroy

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
  attribute :is_public, :boolean, default: true

  # Promotions settings
  attribute :enable_promotions, :boolean, default: false
  attribute :schedule_promotion, :boolean, default: false
  attribute :promotion_frequency, :string, default: 'daily'
  attribute :promotion_duration, :integer, default: 1
  # Attachments for images or videos
  has_one_attached :media # Use `has_many_attached` if there are multiple files

  # before_destroy :cleanup_points
  after_initialize :set_default_status, if: :new_record?
  after_update :send_status_update_webhook, if: :status_changed?
  # Automatically call `update_status_based_on_date` after update
  after_update :update_status_based_on_date, if: -> { remaining_days.zero? && active? }

  # New cancel method
  def cancel
    update!(status: :canceled)
  end

  # Method to update the transferred_amount based on successful donations and previous transferred_amount
  def update_transferred_amount(new_donated_amount)
    # Accumulate the new donated amount with the existing transferred amount
    updated_transferred_amount = transferred_amount + new_donated_amount
    update!(transferred_amount: updated_transferred_amount)
  end

  # Method to return media URL (you can adjust this to return an array for multiple attachments)
  def media_url
    return unless media.attached?

    "#{Rails.application.credentials.dig(:digitalocean,
                                         :endpoint)}/#{Rails.application.credentials.dig(:digitalocean,
                                                                                         :bucket)}/#{media.blob.key}"
  end

  def media_filename
    media.attached? ? media.filename.to_s : nil
  end

  def as_json(options = {})
    super(only: %i[
      id title goal_amount current_amount transferred_amount start_date end_date
      category location currency currency_code currency_symbol status
      fundraiser_id created_at updated_at
    ]).merge(
      media: media_url,
      media_filename: media_filename,
      description: description.as_json,
      total_shares: total_shares,
      donations_over_time: donations_over_time,
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
      },
      rewards: rewards,
      updates: updates,
      comments: comments,
      fundraiser: {
        id: fundraiser.id,
        name: fundraiser.full_name,
        currency: fundraiser.currency,
        currency_symbol: fundraiser.currency_symbol,
        profile: fundraiser.profile
      },
      total_days: total_days,
      remaining_days: remaining_days,
      favorited: options[:user] ? options[:user].favorited_campaigns.include?(self) : false
    )
  end

  def total_days
    return 0 unless start_date && end_date

    (end_date.to_date - start_date.to_date).to_i.clamp(0, Float::INFINITY)
  end

  def remaining_days
    return 0 if canceled?
    return 0 unless end_date

    (end_date.to_date - Date.current).to_i.clamp(0, Float::INFINITY)
  end

  def update_status_based_on_date
    return if canceled? # Skip if already canceled

    update!(status: :completed)
  end

  # Calculate the total number of unique donors (authenticated + anonymous)
  def total_donors
    authenticated_donors = donations.where(status: 'successful').where.not(user_id: nil).distinct.count(:user_id)
    anonymous_donors = donations.where(status: 'successful', user_id: nil).count
    authenticated_donors + anonymous_donors
  end

  def performance_percentage
    return 0 if goal_amount.zero?

    (transferred_amount / goal_amount.to_f * 100).round(2)
  end

  def send_status_update_webhook
    CampaignWebhookService.new(self).send_status_update
  end

  def update_fundraiser_leaderboard
    total_raised = donations.successful.sum(:amount) # Adjust the field name as needed
    FundraiserLeaderboardEntry.update_leaderboard(fundraiser, total_raised)
  end

  def total_shares
    campaign_shares.count
  end

  def donations_over_time
    start_of_campaign = start_date.beginning_of_day
    end_of_campaign = [end_date.end_of_day, Time.zone.now].min # Avoid future dates

    # Fetch successful donations and group them by day
    donations = self.donations
                    .where(status: 'successful', created_at: start_of_campaign..end_of_campaign)
                    .group_by_day(:created_at, format: '%Y-%m-%d')
                    .sum(:amount)

    # Ensure all days in the campaign duration are included
    (start_of_campaign.to_date..end_of_campaign.to_date).each do |date|
      formatted_date = date.strftime('%Y-%m-%d')
      donations[formatted_date] ||= 0
    end

    donations.sort.to_h
  end

  private

  def set_default_status
    self.status ||= :active
  end

  # def cleanup_points
  #   # Delete points associated with donations of this campaign
  #   donations.each do |donation|
  #     donation.points.destroy_all if donation.points.any?
  #   end
  # end
end
