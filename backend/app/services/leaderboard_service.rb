class LeaderboardService
  def self.fetch_weekly_leaderboard(user)
    {
      top_backers: top_backers(last_week: true, user: user),
      most_active_backers: most_active_backers(last_week: true, user: user),
      top_fundraisers: top_fundraisers(last_week: true, user: user)
    }
  end

  def self.top_backers(last_week: false, user: nil)
    donations = Donation.successful.where.not(user_id: nil)
    donations = filter_last_week(donations, table: 'donations') if last_week

    # Optional: Exclude the current user from the leaderboard if needed
    donations = donations.where.not(user_id: user.id) if user

    donations
      .joins(:user)
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
          bio: donation.user.profile&.description
        }
      end
  end

  def self.most_active_backers(last_week: false, user: nil)
    donations = Donation.successful.where.not(user_id: nil)
    donations = filter_last_week(donations, table: 'donations') if last_week

    # Optional: Exclude the current user from the leaderboard if needed
    donations = donations.where.not(user_id: user.id) if user

    donations
      .joins(:user)
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
          bio: donation.user.profile&.description
        }
      end
  end

  def self.top_fundraisers(last_week: false, user: nil)
    campaigns = Campaign.active
    campaigns = filter_last_week(campaigns, table: 'campaigns') if last_week

    # Optional: Exclude campaigns created by the current user if needed
    campaigns = campaigns.where.not(user_id: user.id) if user

    campaigns
      .joins(:fundraiser)
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
          bio: campaign.fundraiser.profile&.description
        }
      end
  end

  private

  def self.filter_last_week(scope, table:)
    scope.where("#{table}.created_at >= ?", 1.week.ago) # Explicitly qualify created_at
  end
end
