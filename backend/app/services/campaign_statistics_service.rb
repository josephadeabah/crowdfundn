class CampaignStatisticsService
  def self.calculate_for_user(user)
    total_donated = user.campaigns.joins(:donations).where(donations: { status: 'successful' }).sum('donations.amount')
    total_goal = user.campaigns.sum(:goal_amount)
    total_performance = total_goal.zero? ? 0 : (total_donated / total_goal.to_f * 100).round(2)
    {
      total_donations_received: total_donated,
      total_fundraising_goal: user.campaigns.sum(:goal_amount),
      total_backers: unique_backers_count(user),
      total_active_campaigns: user.campaigns.active.count,
      total_donated_amount: user.campaigns.sum(:current_amount),
      campaign_performance: calculate_campaign_performance_for_user(user),
      new_donations_this_week: new_donations_count_for_user(user),
      campaigns_by_category: campaigns_by_category_for_user(user),
      top_campaigns: top_performing_campaigns_for_user(user),
      average_donation_amount: average_donation_amount_for_user(user),
      total_rewards_claimed: total_rewards_claimed_for_user(user),
      total_campaign_shares: total_campaign_shares_for_user(user),
      total_comments: total_comments_for_user(user),
      total_updates: total_updates_for_user(user),
      total_favorites: total_favorites_for_user(user),
      donations_over_time: donations_over_time_for_user(user), # Defaults to :day
      total_performance_percentage: total_performance
    }
  end

  def self.unique_backers_count(user)
    user.campaigns.joins(:donations)
                 .where(donations: { status: 'successful' })
                 .distinct.count('donations.user_id') + user.campaigns.joins(:donations)
                                                          .where(donations: { status: 'successful', user_id: nil })
                                                          .count
  end

  def self.calculate_campaign_performance_for_user(user)
    user.campaigns.map do |campaign|
      {
        id: campaign.id,
        title: campaign.title,
        performance_percentage: campaign.performance_percentage,
        total_days: campaign.total_days,
        remaining_days: campaign.remaining_days
      }
    end
  end

  def self.new_donations_count_for_user(user)
    start_of_week = Time.zone.now.beginning_of_week
    user.campaigns.joins(:donations)
                 .where('donations.created_at >= ?', start_of_week)
                 .group(:campaign_id)
                 .count
  end

  def self.campaigns_by_category_for_user(user)
    user.campaigns.group(:category).count
  end

  def self.top_performing_campaigns_for_user(user)
    user.campaigns.order(Arel.sql('transferred_amount / goal_amount DESC')).limit(5).map do |campaign|
      {
        id: campaign.id,
        title: campaign.title,
        performance_percentage: campaign.performance_percentage,
        total_days: campaign.total_days,
        remaining_days: campaign.remaining_days
      }
    end
  end

  def self.average_donation_amount_for_user(user)
    user.campaigns.joins(:donations)
                 .where(donations: { status: 'successful' })
                 .average(:amount)&.to_f || 0.0
  end

  # New Metrics

  def self.total_rewards_claimed_for_user(user)
    user.backer_rewards.count
  end

  def self.total_campaign_shares_for_user(user)
    user.campaigns.joins(:campaign_shares).count
  end

  def self.total_comments_for_user(user)
    user.campaigns.joins(:comments).count
  end

  def self.total_updates_for_user(user)
    user.campaigns.joins(:updates).count
  end

  def self.total_favorites_for_user(user)
    user.campaigns.joins(:favorites).count
  end

  def self.donations_over_time_for_user(user, period = :day)
    user.campaigns.joins(:donations)
                 .where(donations: { status: 'successful' })
                 .group_by_period(period, 'donations.created_at')
                 .sum('donations.amount')
  end
end