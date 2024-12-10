class CampaignStatisticsService
    def self.calculate_for_user(user)
      total_donated = user.campaigns.joins(:donations).where(donations: { status: 'successful' }).sum('donations.amount')
      {
        total_donations_received: total_donated,
        total_backers: unique_backers_count(user),
        total_active_campaigns: user.campaigns.active.count,
        total_donated_amount: total_donated,
        campaign_performance: calculate_campaign_performance_for_user(user),
        new_donations_this_week: new_donations_count_for_user(user),
        campaigns_by_category: campaigns_by_category_for_user(user),
        top_campaigns: top_performing_campaigns_for_user(user),
        average_donation_amount: average_donation_amount_for_user(user)
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
      user.campaigns.order(Arel.sql('current_amount / goal_amount DESC')).limit(5).map do |campaign|
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
end
  