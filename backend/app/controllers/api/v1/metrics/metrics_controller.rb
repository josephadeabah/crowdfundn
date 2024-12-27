module Api
    module V1
      module Metrics
        class MetricsController < ApplicationController
          def dashboard
            donors_per_campaign = Campaign.left_joins(:donations)
                                           .group(:id)
                                           .count("donations.id")
  
            average_donors_per_campaign = donors_per_campaign.values.sum.to_f / donors_per_campaign.size if donors_per_campaign.any?
            average_donors_per_campaign ||= 0
  
            metrics = {
              users: {
                total: User.count,
                new_last_week: User.where("created_at >= ?", 7.days.ago).count,
                active: User.where("last_sign_in_at >= ?", 7.days.ago).count,
                email_confirmation_rate: calculate_email_confirmation_rate
              },
              campaigns: {
                total: Campaign.count,
                active: Campaign.where(status: 'active').count,
                average_goal_amount: Campaign.average(:goal_amount).to_f.round(2),
                average_current_amount: Campaign.average(:transferred_amount).to_f.round(2),
                performance_percentage: Campaign.average("transferred_amount / goal_amount * 100").to_f.round(2),
                top_performing: Campaign.order(transferred_amount: :desc).limit(5).map do |c|
                  {
                    id: c.id,
                    name: c.title,
                    transferred_amount: c.transferred_amount,
                    goal_amount: c.goal_amount,
                    performance_percentage: c.performance_percentage
                  }
                end,
                donors_per_campaign: donors_per_campaign.transform_values(&:to_i),
                average_donors_per_campaign: average_donors_per_campaign.round(2)
              },
              donations: {
                total_amount: Donation.sum(:gross_amount),
                average_donation: Donation.average(:gross_amount),
                donations_over_time: Donation.group_by_day(:created_at).order("created_at DESC").limit(15).sum(:gross_amount),
                repeat_donors: Donation.select(:user_id).group(:user_id).having("count(*) > 1").count.keys.size
              },
              roles: Role.joins(:users).group(:name).count,
              subscriptions: {
                active: Subscription.where(status: 'active').count,
                mrr: Subscription.where("created_at >= ?", 1.month.ago).sum(:amount),
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
              }
            }
  
            render json: metrics, status: :ok
          end
  
          private
  
          def calculate_email_confirmation_rate
            confirmed = User.where(email_confirmed: true).count
            total = User.count
            return 0 if total.zero?
  
            (confirmed.to_f / total * 100).round(2)
          end
  
          def calculate_churn_rate
            canceled = Subscription.where(status: 'canceled').count
            active_last_month = Subscription.where("created_at < ?", 1.month.ago).count
            return 0 if active_last_month.zero?
  
            (canceled.to_f / active_last_month * 100).round(2)
          end
  
          def calculate_top_countries_by_donations
            Donation.joins(:user)
                    .group("users.country")
                    .sum(:gross_amount)
                    .sort_by { |_, v| -v }
                    .first(5)
          end
  
          def calculate_time_to_first_action
            result = User.joins(:campaigns)
                         .average("campaigns.created_at - users.created_at")
            result&.to_f&.round(2)
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
  