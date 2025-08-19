module Api
  module V1
    module Fundraisers
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, only: [:create, :public_investments, :certificate_status, :generate_certificate,:show, :update,   :destroy]
        before_action :set_investment, only: [:show, :update, :destroy, :certificate_status]

        def public_investments
          investments = @campaign.equity_investments.successful
                              .order(created_at: :desc)

          investors = investments.map do |investment|
            {
              investor_name: investment.user&.full_name || investment.full_name || 'Anonymous',
              amount: investment.amount,
              email: investment.email,
              date: investment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }
          end

          paginated_investors = Kaminari.paginate_array(investors)
                                      .page(params[:page])
                                      .per(params[:per_page] || 10)

          render json: {
            investments: paginated_investors,
            pagination: pagination_data(paginated_investors),
            campaign: campaign_summary
          }, status: :ok
        end

        def create
          # First validate the investment parameters
            investment_params = equity_investment_params
            amount = investment_params[:amount].to_f
            reward_id = investment_params[:reward_id]

            # First validate basic parameters
            validation_result = validate_investment(amount, reward_id)
            unless validation_result[:valid]
              return render json: { 
                success: false, 
                error: validation_result[:message],
                validationErrors: validation_result[:errors]
              }, status: :unprocessable_entity
            end

            ActiveRecord::Base.transaction do
              # Create the investment first to trigger share calculation
              investment = @campaign.equity_investments.new(
                user: @current_user,
                amount: amount,
                reward_id: reward_id,
                status: EquityInvestment::STATUS_PENDING,
                email: investment_params[:email],
                phone: investment_params[:phone],
                full_name: investment_params[:full_name],
                metadata: investment_params[:metadata] || {}
              )

              # Manually trigger share calculation before validation
              investment.calculate_shares_and_percentage

              unless investment.save
                return render json: { 
                  success: false, 
                  error: "Validation failed: #{investment.errors.full_messages.join(', ')}",
                  validationErrors: investment.errors.to_hash
                }, status: :unprocessable_entity
              end

            # Generate callback URL similar to donations
            secure_random_uuid = SecureRandom.uuid
            # Use campaign.slug if available, otherwise fall back to id
            campaign_identifier = @campaign.slug || @campaign.id
            redirect_url = Rails.application.routes.url_helpers.campaign_url(campaign_identifier,
                                                                           host: 'bantuhive.com') + "?#{secure_random_uuid}"

            # Prepare metadata (similar structure to donations but with equity-specific fields)
            metadata = build_metadata(investment, redirect_url)

            # Initialize payment (same pattern as donations)
            initialize_payment(investment, metadata, redirect_url)
          end
        rescue StandardError => e
          render json: { 
            success: false, 
            error: e.message,
            code: e.try(:code)
          }, status: :unprocessable_entity
        end

        def portfolio
          investments = @current_user.equity_investments
                                  .includes(:campaign)
                                  .order(created_at: :desc)

          total_invested = investments.sum(:amount)
          total_value = investments.sum { |i| i.current_value || i.amount }
          total_return = total_value - total_invested
          return_percentage = total_invested > 0 ? (total_return / total_invested * 100) : 0

          render json: {
            portfolio: {
              total_invested: total_invested,
              total_value: total_value,
              total_return: total_return,
              return_percentage: return_percentage,
              active_investments: investments.count,
              campaigns_invested: investments.select(:campaign_id).distinct.count
            },
            investments: investments.map do |investment|
              {
                id: investment.id,
                amount: investment.amount,
                shares: investment.shares,
                percentage: investment.percentage,
                status: investment.status,
                created_at: investment.created_at,
                current_value: investment.current_value,
                campaign: {
                  id: investment.campaign_id,
                  title: investment.campaign.title,
                  slug: investment.campaign.slug,
                  status: investment.campaign.status,
                  valuation: investment.campaign.valuation,
                  equity_offered: investment.campaign.equity_offered
                },
                certificate_url: investment.certificate_url,
                certificate_exists: investment.certificate_present?
              }
            end
          }
        end

        def my_investments
          investments = @current_user.equity_investments
                                    .includes(:campaign)
                                    .order(created_at: :desc)

          render json: {
            investments: investments.map do |investment|
              {
                id: investment.id,
                amount: investment.amount,
                shares: investment.shares,
                percentage: investment.percentage,
                status: investment.status,
                created_at: investment.created_at,
                current_value: investment.current_value,
                campaign: {
                  id: investment.campaign_id,
                  title: investment.campaign.title,
                  status: investment.campaign.status,
                  valuation: investment.campaign.valuation,
                  equity_offered: investment.campaign.equity_offered
                },
                certificate_url: investment.certificate_url,
                certificate_exists: investment.certificate_present?
              }
            end
          }
        end

        def certificate_status
          render json: {
            exists: @investment.certificate_present?,
            url: @investment.certificate_url
          }
        end

        def update
          if @investment.update(equity_investment_update_params)
            render json: {
              success: true,
              investment: @investment
            }
          else
            render json: {
              success: false,
              errors: @investment.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def destroy
          if @investment.destroy
            render json: { success: true }
          else
            render json: {
              success: false,
              errors: @investment.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def validate_investment(amount, reward_id)
          result = { valid: true }
          
          # Maintain all equity-specific validations
          if amount < @campaign.minimum_investment
            result = {
              valid: false,
              message: "Minimum investment is #{@campaign.currency_symbol}#{@campaign.minimum_investment}",
              errors: { amount: ["Minimum investment is #{@campaign.currency_symbol}#{@campaign.minimum_investment}"] }
            }
          elsif @campaign.maximum_investment > 0 && amount > @campaign.maximum_investment
            result = {
              valid: false,
              message: "Maximum investment is #{@campaign.currency_symbol}#{@campaign.maximum_investment}",
              errors: { amount: ["Maximum investment is #{@campaign.currency_symbol}#{@campaign.maximum_investment}"] }
            }
          elsif reward_id && !@campaign.rewards.available.exists?(id: reward_id)
            result = {
              valid: false,
              message: "Selected reward is no longer available",
              errors: { reward_id: ["Selected reward is no longer available"] }
            }
          end

          # Subaccount validation - check if fundraiser has valid subaccount
          if result[:valid]
            subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)
            unless subaccount&.subaccount_code.present?
              result = {
                valid: false,
                message: 'Fundraiser does not meet requirements for raising funds',
                errors: { base: ['Fundraiser does not meet requirements for raising funds'] },
                code: 'MISSING_ACCOUNT_NUMBER'
              }
            end
          end

          # Shares validation (equity-specific)
          if result[:valid]
            price_per_share = @campaign.valuation.to_f / @campaign.total_shares.to_f
            requested_shares = (amount / price_per_share).round(4)

            if requested_shares > @campaign.shares_available
              available_amount = (@campaign.shares_available * price_per_share).floor
              result = {
                valid: false,
                message: "Not enough shares available. Maximum investment possible: #{@campaign.currency_symbol}#{available_amount}",
                errors: { amount: ["Not enough shares available"] }
              }
            end
          end

          result
        end

        def build_metadata(investment, redirect_url)
          {
            user_id: @current_user.id,
            campaign_id: @campaign.id,
            investment_id: investment.id,
            shares: investment.shares,
            percentage: investment.percentage,
            type: 'equity_investment',
            redirect_url: redirect_url,
            title: @campaign.title,
            currency: @campaign.currency,
            currency_symbol: @campaign.currency_symbol,
            valuation: @campaign.valuation,
            equity_offered: @campaign.equity_offered,
            investor_name: investment.full_name,
            investor_email: investment.email,
            phone: investment.phone,
            reward: if investment.reward_id
                      {
                        id: investment.reward_id,
                        title: investment.reward&.title,
                        description: investment.reward&.description,
                        delivery_date: investment.reward&.delivery_date
                      }
                    end,
            metadata: investment.metadata
          }
        end

        def initialize_payment(investment, metadata, redirect_url)
          subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)

          unless subaccount&.subaccount_code.present?
            render json: { 
              success: false, 
              error: 'Fundraiser does not meet requirements for raising funds',
              code: 'MISSING_ACCOUNT_NUMBER'
            }, status: :unprocessable_entity
            return
          end

          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: investment.email,
            amount: investment.amount,
            callback_url: redirect_url,
            metadata: metadata,
            subaccount: subaccount.subaccount_code
          )

          if response[:status]
            investment.update!(
              transaction_reference: response[:data][:reference],
              metadata: metadata
            )

            render json: {
              success: true,
              data: {
                authorization_url: response[:data][:authorization_url],
                redirect_url: redirect_url,
                investment: {
                  id: investment.id,
                  amount: investment.amount,
                  shares: investment.shares,
                  percentage: investment.percentage,
                  campaign: {
                    id: @campaign.id,
                    title: @campaign.title
                  }
                },
                total_investors: @campaign.total_investors
              }
            }, status: :created
          else
            investment.update!(status: EquityInvestment::STATUS_FAILED)
            render json: { 
              success: false, 
              error: response[:message],
              code: response[:data]&.[](:code)
            }, status: :unprocessable_entity
          end
        end

        def set_campaign
          # Get the identifier from the correct parameter based on your routes
          campaign_identifier = params[:equity_campaign_id]
          
          Rails.logger.info "Attempting to find campaign with identifier: #{campaign_identifier}"
          
          # First try to find by ID if identifier is numeric
          if campaign_identifier.to_s.match?(/^\d+$/)
            @campaign = EquityCampaign.find_by(id: campaign_identifier)
          else
            # Otherwise try to find by slug
            @campaign = EquityCampaign.find_by(slug: campaign_identifier)
          end

          if @campaign.nil?
            Rails.logger.error "Campaign not found with identifier: #{campaign_identifier}"
            render json: { 
              success: false,
              error: 'Equity campaign not found',
              code: 'EQUITY_CAMPAIGN_NOT_FOUND',
              attempted_identifier: campaign_identifier
            }, status: :not_found
            return false
          end

          unless @campaign.live?
            Rails.logger.warn "Campaign found but not live: #{@campaign.id} (status: #{@campaign.equity_status})"
            render json: { 
              success: false,
              error: 'Campaign is not currently accepting investments',
              code: 'CAMPAIGN_NOT_LIVE',
              campaign_status: @campaign.equity_status
            }, status: :unprocessable_entity
            return false
          end
          
          Rails.logger.info "Successfully found campaign: #{@campaign.id}"
        end

        def set_investment
          @investment = @current_user.equity_investments.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Investment not found' }, status: :not_found
        end

        def equity_investment_params
          params.require(:equity_investment).permit(
            :amount,
            :reward_id,
            :transaction_reference,
            :shares,
            :percentage,
            :email,
            :phone,
            :full_name,
            :ip_address,
            :country,
            metadata: {}
          )
        end

        def campaign_summary
          {
            total_shares: @campaign.total_shares,
            shares_remaining: @campaign.shares_available,
            equity_offered: @campaign.equity_offered,
            equity_remaining: @campaign.percentage_available,
            valuation: @campaign.valuation,
            currency_symbol: @campaign.currency_symbol,
            # rewards: @campaign.rewards.available.as_json(only: %i[id title description amount delivery_date])
          }
        end

        def pagination_data(paginated_records)
          {
            current_page: paginated_records.current_page,
            total_pages: paginated_records.total_pages,
            per_page: paginated_records.limit_value,
            total_count: paginated_records.total_count
          }
        end
      end
    end
  end
end