module Api
  module V1
    module Fundraisers
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request, except: [:public_investments] 
        # Only set campaign for actions that need it
        before_action :set_campaign, only: [:create, :public_investments]
        # Set investment for actions that work with specific investments
        before_action :set_investment, only: [:show, :update, :destroy]
        # Add KYC verification check for create action
        before_action :verify_kyc_requirements, only: [:create]

        def public_investments
          # This action needs @campaign, which is set by set_campaign
          investments = @campaign.equity_investments.successful
                              .order(created_at: :desc)

          investors = investments.map do |investment|
            {
              investor_name: investment.user&.full_name || investment.full_name || 'Anonymous',
              amount: investment.amount,
              email: investment.email,
              date: investment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
              signature_url: investment.user&.latest_kyc&.signature_image_url
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
            # Use the campaign's create_investment method which handles locking
            investment = @campaign.create_investment(@current_user, amount)
            
            unless investment
              return render json: { 
                success: false, 
                error: "Failed to create investment: #{@campaign.errors.full_messages.join(', ')}",
                validationErrors: @campaign.errors.to_hash
              }, status: :unprocessable_entity
            end

            investment.update!(
              reward_id: reward_id,
              email: investment_params[:email],
              phone: investment_params[:phone],
              full_name: investment_params[:full_name],
              metadata: investment_params[:metadata] || {}
            )

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
        rescue ActiveRecord::StaleObjectError => e
          render json: { 
            success: false, 
            error: 'Campaign was modified by another process. Please try again.',
            code: 'STALE_OBJECT_ERROR'
          }, status: :conflict
        rescue StandardError => e
          render json: { 
            success: false, 
            error: e.message,
            code: e.try(:code)
          }, status: :unprocessable_entity
        end

        def portfolio
          portfolio_data = EquityInvestment.portfolio_for(@current_user)
          
          # Calculate return percentage safely
          total_invested = portfolio_data[:total_invested].to_f
          total_value = portfolio_data[:total_value].to_f
          total_return = total_value - total_invested
          return_percentage = total_invested > 0 ? (total_return / total_invested * 100).round(2) : 0
          
          # Enhance investments with company and team information
          enhanced_investments = portfolio_data[:investments].map do |investment|
            investment_data = EquityInvestmentSerializer.new(investment).as_json
            
            # Add company information from the campaign
            if investment.campaign
              investment_data[:company_info] = {
                name: investment.campaign.company_name,
                description: investment.campaign.company_description,
                headquarters: investment.campaign.company_headquarters,
                website: investment.campaign.company_website,
                contract_term: investment.campaign.contract_term
              }
              
              # Add team members information
              investment_data[:team_members] = investment.campaign.campaign_team_members.includes(:user).map do |member|
                {
                  id: member.id,
                  name: member.name,
                  email: member.email,
                  role: member.role,
                  title: member.title,
                  equity_percentage: member.equity_percentage,
                  description: member.description,
                  avatar_url: member.avatar_url,
                  user: if member.user
                          {
                            id: member.user.id,
                            email: member.user.email,
                            profile: {
                              first_name: member.user.profile&.first_name,
                              last_name: member.user.profile&.last_name
                            }
                          }
                        end
                }
              end
            end
            
            investment_data
          end
          
          render json: {
            portfolio: {
              total_invested: total_invested,
              total_value: total_value,
              total_return: total_return,
              return_percentage: return_percentage,
              active_investments: portfolio_data[:successful_count],
              campaigns_invested: portfolio_data[:campaigns_invested],
              currency: @current_user.currency.upcase,
              currency_symbol: @current_user.currency_symbol
            },
            investments: enhanced_investments
          }
        end

      def my_investments
        # Fetch all campaigns owned by current user
        equity_campaigns = EquityCampaign.where(fundraiser_id: @current_user.id)

        # Fetch all investments made into those campaigns
        investments = EquityInvestment.where(campaign_id: equity_campaigns.pluck(:id))
                                      .includes(:campaign, :user)
                                      .order(created_at: :desc)
                                      .page(params[:page] || 1)
                                      .per(params[:per_page] || 10)

        formatted_investments = investments.map do |investment|
          {
            id: investment.id,
            email: investment.email,
            full_name: investment.full_name || investment.user&.full_name || 'Anonymous',
            amount: investment.amount.to_f,
            created_at: investment.created_at,
            status: investment.status,
            campaign: {
              title: investment.campaign.title,
              currency: investment.campaign.currency,
              currency_symbol: investment.campaign.currency_symbol
            }
          }
        end

        render json: {
          investments: formatted_investments,
          pagination: {
            current_page: investments.current_page,
            total_pages: investments.total_pages,
            per_page: investments.limit_value,
            total_count: investments.total_count
          }
        }
      end


        def show
          render json: {
            investment: EquityInvestmentSerializer.new(@investment).as_json
          }
        end

        def update
          if @investment.update(equity_investment_update_params)
            render json: {
              success: true,
              investment: EquityInvestmentSerializer.new(@investment).as_json
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

        def verify_kyc_requirements

          # Check if user has verified KYC as investor
          unless @current_user.verified_investor?
            render json: { 
              success: false, 
              error: 'You must complete verification before making investments',
              code: 'KYC_VERIFICATION_REQUIRED',
              kyc_status: @current_user.kyc_status_info
            }, status: :forbidden
            return false
          end

          # Additional check: ensure KYC is not expired
          if @current_user.latest_kyc&.expired?
            render json: { 
              success: false, 
              error: 'Your KYC verification has expired. Please renew your verification.',
              code: 'KYC_EXPIRED'
            }, status: :forbidden
            return false
          end

          true
        end

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

          # Subaccount validation
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

          # Campaign investment readiness check
          if result[:valid] && !@campaign.investment_ready?
            result = {
              valid: false,
              message: "Campaign is not currently ready for investments",
              errors: { base: ["Campaign is not investment ready"] }
            }
          end

          # Enhanced equity validation
          if result[:valid]
            price_per_share = @campaign.valuation.to_f / @campaign.total_shares.to_f
            requested_shares = (amount / price_per_share).round(4)
            requested_percentage = ((amount / (@campaign.valuation.to_f * @campaign.equity_offered.to_f / 100)) * 100).round(4)

            # Calculate maximum allowed by BOTH constraints
            max_by_shares = (@campaign.shares_available * price_per_share).floor
            max_by_percentage = ((@campaign.percentage_available / 100) * 
                                (@campaign.valuation.to_f * @campaign.equity_offered.to_f / 100)).floor
            
            absolute_maximum = [max_by_shares, max_by_percentage].min

            if amount > absolute_maximum
              result = {
                valid: false,
                message: "Maximum investment possible: #{@campaign.currency_symbol}#{absolute_maximum}",
                errors: { amount: ["Maximum investment is #{@campaign.currency_symbol}#{absolute_maximum}"] }
              }
            elsif requested_shares > @campaign.shares_available || requested_percentage > @campaign.percentage_available
              result = {
                valid: false,
                message: "Investment constraints exceeded",
                errors: { amount: ["Cannot process investment due to constraint limits"] }
              }
            end
          end

          result
        end

        def build_metadata(investment, redirect_url)
          metadata = {
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
            metadata: investment.metadata
          }

          # Add signature data if available
          # if @current_user.latest_kyc&.signature_data.present?
          #   metadata[:investor_signature_data] = @current_user.latest_kyc.signature_data
          # end

          if investment.reward_id
            metadata[:reward] = {
              id: investment.reward_id,
              title: investment.reward&.title,
              description: investment.reward&.description,
              delivery_date: investment.reward&.delivery_date
            }
          end

          metadata
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
            subaccount: subaccount.subaccount_code,
            currency: @campaign.currency.upcase
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
                investment: EquityInvestmentSerializer.new(investment).as_json,
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
          # For collection actions that don't have investment_id, skip this
          return unless params[:id].present?
          
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

        def equity_investment_update_params
          params.require(:equity_investment).permit(
            :status,
            :email,
            :phone,
            :full_name
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
            issuer_signature_url: @campaign.fundraiser&.latest_kyc&.signature_image_url
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