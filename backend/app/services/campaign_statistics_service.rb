# app/services/campaign_statistics_service.rb
class CampaignStatisticsService
  def self.calculate_for_user(user, month = Time.zone.now.month, year = Time.zone.now.year)
    # Combined stats (donations + equity investments)
    total_donated = calculate_total_donations(user)
    total_invested = calculate_total_investments(user)
    total_funds_raised = total_donated + total_invested
    
    total_goal = user.campaigns.sum(:goal_amount) || 0
    total_performance = total_goal.zero? ? 0 : (total_funds_raised / total_goal.to_f * 100).round(2)

    # Equity campaign stats
    equity_campaigns = user.campaigns.where(type: 'EquityCampaign')
    equity_stats = calculate_equity_stats_for_user(user, equity_campaigns)
    
    # Investment stats
    investment_stats = calculate_investment_stats_for_user(user, month, year)

    {
      # Combined metrics (donations + investments)
      total_funds_raised: total_funds_raised,
      total_fundraising_goal: total_goal,
      total_backers: unique_backers_count(user) + unique_investors_count(user),
      total_active_campaigns: user.campaigns.active.count,
      total_donated_amount: user.campaigns.sum(:current_amount) || 0,
      total_transferred_amount: user.campaigns.sum(:transferred_amount) || 0,
      campaign_performance: calculate_campaign_performance_for_user(user),
      new_funding_this_week: new_funding_count_for_user(user),
      campaigns_by_category: campaigns_by_category_for_user(user),
      top_campaigns: top_performing_campaigns_for_user(user),
      average_funding_amount: average_funding_amount_for_user(user),
      total_rewards_claimed: total_rewards_claimed_for_user(user),
      total_campaign_shares: total_campaign_shares_for_user(user),
      total_comments: total_comments_for_user(user),
      total_updates: total_updates_for_user(user),
      total_favorites: total_favorites_for_user(user),
      funding_over_time: funding_over_time_for_user(user, month, year),
      funding_by_country: funding_by_country_for_user(user, month, year),
      total_performance_percentage: total_performance,
      
      # Separate breakdowns
      donations: {
        total_amount: total_donated,
        count: successful_donations_count(user),
        average_amount: average_donation_amount(user)
      },
      investments: {
        total_amount: total_invested,
        count: successful_investments_count(user),
        average_amount: average_investment_amount(user)
      },
      
      # New equity and investment metrics
      equity_campaigns: equity_stats,
      investments_detail: investment_stats
    }
  end

  # Combined calculations (donations + investments)
  def self.calculate_total_donations(user)
    user.campaigns.joins(:donations)
        .where(donations: { status: 'successful' })
        .sum('donations.amount') || 0
  end

  def self.calculate_total_investments(user)
    # Use EquityCampaign class directly instead of scoping Campaign
    EquityCampaign.where(fundraiser_id: user.id)
                  .joins(:equity_investments)
                  .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL })
                  .sum('equity_investments.current_amount') || 0
  end

  def self.unique_backers_count(user)
    # Donors
    donor_count = user.campaigns.joins(:donations)
                      .where(donations: { status: 'successful' })
                      .distinct.count('donations.user_id') + 
                 user.campaigns.joins(:donations)
                      .where(donations: { status: 'successful', user_id: nil })
                      .count
    donor_count
  end

  def self.unique_investors_count(user)
    # Investors - use EquityCampaign class directly
    investor_count = EquityCampaign.where(fundraiser_id: user.id)
                         .joins(:equity_investments)
                         .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL })
                         .distinct.count('equity_investments.user_id') + 
                    EquityCampaign.where(fundraiser_id: user.id)
                         .joins(:equity_investments)
                         .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL, user_id: nil })
                         .count
    investor_count
  end

  def self.new_funding_count_for_user(user)
    start_of_week = Time.zone.now.beginning_of_week
    
    # Donations this week
    donations_count = user.campaigns.joins(:donations)
                          .where('donations.created_at >= ? AND donations.status = ?', start_of_week, 'successful')
                          .group(:campaign_id)
                          .count
    
    # Investments this week - use EquityCampaign class directly
    investments_count = EquityCampaign.where(fundraiser_id: user.id)
                            .joins(:equity_investments)
                            .where('equity_investments.created_at >= ? AND equity_investments.status = ?', 
                                   start_of_week, EquityInvestment::STATUS_SUCCESSFUL)
                            .group(:campaign_id)
                            .count
    
    # Merge counts
    donations_count.merge(investments_count) { |_key, donations, investments| donations + investments }
  end

  def self.average_funding_amount_for_user(user)
    total_donations = calculate_total_donations(user)
    total_investments = calculate_total_investments(user)
    total_funding = total_donations + total_investments
    total_count = successful_donations_count(user) + successful_investments_count(user)
    
    total_count.zero? ? 0 : (total_funding / total_count.to_f).round(2)
  end

  def self.funding_over_time_for_user(user, month = Time.zone.now.month, year = Time.zone.now.year)
    start_date = Date.new(year, month, 1).beginning_of_month
    end_date = Date.new(year, month, 1).end_of_month

    # Donations over time
    donations = user.campaigns.joins(:donations)
                    .where(donations: { status: 'successful', created_at: start_date..end_date })
                    .group_by_day('donations.created_at')
                    .sum('donations.amount')

    # Investments over time - use EquityCampaign class directly
    investments = EquityCampaign.where(fundraiser_id: user.id)
                      .joins(:equity_investments)
                      .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL, created_at: start_date..end_date })
                      .group_by_day('equity_investments.created_at')
                      .sum('equity_investments.amount')

    # Combine donations and investments
    combined_funding = donations.merge(investments) { |_key, donation_amount, investment_amount| donation_amount + investment_amount }

    # Ensure all days in the range are included with proper date format
    result = {}
    (start_date.to_date..end_date.to_date).each do |date|
      formatted_date = date.strftime('%Y-%m-%d')
      result[formatted_date] = combined_funding[date] || 0
    end

    result
  end

  def self.funding_by_country_for_user(user, month, year)
    start_date = Date.new(year, month, 1).beginning_of_month
    end_date = Date.new(year, month, 1).end_of_month

    # Donations by country
    donations_by_country = user.campaigns.joins(:donations)
                               .where(donations: { status: 'successful', created_at: start_date..end_date })
                               .group('donations.country')
                               .sum('donations.amount')

    # Investments by country - use EquityCampaign class directly
    investments_by_country = EquityCampaign.where(fundraiser_id: user.id)
                                 .joins(:equity_investments)
                                 .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL, created_at: start_date..end_date })
                                 .group('equity_investments.country')
                                 .sum('equity_investments.amount')

    # Combine donations and investments
    combined = {}
    
    # Process donations
    donations_by_country.each do |country, amount|
      country_name = country.presence || 'Unknown'
      combined[country_name] = (combined[country_name] || 0) + amount
    end

    # Process investments
    investments_by_country.each do |country, amount|
      country_name = country.presence || 'Unknown'
      combined[country_name] = (combined[country_name] || 0) + amount
    end

    combined
  end

  # Individual calculations for breakdown
  def self.successful_donations_count(user)
    user.campaigns.joins(:donations).where(donations: { status: 'successful' }).count
  end

  def self.successful_investments_count(user)
    # Only count investments from equity campaigns - use EquityCampaign class directly
    EquityCampaign.where(fundraiser_id: user.id)
        .joins(:equity_investments)
        .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL })
        .count
  end

  def self.average_donation_amount(user)
    donations = user.campaigns.joins(:donations)
                    .where(donations: { status: 'successful' })
                    .average('donations.amount')
    donations&.to_f&.round(2) || 0.0
  end

  def self.average_investment_amount(user)
    # Only average investments from equity campaigns - use EquityCampaign class directly
    investments = EquityCampaign.where(fundraiser_id: user.id)
                      .joins(:equity_investments)
                      .where(equity_investments: { status: EquityInvestment::STATUS_SUCCESSFUL })
                      .average('equity_investments.amount')
    investments&.to_f&.round(2) || 0.0
  end

  # Existing methods (unchanged)
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

  def self.campaigns_by_category_for_user(user)
    user.campaigns.group(:category).count
  end

  def self.top_performing_campaigns_for_user(user)
    user.campaigns.order(Arel.sql('(COALESCE(current_amount, 0) + COALESCE(total_equity_invested, 0)) / goal_amount DESC'))
        .limit(5).map do |campaign|
      {
        id: campaign.id,
        title: campaign.title,
        performance_percentage: campaign.performance_percentage,
        total_days: campaign.total_days,
        remaining_days: campaign.remaining_days,
        total_raised: (campaign.current_amount.to_f + campaign.total_equity_invested.to_f).round(2)
      }
    end
  end

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

  private

  def self.calculate_equity_stats_for_user(user, equity_campaigns)
    {
      total: equity_campaigns.count,
      active: equity_campaigns.where(equity_status: :live).count,
      total_valuation: equity_campaigns.sum(:valuation).to_f.round(2),
      total_equity_offered: equity_campaigns.sum(:equity_offered).to_f.round(2),
      total_funds_raised: equity_campaigns.sum(:total_equity_invested).to_f.round(2),
      average_valuation: equity_campaigns.average(:valuation).to_f.round(2),
      average_equity_offered: equity_campaigns.average(:equity_offered).to_f.round(2),
      status_distribution: equity_campaigns.group(:equity_status).count,
      top_performing: equity_campaigns.order(total_equity_invested: :desc).limit(5).map do |ec|
        {
          id: ec.id,
          name: ec.title,
          company_name: ec.company_name,
          valuation: ec.valuation,
          equity_offered: ec.equity_offered,
          total_raised: ec.total_equity_invested,
          percentage_raised: ec.percentage_raised,
          status: ec.equity_status
        }
      end
    }
  end

  def self.calculate_investment_stats_for_user(user, month, year)
    # Get investments in user's equity campaigns
    user_equity_campaign_ids = user.campaigns.where(type: 'EquityCampaign').pluck(:id)
    investments = EquityInvestment.where(campaign_id: user_equity_campaign_ids)
    successful_investments = investments.successful
    
    start_date = Date.new(year, month, 1).beginning_of_month
    end_date = Date.new(year, month, 1).end_of_month
    
    monthly_investments = successful_investments.where(created_at: start_date..end_date)

    {
      total_investments: investments.count,
      successful_investments: successful_investments.count,
      total_investment_amount: successful_investments.sum(:amount).to_f.round(2),
      average_investment: successful_investments.average(:amount).to_f.round(2),
      investments_over_time: monthly_investments.group_by_day(:created_at, format: '%Y-%m-%d').sum(:amount).sort.reverse.to_h,
      status_distribution: investments.group(:status).count,
      top_investors: calculate_top_investors_for_user_campaigns(user_equity_campaign_ids),
      investment_size_distribution: {
        small: successful_investments.where('amount < ?', 1000).count,
        medium: successful_investments.where('amount >= ? AND amount < ?', 1000, 10000).count,
        large: successful_investments.where('amount >= ?', 10000).count
      },
      monthly_performance: {
        total_amount: monthly_investments.sum(:amount).to_f.round(2),
        investment_count: monthly_investments.count,
        average_investment: monthly_investments.average(:amount).to_f.round(2)
      }
    }
  end

  def self.calculate_top_investors_for_user_campaigns(campaign_ids)
    EquityInvestment.joins(:user, :campaign)
                    .where(campaign_id: campaign_ids, status: EquityInvestment::STATUS_SUCCESSFUL)
                    .group('users.id', 'users.full_name')
                    .select('users.id, users.full_name, COUNT(equity_investments.id) as investment_count, SUM(equity_investments.amount) as total_invested')
                    .order('total_invested DESC')
                    .limit(10)
                    .map do |result|
                      {
                        id: result.id,
                        name: result.full_name,
                        investment_count: result.investment_count,
                        total_invested: result.total_invested.to_f.round(2)
                      }
                    end
  end
end