module Api
  module V1
    module Metrics
      class MetricsController < ApplicationController
        def dashboard
          # Calculate combined platform fees
          total_platform_fees = calculate_total_platform_fees
          
          # Calculate combined donations metrics
          combined_donations_metrics = calculate_combined_donations_metrics
          
          # Calculate combined equity metrics
          combined_equity_metrics = calculate_combined_equity_metrics

          # Safely calculate combined metrics with nil protection
          total_raised = (combined_donations_metrics[:total_raised] || 0) + (combined_equity_metrics[:total_raised] || 0)
          
          total_count = (combined_donations_metrics[:donations][:total_count] || 0) + 
                       (combined_equity_metrics[:equity][:total_count] || 0)
          
          total_amount = (combined_donations_metrics[:donations][:total_amount] || 0) + 
                        (combined_equity_metrics[:equity][:total_investment_amount] || 0)
          
          average_contribution = total_count > 0 ? (total_amount / total_count).round(2) : 0

          # Calculate premium subscription metrics
          premium_metrics = calculate_premium_metrics

          # NEW: Calculate contribution statistics
          contribution_stats = calculate_contribution_statistics

          # NEW: Calculate investment clubs statistics
          investment_clubs_stats = calculate_investment_clubs_statistics

          # NEW: Calculate club investment statistics
          club_investment_stats = calculate_club_investment_statistics

          # NEW: Calculate voting statistics
          voting_stats = calculate_voting_statistics

          # NEW: Calculate member share statistics
          member_share_stats = calculate_member_share_statistics

          metrics = {
            users: {
              total: User.count,
              new_last_week: User.where('created_at >= ?', 7.days.ago).count,
              active: User.where('last_sign_in_at >= ?', 7.days.ago).count,
              email_confirmation_rate: calculate_email_confirmation_rate,
              premium_users: User.where(premium_access: true).count
            },
            campaigns: {
              total: Campaign.count,
              active: Campaign.where(status: 'active').count,
              average_goal_amount: Campaign.average(:goal_amount).to_f.round(2),
              average_current_amount: Campaign.average(:transferred_amount).to_f.round(2),
              performance_percentage: Campaign.average('(transferred_amount / NULLIF(goal_amount, 0)) * 100').to_f.round(2),
              top_performing: Campaign.order(transferred_amount: :desc).limit(6).map do |c|
                {
                  id: c.id,
                  name: c.title,
                  transferred_amount: c.transferred_amount,
                  goal_amount: c.goal_amount,
                  performance_percentage: c.goal_amount > 0 ? ((c.transferred_amount / c.goal_amount) * 100).round(2) : 0
                }
              end
            },
            donations: combined_donations_metrics[:donations],
            equity: combined_equity_metrics[:equity],
            combined: {
              total_raised: total_raised,
              average_contribution: average_contribution,
              platform_fees: total_platform_fees
            },
            platform_fees: total_platform_fees,
            roles: Role.joins(:users).group(:name).count,
            # FIXED: Use premium subscription metrics instead of general subscriptions
            premium_subscriptions: premium_metrics,
            geography: {
              users_by_country: User.group(:country).count,
              top_countries_by_donations: calculate_top_countries_by_donations
            },
            engagement: {
              average_logins: User.average(:sign_in_count).to_f.round(2),
              time_to_first_action: calculate_time_to_first_action
            },
            subaccounts: {
              total: Subaccount.count,
              success_rate: calculate_subaccount_success_rate
            },
            equity_campaigns: equity_campaign_metrics,
            investments: investment_metrics,
            # NEW: Contribution statistics
            contribution_statistics: contribution_stats,
            # NEW: Investment clubs statistics
            investment_clubs_statistics: investment_clubs_stats,
            # NEW: Club investment statistics
            club_investment_statistics: club_investment_stats,
            # NEW: Voting statistics
            voting_statistics: voting_stats,
            # NEW: Member share statistics
            member_share_statistics: member_share_stats
          }

          render json: metrics, status: :ok
        end

        private

        # NEW: Calculate comprehensive contribution statistics
        def calculate_contribution_statistics
          contributions = InvestmentClubContribution.all
          completed_contributions = contributions.completed
          
          total_amount = completed_contributions.sum(:amount) || 0
          total_count = completed_contributions.count
          average_contribution = total_count > 0 ? (total_amount / total_count).round(2) : 0

          # Contribution trends over time
          contributions_over_time = completed_contributions
            .group_by_week(:created_at, format: '%Y-%m-%d')
            .sum(:amount)

          # Top contributors - FIXED: Use correct association
          top_contributors = InvestmentClubContribution
            .completed
            .joins(:user)
            .group('users.id', 'users.full_name')
            .select('users.id, users.full_name, COUNT(investment_club_contributions.id) as contribution_count, SUM(investment_club_contributions.amount) as total_contributed')
            .order('total_contributed DESC')
            .limit(10)
            .map do |record|
              {
                id: record.id,
                name: record.full_name,
                contribution_count: record.contribution_count,
                total_contributed: record.total_contributed.to_f.round(2)
              }
            end

          # Contribution status distribution
          status_distribution = contributions.group(:status).count

          # Monthly contribution trends
          monthly_contributions = completed_contributions
            .group_by_month(:created_at, format: '%Y-%m')
            .sum(:amount)

          {
            total_contributions: total_count,
            total_amount: total_amount.to_f.round(2),
            average_contribution: average_contribution,
            contributions_over_time: contributions_over_time,
            monthly_contributions: monthly_contributions,
            status_distribution: status_distribution,
            top_contributors: top_contributors,
            contribution_size_distribution: {
              small: completed_contributions.where('amount < ?', 100).count,
              medium: completed_contributions.where('amount >= ? AND amount < ?', 100, 1000).count,
              large: completed_contributions.where('amount >= ?', 1000).count
            },
            recent_contributions: completed_contributions
                                  .order(created_at: :desc)
                                  .limit(10)
                                  .map do |contribution|
                                    {
                                      id: contribution.id,
                                      amount: contribution.amount.to_f.round(2),
                                      user_name: contribution.user&.full_name || 'Unknown User',
                                      club_name: contribution.investment_club&.name || 'Unknown Club',
                                      created_at: contribution.created_at
                                    }
                                  end
          }
        end

        # NEW: Calculate investment clubs statistics
        def calculate_investment_clubs_statistics
          clubs = InvestmentClub.all
          active_clubs = clubs.active
          
          total_members = InvestmentClubMembership.active.count
          average_members_per_club = clubs.count > 0 ? (total_members.to_f / clubs.count).round(2) : 0

          # Club financial metrics
          total_club_contributions = clubs.sum(:total_contributions) || 0
          total_club_balance = clubs.sum(:current_balance) || 0
          total_club_invested = clubs.sum(:total_invested) || 0

          # Club type distribution
          club_type_distribution = clubs.group(:access_type).count

          # Member activity metrics
          active_memberships = InvestmentClubMembership.active
          membership_role_distribution = active_memberships.group(:role).count

          # Top clubs by contributions
          top_clubs_by_contributions = clubs
            .order(total_contributions: :desc)
            .limit(10)
            .map do |club|
              {
                id: club.id,
                name: club.name,
                total_contributions: club.total_contributions.to_f.round(2),
                current_balance: club.current_balance.to_f.round(2),
                total_invested: club.total_invested.to_f.round(2),
                member_count: club.current_members_count,
                club_type: club.club_type
              }
            end

          # Club growth trends
          clubs_created_over_time = clubs.group_by_week(:created_at, format: '%Y-%m-%d').count

          {
            total_clubs: clubs.count,
            active_clubs: active_clubs.count,
            total_members: total_members,
            average_members_per_club: average_members_per_club,
            total_club_contributions: total_club_contributions.to_f.round(2),
            total_club_balance: total_club_balance.to_f.round(2),
            total_club_invested: total_club_invested.to_f.round(2),
            club_type_distribution: club_type_distribution,
            membership_role_distribution: membership_role_distribution,
            top_clubs_by_contributions: top_clubs_by_contributions,
            clubs_created_over_time: clubs_created_over_time,
            financial_metrics: {
              average_contribution_per_club: clubs.count > 0 ? (total_club_contributions / clubs.count).round(2) : 0,
              average_balance_per_club: clubs.count > 0 ? (total_club_balance / clubs.count).round(2) : 0,
              average_invested_per_club: clubs.count > 0 ? (total_club_invested / clubs.count).round(2) : 0,
              investment_ratio: total_club_contributions > 0 ? ((total_club_invested / total_club_contributions) * 100).round(2) : 0
            }
          }
        end

        # NEW: Calculate club investment statistics
        def calculate_club_investment_statistics
          club_investments = ClubInvestment.all
          successful_investments = club_investments.where(status: 'successful')
          
          total_investment_amount = successful_investments.sum(:investment_amount) || 0
          total_investment_count = successful_investments.count
          average_investment = total_investment_count > 0 ? (total_investment_amount / total_investment_count).round(2) : 0

          # Investment trends
          investments_over_time = successful_investments
            .group_by_week(:created_at, format: '%Y-%m-%d')
            .sum(:investment_amount)

          # Status distribution
          status_distribution = club_investments.group(:status).count

          # Top club investments
          top_investments = successful_investments
            .joins(:investment_club, :campaign)
            .order(investment_amount: :desc)
            .limit(10)
            .map do |investment|
              {
                id: investment.id,
                club_name: investment.investment_club&.name || 'Unknown Club',
                campaign_name: investment.campaign&.title || 'Unknown Campaign',
                investment_amount: investment.investment_amount.to_f.round(2),
                status: investment.status,
                created_at: investment.created_at
              }
            end

          # Investment by club type
          investment_by_club_type = ClubInvestment
            .joins(:investment_club)
            .group('investment_clubs.access_type')
            .sum(:investment_amount)

          # ROI metrics for equity investments
          equity_investments = successful_investments
            .joins(:campaign)
            .where(campaigns: { type: 'EquityCampaign' })

          total_equity_invested = equity_investments.sum(:investment_amount) || 0
          
          # Calculate current value for equity investments
          equity_investments_with_value = equity_investments.map do |inv|
            current_val = inv.respond_to?(:current_value) ? inv.current_value : inv.investment_amount
            roi_val = inv.respond_to?(:roi) ? inv.roi : 0
            {
              investment_amount: inv.investment_amount,
              current_value: current_val || inv.investment_amount,
              roi: roi_val || 0
            }
          end

          total_current_value = equity_investments_with_value.sum { |inv| inv[:current_value] }
          average_roi = equity_investments_with_value.any? ? (equity_investments_with_value.sum { |inv| inv[:roi] } / equity_investments_with_value.size).round(2) : 0

          {
            total_investments: total_investment_count,
            total_investment_amount: total_investment_amount.to_f.round(2),
            average_investment: average_investment,
            investments_over_time: investments_over_time,
            status_distribution: status_distribution,
            top_investments: top_investments,
            investment_by_club_type: investment_by_club_type.transform_values { |v| v.to_f.round(2) },
            equity_investments: {
              total_equity_invested: total_equity_invested.to_f.round(2),
              total_current_value: total_current_value.round(2),
              average_roi: average_roi,
              total_returns: (total_current_value - total_equity_invested).round(2),
              investment_count: equity_investments.count
            },
            investment_size_distribution: {
              small: successful_investments.where('investment_amount < ?', 1000).count,
              medium: successful_investments.where('investment_amount >= ? AND investment_amount < ?', 1000, 10000).count,
              large: successful_investments.where('investment_amount >= ?', 10000).count
            }
          }
        end

        # NEW: Calculate voting statistics
        def calculate_voting_statistics
          votes = Vote.all
          club_investment_votes = votes.where(votable_type: 'ClubInvestment')
          
          total_votes = votes.count
          club_investment_vote_count = club_investment_votes.count

          # Vote type distribution
          vote_type_distribution = votes.group(:vote_type).count

          # Voting participation by club
          voting_participation_by_club = ClubInvestment
            .joins(:votes, :investment_club)
            .group('investment_clubs.name', 'investment_clubs.current_members_count')
            .select('investment_clubs.name, COUNT(DISTINCT votes.user_id) as unique_voters, investment_clubs.current_members_count')
            .map do |result|
              participation_rate = result.current_members_count > 0 ? 
                                    ((result.unique_voters.to_f / result.current_members_count) * 100).round(2) : 0
              {
                club_name: result.name,
                unique_voters: result.unique_voters,
                total_members: result.current_members_count,
                participation_rate: participation_rate
              }
            end

          # Recent voting activity
          recent_votes = votes
            .joins(:user)
            .order(created_at: :desc)
            .limit(20)
            .map do |vote|
              {
                id: vote.id,
                user_name: vote.user&.full_name || 'Unknown User',
                votable_type: vote.votable_type,
                vote_type: vote.vote_type,
                created_at: vote.created_at
              }
            end

          {
            total_votes: total_votes,
            club_investment_votes: club_investment_vote_count,
            vote_type_distribution: vote_type_distribution,
            voting_participation_by_club: voting_participation_by_club,
            recent_votes: recent_votes,
            average_votes_per_investment: ClubInvestment.count > 0 ? (club_investment_vote_count.to_f / ClubInvestment.count).round(2) : 0
          }
        end

        # NEW: Calculate member share statistics
        def calculate_member_share_statistics
          memberships = InvestmentClubMembership.active
          total_members = memberships.count
          
          return {
            total_members: 0,
            share_distribution: {},
            top_members_by_share: [],
            recent_share_changes: [],
            statistical_analysis: {
              average_share: 0,
              median_share: 0,
              maximum_share: 0,
              minimum_share: 0,
              standard_deviation: 0
            },
            share_concentration: {
              top_10_percent_share: 0,
              top_20_percent_share: 0,
              gini_coefficient: 0
            }
          } if total_members.zero?

          # Share distribution analysis
          share_ranges = {
            '0-1%': memberships.where('contributed_share <= 1').count,
            '1-5%': memberships.where('contributed_share > 1 AND contributed_share <= 5').count,
            '5-10%': memberships.where('contributed_share > 5 AND contributed_share <= 10').count,
            '10-20%': memberships.where('contributed_share > 10 AND contributed_share <= 20').count,
            '20-50%': memberships.where('contributed_share > 20 AND contributed_share <= 50').count,
            '50-100%': memberships.where('contributed_share > 50').count
          }

          # Top members by share
          top_members_by_share = memberships
            .joins(:user, :investment_club)
            .order(contributed_share: :desc)
            .limit(15)
            .map do |membership|
              {
                id: membership.id,
                user_name: membership.user&.full_name || 'Unknown User',
                club_name: membership.investment_club&.name || 'Unknown Club',
                contributed_share: membership.contributed_share.to_f.round(4),
                total_contributed: membership.total_contributed.to_f.round(2),
                role: membership.role
              }
            end

          # Share change history
          recent_share_changes = MemberShareChange
            .joins(investment_club_membership: [:user, :investment_club])
            .order(created_at: :desc)
            .limit(20)
            .map do |change|
              {
                id: change.id,
                user_name: change.investment_club_membership&.user&.full_name || 'Unknown User',
                club_name: change.investment_club_membership&.investment_club&.name || 'Unknown Club',
                previous_share: change.previous_share.to_f.round(4),
                new_share: change.new_share.to_f.round(4),
                change_amount: change.change_amount.to_f.round(4),
                change_reason: change.change_reason,
                created_at: change.created_at
              }
            end

          # Statistical analysis
          shares = memberships.pluck(:contributed_share).compact.map(&:to_f)
          return {
            total_members: total_members,
            share_distribution: share_ranges,
            top_members_by_share: top_members_by_share,
            recent_share_changes: recent_share_changes,
            statistical_analysis: {
              average_share: 0,
              median_share: 0,
              maximum_share: 0,
              minimum_share: 0,
              standard_deviation: 0
            },
            share_concentration: {
              top_10_percent_share: 0,
              top_20_percent_share: 0,
              gini_coefficient: 0
            }
          } if shares.empty?

          average_share = shares.sum / shares.size
          median_share = calculate_median(shares)
          max_share = shares.max
          min_share = shares.min

          {
            total_members: total_members,
            share_distribution: share_ranges,
            top_members_by_share: top_members_by_share,
            recent_share_changes: recent_share_changes,
            statistical_analysis: {
              average_share: average_share.round(4),
              median_share: median_share.round(4),
              maximum_share: max_share.round(4),
              minimum_share: min_share.round(4),
              standard_deviation: calculate_standard_deviation(shares).round(4)
            },
            share_concentration: {
              top_10_percent_share: calculate_top_percent_share(shares, 10),
              top_20_percent_share: calculate_top_percent_share(shares, 20),
              gini_coefficient: calculate_gini_coefficient(shares).round(4)
            }
          }
        end

        # NEW: Helper method to calculate median
        def calculate_median(array)
          return 0 if array.empty?
          sorted = array.sort
          len = sorted.length
          (sorted[(len - 1) / 2] + sorted[len / 2]) / 2.0
        end

        # NEW: Helper method to calculate standard deviation
        def calculate_standard_deviation(array)
          return 0 if array.empty?
          mean = array.sum / array.size
          variance = array.sum { |x| (x - mean) ** 2 } / array.size
          Math.sqrt(variance)
        end

        # NEW: Helper method to calculate top percent share
        def calculate_top_percent_share(shares, percent)
          return 0 if shares.empty?
          sorted = shares.sort.reverse
          top_count = [(shares.size * percent / 100.0).ceil, shares.size].min
          top_shares = sorted.first(top_count)
          (top_shares.sum / shares.sum * 100).round(2)
        end

        # NEW: Helper method to calculate Gini coefficient
        def calculate_gini_coefficient(shares)
          return 0 if shares.empty?
          sorted = shares.sort
          n = sorted.size
          sum = sorted.sum
          return 0 if sum.zero?
          
          gini_sum = sorted.each_with_index.sum { |x, i| (2 * i - n + 1) * x }
          gini_sum.to_f / (n * sum)
        end

        # NEW: Calculate premium subscription metrics
        def calculate_premium_metrics
          active_subscriptions = PremiumSubscription.active
          total_revenue = active_subscriptions.sum(:amount) || 0
          total_count = active_subscriptions.count
          
          # Calculate MRR (Monthly Recurring Revenue)
          mrr = active_subscriptions.where(interval: 'monthly').sum(:amount) || 0
          
          # Add quarterly and annual contributions converted to monthly equivalent
          active_subscriptions.where(interval: 'quarterly').each do |sub|
            mrr += sub.amount / 3
          end
          
          active_subscriptions.where(interval: 'annually').each do |sub|
            mrr += sub.amount / 12
          end
          
          # Count by plan
          plan_distribution = PremiumSubscription.joins(:premium_plan)
                                                .group('premium_plans.name')
                                                .count
          
          # Revenue by plan
          revenue_by_plan = PremiumSubscription.joins(:premium_plan)
                                              .group('premium_plans.name')
                                              .sum(:amount)
          
          {
            active: total_count,
            total_revenue: total_revenue.to_f.round(2),
            mrr: mrr.round(2),
            plan_distribution: plan_distribution,
            revenue_by_plan: revenue_by_plan.transform_values { |v| v.to_f.round(2) },
            churn_rate: calculate_premium_churn_rate
          }
        end

        # NEW: Calculate premium subscription churn rate
        def calculate_premium_churn_rate
          total_subscriptions = PremiumSubscription.count
          return 0 if total_subscriptions.zero?

          canceled_subscriptions = PremiumSubscription.where(status: 'cancelled').count
          (canceled_subscriptions.to_f / total_subscriptions * 100).round(2)
        end

        def calculate_total_platform_fees
          donation_fees = Donation.successful.where(processed: false).sum(:platform_fee) || 0
          investment_fees = EquityInvestment.successful.where(processed: false).sum(:platform_fee) || 0
          donation_fees + investment_fees
        end

        def calculate_combined_donations_metrics
          donations = Donation.all
          successful_donations = donations.successful
          
          total_amount = successful_donations.sum(:gross_amount) || 0
          total_count = successful_donations.count
          average_donation = total_count > 0 ? (total_amount / total_count).round(2) : 0

          {
            donations: {
              total_amount: total_amount.to_f.round(2),
              total_count: total_count,
              average_donation: average_donation,
              donations_over_time: donations.group_by_week(:created_at, format: '%Y-%m-%d').sum(:gross_amount),
              repeat_donors: donations.select(:user_id).group(:user_id).having('count(*) > 1').count.keys.size
            },
            total_raised: total_amount.to_f.round(2)
          }
        end

        def calculate_combined_equity_metrics
          investments = EquityInvestment.all
          successful_investments = investments.where(status: 'successful')
          
          total_amount = successful_investments.sum(:amount) || 0
          total_count = successful_investments.count
          average_investment = total_count > 0 ? (total_amount / total_count).round(2) : 0

          {
            equity: {
              total_investment_amount: total_amount.to_f.round(2),
              total_count: total_count,
              average_investment: average_investment,
              investments_over_time: successful_investments.group_by_week(:created_at, format: '%Y-%m-%d').sum(:amount),
              repeat_investors: investments.select(:user_id).group(:user_id).having('count(*) > 1').count.keys.size
            },
            total_raised: total_amount.to_f.round(2)
          }
        end

        def equity_campaign_metrics
          equity_campaigns = EquityCampaign.all
          total_valuation = equity_campaigns.sum(:valuation) || 0
          total_equity_offered = equity_campaigns.sum(:equity_offered) || 0
          total_funds_raised = equity_campaigns.sum(:total_equity_invested) || 0
          
          {
            total: equity_campaigns.count,
            active: equity_campaigns.where(equity_status: :live).count,
            total_valuation: total_valuation.to_f.round(2),
            total_equity_offered: total_equity_offered.to_f.round(2),
            total_funds_raised: total_funds_raised.to_f.round(2),
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
                percentage_raised: ec.valuation > 0 ? ((ec.total_equity_invested / ec.valuation) * 100).round(2) : 0,
                status: ec.equity_status
              }
            end
          }
        end

        def investment_metrics
          investments = EquityInvestment.all
          successful_investments = investments.where(status: 'successful')
          
          total_amount = successful_investments.sum(:amount) || 0
          total_count = successful_investments.count
          average_investment = total_count > 0 ? (total_amount / total_count).round(2) : 0

          {
            total_investments: investments.count,
            successful_investments: total_count,
            total_investment_amount: total_amount.to_f.round(2),
            average_investment: average_investment,
            investments_over_time: successful_investments.group_by_week(:created_at, format: '%Y-%m-%d').sum(:amount),
            status_distribution: investments.group(:status).count,
            top_investors: calculate_top_investors,
            investment_size_distribution: {
              small: successful_investments.where('amount < ?', 1000).count,
              medium: successful_investments.where('amount >= ? AND amount < ?', 1000, 10000).count,
              large: successful_investments.where('amount >= ?', 10000).count
            }
          }
        end

        def calculate_top_investors
          User.joins(:equity_investments)
              .where(equity_investments: { status: 'successful' })
              .group('users.id')
              .select('users.id, users.full_name, COUNT(equity_investments.id) as investment_count, SUM(equity_investments.amount) as total_invested')
              .order('total_invested DESC')
              .limit(10)
              .map do |user|
                {
                  id: user.id,
                  name: user.full_name,
                  investment_count: user.investment_count,
                  total_invested: user.total_invested.to_f.round(2)
                }
              end
        end

        def calculate_email_confirmation_rate
          confirmed = User.where(email_confirmed: true).count
          total = User.count
          return 0 if total.zero?

          (confirmed.to_f / total * 100).round(2)
        end

        def calculate_churn_rate
          canceled = Subscription.where(status: 'canceled').count
          total_subscriptions = Subscription.count
          return 0 if total_subscriptions.zero?

          (canceled.to_f / total_subscriptions * 100).round(2)
        end

        def calculate_top_countries_by_donations
          Donation.joins(:user)
                  .group('users.country')
                  .sum(:gross_amount)
                  .sort_by { |_, v| -v }
                  .first(5)
        end

        def calculate_time_to_first_action
          result = User.joins(:campaigns)
                       .average('campaigns.created_at - users.created_at')
          result&.to_f&.round(2) || 0
        end

        def calculate_subaccount_success_rate
          successful = Subaccount.where.not(subaccount_code: nil).count
          total_attempts = Subaccount.count
          return 0 if total_attempts.zero?

          (successful.to_f / total_attempts * 100).round(2)
        end
      end
    end
  end
end