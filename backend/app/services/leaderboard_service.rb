class LeaderboardService
    def self.fetch_weekly_leaderboard
      {
        top_backers: fetch_top_backers(last_week: true),
        most_active_backers: fetch_most_active_backers(last_week: true),
        top_fundraisers: fetch_top_fundraisers(last_week: true)
      }
    end
  
    def self.fetch_top_backers(last_week: false)
      donations = Donation.successful
                         .joins(:user) # Ensure the User model is joined
                         .where.not(user_id: nil) # Filter out donations without a user
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
            category_interest: donation.user.category, # Ensure this field exists in the User model
            country: donation.user.country,
            bio: donation.user.bio
          }
        end
    end
  
    def self.fetch_most_active_backers(last_week: false)
      donations = Donation.successful
                         .joins(:user) # Ensure the User model is joined
                         .where.not(user_id: nil) # Filter out donations without a user
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
            category_interest: donation.user.category, # Ensure this field exists in the User model
            country: donation.user.country,
            bio: donation.user.bio
          }
        end
    end
  
    def self.fetch_top_fundraisers(last_week: false)
      campaigns = Campaign.active
                         .joins(:fundraiser) # Ensure the Fundraiser (User) model is joined
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
            category_interest: campaign.user.category, # Ensure this field exists in the User model
            country: campaign.user.country,
            bio: campaign.user.bio
          }
        end
    end
end