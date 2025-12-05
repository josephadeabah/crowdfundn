module Api
  module V1
    module Members
      class PremiumUsersController < ApplicationController
        before_action :authenticate_request
        before_action :require_admin

        # GET /api/v1/members/premium_users
        def index
          # Get filter parameters
          filter = params[:filter] || 'all'
          search = params[:search]
          status_filter = params[:status]
          plan_id = params[:plan_id]
          page = params[:page] || 1
          per_page = params[:per_page] || 20

          # Start with all users with premium access
          users = User.includes(:premium_subscriptions, :premium_plan)
                      .where(premium_access: true)
                      .order(premium_expires_at: :desc, created_at: :desc)

          # Apply filters
          case filter
          when 'active'
            users = users.where('premium_expires_at > ? OR premium_expires_at IS NULL', Time.current)
          when 'expired'
            users = users.where('premium_expires_at < ?', Time.current)
          when 'expiring_soon'
            users = users.where('premium_expires_at BETWEEN ? AND ?', 
                               Time.current, 7.days.from_now)
          end

          # Apply status filter
          if status_filter.present? && status_filter != 'all'
            case status_filter
            when 'active'
              users = users.where('premium_expires_at > ? OR premium_expires_at IS NULL', Time.current)
            when 'expired'
              users = users.where('premium_expires_at < ?', Time.current)
            when 'cancelled'
              users = users.joins(:premium_subscriptions)
                          .where(premium_subscriptions: { status: 'cancelled' })
            end
          end

          # Filter by plan
          if plan_id.present?
            users = users.where(premium_plan_id: plan_id)
          end

          # Search
          if search.present?
            search_query = "%#{search.downcase}%"
            users = users.where(
              'LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? OR phone_number LIKE ?',
              search_query, search_query, search_query
            )
          end

          # Pagination
          total_count = users.count
          users = users.page(page).per(per_page)

          # Get premium plans for filter dropdown
          premium_plans = PremiumPlan.active.order(:price)

          # Prepare response
          premium_users = users.map do |user|
            active_subscription = user.active_premium_subscription
            subscriptions = user.premium_subscriptions.order(created_at: :desc)

            {
              id: user.id,
              full_name: user.full_name,
              email: user.email,
              phone_number: user.phone_number,
              user_type: user.user_type,
              premium_access: user.premium_access?,
              premium_expires_at: user.premium_expires_at,
              premium_plan: user.premium_plan ? {
                id: user.premium_plan.id,
                name: user.premium_plan.name,
                price: user.premium_plan.price,
                currency: user.premium_plan.currency,
                interval: user.premium_plan.interval
              } : nil,
              active_subscription: active_subscription ? {
                id: active_subscription.id,
                status: active_subscription.status,
                auto_renew: active_subscription.auto_renew,
                expires_at: active_subscription.expires_at,
                start_date: active_subscription.start_date,
                transaction_reference: active_subscription.transaction_reference
              } : nil,
              all_subscriptions: subscriptions.map do |sub|
                {
                  id: sub.id,
                  status: sub.status,
                  amount: sub.amount,
                  currency: sub.currency,
                  interval: sub.interval,
                  transaction_reference: sub.transaction_reference,
                  start_date: sub.start_date,
                  expires_at: sub.expires_at,
                  created_at: sub.created_at
                }
              end,
              created_at: user.created_at,
              days_remaining: user.premium_expires_at ? 
                [(user.premium_expires_at - Time.current).to_i / 1.day, 0].max : nil,
              status: user.premium_expires_at ? 
                (user.premium_expires_at > Time.current ? 'active' : 'expired') : 'active'
            }
          end

          render json: {
            premium_users: premium_users,
            total_count: total_count,
            current_page: page.to_i,
            total_pages: users.total_pages,
            premium_plans: premium_plans.as_json(only: [:id, :name, :price, :currency, :interval]),
            filters: {
              active_count: User.where(premium_access: true)
                                .where('premium_expires_at > ? OR premium_expires_at IS NULL', Time.current)
                                .count,
              expired_count: User.where(premium_access: true)
                                 .where('premium_expires_at < ?', Time.current)
                                 .count,
              total_premium: User.where(premium_access: true).count
            }
          }, status: :ok
        end

        # GET /api/v1/members/premium_users/:id
        def show
          user = User.includes(:premium_subscriptions, :premium_plan).find(params[:id])
          
          unless user.premium_access?
            return render json: { error: 'User does not have premium access' }, status: :not_found
          end

          active_subscription = user.active_premium_subscription
          subscriptions = user.premium_subscriptions.order(created_at: :desc)

          render json: {
            user: {
              id: user.id,
              full_name: user.full_name,
              email: user.email,
              phone_number: user.phone_number,
              user_type: user.user_type,
              country: user.country,
              created_at: user.created_at
            },
            premium_info: {
              has_premium: user.premium_access?,
              premium_expires_at: user.premium_expires_at,
              premium_plan: user.premium_plan ? {
                id: user.premium_plan.id,
                name: user.premium_plan.name,
                price: user.premium_plan.price,
                currency: user.premium_plan.currency,
                interval: user.premium_plan.interval,
                description: user.premium_plan.description,
                features: user.premium_plan.features
              } : nil,
              active_subscription: active_subscription ? {
                id: active_subscription.id,
                status: active_subscription.status,
                auto_renew: active_subscription.auto_renew,
                expires_at: active_subscription.expires_at,
                start_date: active_subscription.start_date,
                transaction_reference: active_subscription.transaction_reference,
                paystack_subscription_code: active_subscription.paystack_subscription_code
              } : nil,
              all_subscriptions: subscriptions.map do |sub|
                {
                  id: sub.id,
                  status: sub.status,
                  amount: sub.amount,
                  currency: sub.currency,
                  interval: sub.interval,
                  transaction_reference: sub.transaction_reference,
                  start_date: sub.start_date,
                  expires_at: sub.expires_at,
                  created_at: sub.created_at,
                  paystack_subscription_code: sub.paystack_subscription_code
                }
              end,
              days_remaining: user.premium_expires_at ? 
                [(user.premium_expires_at - Time.current).to_i / 1.day, 0].max : nil,
              status: user.premium_expires_at ? 
                (user.premium_expires_at > Time.current ? 'active' : 'expired') : 'active'
            }
          }, status: :ok
        end

        # POST /api/v1/members/premium_users/:id/manually_extend
        def manually_extend
          user = User.find(params[:id])
          days = params[:days].to_i
          
          if days <= 0
            return render json: { error: 'Invalid number of days' }, status: :unprocessable_entity
          end

          user.transaction do
            new_expiry = (user.premium_expires_at || Time.current) + days.days
            
            user.update!(
              premium_expires_at: new_expiry,
              premium_access: true
            )

            # Create a manual subscription record
            PremiumSubscription.create!(
              user: user,
              premium_plan: user.premium_plan,
              amount: user.premium_plan&.price || 0,
              currency: user.premium_plan&.currency || 'GHS',
              interval: 'manual_extension',
              status: 'active',
              start_date: Time.current,
              expires_at: new_expiry,
              auto_renew: false,
              transaction_reference: "MANUAL_#{Time.current.to_i}_#{SecureRandom.hex(4)}"
            )
          end

          render json: {
            message: "Premium access extended by #{days} days",
            new_expires_at: user.premium_expires_at,
            days_remaining: [(user.premium_expires_at - Time.current).to_i / 1.day, 0].max
          }, status: :ok
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # POST /api/v1/members/premium_users/:id/revoke_premium
        def revoke_premium
          user = User.find(params[:id])
          
          user.transaction do
            user.update!(
              premium_access: false,
              premium_plan_id: nil,
              premium_expires_at: nil
            )

            # Cancel all active subscriptions
            user.premium_subscriptions.active.each do |subscription|
              subscription.update!(status: 'cancelled', auto_renew: false)
            end
          end

          render json: {
            message: 'Premium access revoked successfully'
          }, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # GET /api/v1/members/premium_users/stats
        def stats
          total_users = User.count
          premium_users = User.where(premium_access: true).count
          active_premium = User.where(premium_access: true)
                               .where('premium_expires_at > ? OR premium_expires_at IS NULL', Time.current)
                               .count
          expired_premium = User.where(premium_access: true)
                                .where('premium_expires_at < ?', Time.current)
                                .count

          # Plan distribution
          plan_distribution = PremiumPlan.active.joins(:users)
                                        .group('premium_plans.id', 'premium_plans.name')
                                        .count
                                        .map { |(plan_id, plan_name), count| { plan_id: plan_id, plan_name: plan_name, count: count } }

          # Monthly subscription growth
          monthly_growth = PremiumSubscription.where('created_at >= ?', 6.months.ago)
                                             .group("DATE_TRUNC('month', created_at)")
                                             .count
                                             .map { |month, count| { month: month.strftime('%b %Y'), count: count } }

          render json: {
            overview: {
              total_users: total_users,
              premium_users: premium_users,
              active_premium: active_premium,
              expired_premium: expired_premium,
              premium_percentage: total_users > 0 ? ((premium_users.to_f / total_users) * 100).round(2) : 0
            },
            plan_distribution: plan_distribution,
            monthly_growth: monthly_growth,
            recent_subscriptions: PremiumSubscription.includes(:user, :premium_plan)
                                                    .order(created_at: :desc)
                                                    .limit(10)
                                                    .map do |sub|
              {
                id: sub.id,
                user_name: sub.user.full_name,
                user_email: sub.user.email,
                plan_name: sub.premium_plan&.name || 'N/A',
                amount: sub.amount,
                currency: sub.currency,
                status: sub.status,
                created_at: sub.created_at
              }
            end
          }, status: :ok
        end

        private

        def require_admin
          unless @current_user
            render json: { error: 'Unauthorized' }, status: :unauthorized
          end
        end
      end
    end
  end
end