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

          metrics = {
            users: {
              total: User.count,
              new_last_week: User.where('created_at >= ?', 7.days.ago).count,
              active: User.where('last_sign_in_at >= ?', 7.days.ago).count,
              email_confirmation_rate: calculate_email_confirmation_rate
            },
            campaigns: {
              total: Campaign.count,
              active: Campaign.where(status: 'active').count,
              average_goal_amount: Campaign.average(:goal_amount).to_f.round(2),
              average_current_amount: Campaign.average(:transferred_amount).to_f.round(2),
              performance_percentage: Campaign.average('(transferred_amount / NULLIF(goal_amount, 0)) * 100').to_f.round(2),
              top_performing: Campaign.order(transferred_amount: :desc).limit(5).map do |c|
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
            subscriptions: {
              active: Subscription.where(status: 'active').count,
              mrr: Subscription.sum(:amount) || 0, # Changed from where clause to sum all
              churn_rate: calculate_churn_rate
            },
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
            investments: investment_metrics
          }

          render json: metrics, status: :ok
        end

        private

        def calculate_total_platform_fees
          donation_fees = Donation.where(processed: false).sum(:platform_fee) || 0
          investment_fees = EquityInvestment.where(processed: false).sum(:platform_fee) || 0
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