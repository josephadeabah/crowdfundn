class LeaderboardService
    def self.fetch_weekly_leaderboard(current_user)
      {
        top_backers: fetch_top_backers(last_week: true, current_user: current_user),
        most_active_backers: fetch_most_active_backers(last_week: true, current_user: current_user),
        top_fundraisers: fetch_top_fundraisers(last_week: true, current_user: current_user)
      }
    end
  
    def self.fetch_top_backers(last_week: false, current_user: nil)
      donations = Donation.successful
                         .joins(:user)  # Correct association for joining donations with users
                         .where.not(user_id: nil)
      donations = donations.where('donations.created_at >= ?', 1.week.ago) if last_week
  
      donations
        .group('users.id')
        .select('users.id, users.full_name, SUM(donations.amount) as total_donated')
        .order('total_donated DESC')
        .limit(5)
        .map do |donation|
          {
            name: donation.full_name,
            amount: donation.total_donated,
            category_interest: donation.user.category,
            country: donation.user.country,
            bio: donation.user.profile.description
          }
        end
    end
  
    def self.fetch_most_active_backers(last_week: false, current_user: nil)
      donations = Donation.successful
                         .joins(:user)  # Correct association for joining donations with users
                         .where.not(user_id: nil)
      donations = donations.where('donations.created_at >= ?', 1.week.ago) if last_week
  
      donations
        .group('users.id')
        .select('users.id, users.full_name, COUNT(donations.id) as total_contributions')
        .order('total_contributions DESC')
        .limit(5)
        .map do |donation|
          {
            name: donation.full_name,
            contributions: donation.total_contributions,
            category_interest: donation.user.category,
            country: donation.user.country,
            bio: donation.user.profile.description
          }
        end
    end
  
    def self.fetch_top_fundraisers(last_week: false, current_user: nil)
      campaigns = Campaign.active
                         .joins(:fundraiser)  # Correct association for joining campaigns with fundraisers
      campaigns = campaigns.where('campaigns.created_at >= ?', 1.week.ago) if last_week
  
      campaigns
        .group('users.id')
        .select('users.id, users.full_name, SUM(campaigns.current_amount) as total_raised')
        .order('total_raised DESC')
        .limit(5)
        .map do |campaign|
          {
            name: campaign.full_name,
            total_raised: campaign.total_raised,
            category_interest: campaign.fundraiser.category,
            country: campaign.fundraiser.country,
            bio: campaign.fundraiser.profile.description
          }
        end
    end
end
  