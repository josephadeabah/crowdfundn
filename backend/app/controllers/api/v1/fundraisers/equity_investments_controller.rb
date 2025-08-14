module Api
  module V1
    module Fundraisers
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request, only: %i[index create]
        before_action :set_campaign, only: [:public_investments]

        # Public investments list for a campaign
        def public_investments
          investments = @campaign.equity_investments.successful
                               .order(created_at: :desc)

          investors = investments.map do |investment|
            {
              investor_name: investment.user&.full_name || investment.full_name || 'Anonymous',
              amount: investment.amount,
              shares: investment.shares,
              ownership_percentage: investment.percentage,
              date: investment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
              certificate_url: investment.certificate_url,
              reward: investment.reward&.as_json(only: %i[title description delivery_date])
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
          campaign = Campaign.find_by(id: params[:equity_campaign_id])
          unless campaign
            return render json: { error: 'The campaign you are trying to invest in no longer exists.' },
                          status: :not_found
          end

          subaccount = Subaccount.find_by(user_id: campaign.fundraiser_id)

          if subaccount.nil? || subaccount.subaccount_code.blank?
            return render json: { error: 'Fundraiser does not meet requirements for raising funds.' },
                          status: :unprocessable_entity
          end

          # Validate investment amount first
          amount = equity_investment_params[:amount].to_f
          validation_result = validate_investment_amount(amount, campaign)
          unless validation_result == true
            return render json: { 
              success: false, 
              error: validation_result[:error],
              validationErrors: { amount: [validation_result[:error]] }
            }, status: :unprocessable_entity
          end

          # Create new investment
          investment = EquityInvestment.new(equity_investment_params)
          investment.campaign = campaign
          investment.user = @current_user
          investment.status = 'pending'
          investment.full_name = equity_investment_params[:full_name].presence || @current_user&.full_name || 'Anonymous'

          # Generate callback URL
          secure_uuid = SecureRandom.uuid
          campaign_identifier = campaign.slug || campaign.id
          redirect_url = Rails.application.routes.url_helpers.campaign_url(
            campaign_identifier,
            host: Rails.application.config.app_domain
          ) + "?#{secure_uuid}"

          # Prepare metadata (similar to donations)
          metadata = {
            user_id: @current_user&.id,
            campaign_id: campaign.id,
            investment_id: investment.id,
            shares: investment.shares,
            percentage: investment.percentage,
            type: 'equity_investment',
            redirect_url: redirect_url,
            title: campaign.title,
            currency: campaign.currency,
            currency_symbol: campaign.currency_symbol,
            valuation: campaign.valuation,
            equity_offered: campaign.equity_offered,
            investor_name: investment.full_name,
            investor_email: equity_investment_params[:email],
            phone: equity_investment_params[:phone],
            reward: if equity_investment_params[:reward_id]
                       {
                         id: equity_investment_params[:reward_id],
                         title: campaign.rewards.find_by(id: equity_investment_params[:reward_id])&.title
                       }
                     end,
            metadata: equity_investment_params[:metadata] || {}
          }

          # Initialize Paystack transaction
          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: equity_investment_params[:email],
            amount: investment.amount * 100, # Convert to kobo
            callback_url: redirect_url,
            metadata: metadata,
            subaccount: subaccount.subaccount_code
          )

          if response[:status]
            investment.transaction_reference = response[:data][:reference]
            investment.metadata = metadata
            
            if investment.save
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
                      id: campaign.id,
                      title: campaign.title
                    }
                  },
                  total_investors: campaign.equity_investments.successful.count
                }
              }, status: :created
            else
              render json: { 
                success: false, 
                error: investment.errors.full_messages.join(', '),
                validationErrors: investment.errors.to_hash
              }, status: :unprocessable_entity
            end
          else
            render json: { 
              success: false, 
              error: response[:message],
              code: response[:data]&.[](:code)
            }, status: :unprocessable_entity
          end
        end

        private

        def equity_investment_params
          params.require(:equity_investment).permit(
            :amount,
            :reward_id,
            :email,
            :phone,
            :full_name,
            metadata: {}
          )
        end

        def set_campaign
          @campaign = Campaign.find_by(id: params[:equity_campaign_id] || params[:campaign_id])
          render json: { error: 'Campaign not found' }, status: :not_found unless @campaign
        end

        def validate_investment_amount(amount, campaign)
          if amount < campaign.minimum_investment
            return { error: "Minimum investment is #{campaign.currency_symbol}#{campaign.minimum_investment}" }
          end

          if campaign.maximum_investment > 0 && amount > campaign.maximum_investment
            return { error: "Maximum investment is #{campaign.currency_symbol}#{campaign.maximum_investment}" }
          end

          price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
          requested_shares = (amount / price_per_share).round(4)

          if requested_shares > campaign.shares_available
            available_amount = (campaign.shares_available * price_per_share).floor
            return { 
              error: "Not enough shares available. Maximum investment possible: #{campaign.currency_symbol}#{available_amount}" 
            }
          end

          true
        end

        def campaign_summary
          {
            total_shares: @campaign.total_shares,
            shares_remaining: @campaign.shares_available,
            equity_offered: @campaign.equity_offered,
            equity_remaining: @campaign.percentage_available,
            valuation: @campaign.valuation,
            currency_symbol: @campaign.currency_symbol,
            rewards: @campaign.rewards.available.as_json(only: %i[id title description amount delivery_date])
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