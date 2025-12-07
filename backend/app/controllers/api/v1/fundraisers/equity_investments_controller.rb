
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
            # FIXED: Handle both user investments and club investments
            investor_name = if investment.user.present?
                              investment.user.full_name
                            elsif investment.club_investment?
                              # For club investments, use the club name or a generic name
                              investment.metadata&.dig('club_name') || 'Investment Club'
                            else
                              investment.full_name || 'Anonymous'
                            end

            {
              investor_name: investor_name,
              amount: investment.amount,
              # email: investment.email,
              date: investment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
              signature_url: investment.user&.latest_kyc&.signature_image_url,
              # ADDED: Include investment type for frontend
              investment_type: investment.club_investment? ? 'club' : 'individual'
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
          Rails.logger.info "EquityInvestment create params: #{params.inspect}"
          
          # First validate the investment parameters
          investment_params = equity_investment_params
          amount = investment_params[:amount].to_f
          reward_id = investment_params[:reward_id]

          Rails.logger.info "Parsed investment: amount=#{amount}, reward_id=#{reward_id}"

          # First validate basic parameters including required fields
          validation_result = validate_investment(amount, reward_id, investment_params)
          unless validation_result[:valid]
            Rails.logger.error "Investment validation failed: #{validation_result.inspect}"
            return render json: { 
              success: false, 
              error: validation_result[:message],
              validationErrors: validation_result[:errors]
            }, status: :unprocessable_entity
          end

          ActiveRecord::Base.transaction do

            investment = @campaign.equity_investments.new(
              user: @current_user,
              amount: amount,
              reward_id: reward_id,
              email: investment_params[:email],
              phone: investment_params[:phone],
              full_name: investment_params[:full_name],
              metadata: investment_params[:metadata] || {},
              status: EquityInvestment::STATUS_PENDING
            )

            # Validate the investment
            unless investment.valid?
              Rails.logger.error "Investment validation failed: #{investment.errors.full_messages}"
              return render json: { 
                success: false, 
                error: "Investment validation failed: #{investment.errors.full_messages.join(', ')}",
                validationErrors: investment.errors.messages
              }, status: :unprocessable_entity
            end

            # Save the investment
            unless investment.save
              Rails.logger.error "Investment save failed: #{investment.errors.full_messages}"
              return render json: { 
                success: false, 
                error: "Failed to create investment: #{investment.errors.full_messages.join(', ')}",
                validationErrors: investment.errors.messages
              }, status: :unprocessable_entity
            end

            Rails.logger.info "Investment created successfully: #{investment.id}"

            # Generate callback URL similar to donations
            secure_random_uuid = SecureRandom.uuid
            # Use campaign.slug if available, otherwise fall back to id
            campaign_identifier = @campaign.slug || @campaign.id
            redirect_url = Rails.application.routes.url_helpers.campaign_url(campaign_identifier,
                                                                            host: 'bantuhive.com') + "?#{secure_random_uuid}"

            # Prepare metadata (similar structure to donations but with equity-specific fields)
            metadata = build_metadata(investment, redirect_url)

            # Initialize payment (same pattern as donations)
            payment_result = initialize_payment(investment, metadata, redirect_url)
            
            # If payment initialization failed, return the error response
            unless payment_result[:success]
              return render json: payment_result, status: :unprocessable_entity
            end
            
            # Return success response with payment data
            render json: payment_result, status: :created
          end
        rescue ActiveRecord::StaleObjectError => e
          error_msg = 'Campaign was modified by another process. Please try again.'
          Rails.logger.error "#{error_msg}: #{e.message}"
          render json: { 
            success: false, 
            error: error_msg,
            code: 'STALE_OBJECT_ERROR',
            validationErrors: { base: [error_msg] }
          }, status: :conflict
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error "Record validation failed: #{e.message}"
          render json: { 
            success: false, 
            error: e.message,
            validationErrors: e.record.errors.messages
          }, status: :unprocessable_entity
        rescue StandardError => e
          error_msg = "Unexpected error: #{e.message}"
          Rails.logger.error "#{error_msg}\n#{e.backtrace.join("\n")}"
          render json: { 
            success: false, 
            error: error_msg,
            code: e.try(:code),
            validationErrors: { base: [error_msg] }
          }, status: :unprocessable_entity
        end

        def portfolio
          # FIXED: Get portfolio data with proper calculations
          portfolio_data = EquityInvestment.portfolio_for(@current_user)
          
          # FIXED: Use the return_percentage already calculated in the model
          total_invested = portfolio_data[:total_invested].to_f
          total_value = portfolio_data[:total_value].to_f
          total_return = portfolio_data[:total_return].to_f
          return_percentage = portfolio_data[:return_percentage] || 0
          
          # FIXED: Format investments with proper serialization
          enhanced_investments = portfolio_data[:investments].map do |investment|
            investment_data = EquityInvestmentSerializer.new(investment).as_json
            
            # FIXED: Check if investment should be included in portfolio calculations
            is_portfolio_investment = investment.successful? || investment.committed?
            
            # Add portfolio-specific flags
            investment_data[:is_portfolio_investment] = is_portfolio_investment
            investment_data[:can_be_cancelled] = investment.can_be_cancelled?
            
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
          
          # FIXED: Filter investments for the portfolio section
          portfolio_investments = enhanced_investments.select do |inv|
            inv[:is_portfolio_investment]
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
            investments: portfolio_investments,  # FIXED: Only include portfolio investments
            all_investments: enhanced_investments # FIXED: Include all for reference
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

        def validate_investment(amount, reward_id, investment_params)
          Rails.logger.info "Validating investment: amount=#{amount}, reward_id=#{reward_id}"
          
          result = { valid: true, errors: {} }
          
          # Check required fields
          if investment_params[:full_name].blank?
            result[:valid] = false
            result[:errors][:full_name] = ["can't be blank"]
          end
          
          if investment_params[:email].blank?
            result[:valid] = false
            result[:errors][:email] = ["can't be blank"]
          end
          
          # Basic validations
          if amount < @campaign.minimum_investment
            result[:valid] = false
            result[:message] = "Minimum investment is #{@campaign.currency_symbol}#{@campaign.minimum_investment}"
            result[:errors][:amount] = ["Minimum investment is #{@campaign.currency_symbol}#{@campaign.minimum_investment}"]
            Rails.logger.error "Amount below minimum: #{amount} < #{@campaign.minimum_investment}"
          end
          
          if @campaign.maximum_investment > 0 && amount > @campaign.maximum_investment
            result[:valid] = false
            result[:message] = "Maximum investment is #{@campaign.currency_symbol}#{@campaign.maximum_investment}"
            result[:errors][:amount] = ["Maximum investment is #{@campaign.currency_symbol}#{@campaign.maximum_investment}"]
            Rails.logger.error "Amount above maximum: #{amount} > #{@campaign.maximum_investment}"
          end
          
          if reward_id && !@campaign.rewards.available.exists?(id: reward_id)
            result[:valid] = false
            result[:message] = "Selected reward is no longer available"
            result[:errors][:reward_id] = ["Selected reward is no longer available"]
            Rails.logger.error "Reward not available: #{reward_id}"
          end

          # Subaccount validation - with enhanced checking
          if result[:valid]
            subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)
            unless subaccount&.subaccount_code.present?
              result[:valid] = false
              result[:message] = 'Fundraiser does not meet requirements for raising funds'
              result[:errors][:base] = ['Fundraiser does not meet requirements for raising funds']
              result[:code] = 'MISSING_ACCOUNT_NUMBER'
              Rails.logger.error "Missing subaccount for fundraiser: #{@campaign.fundraiser_id}"
            else
              # Validate subaccount with Paystack
              subaccount_valid = validate_subaccount_with_paystack(subaccount.subaccount_code)
              unless subaccount_valid
                result[:valid] = false
                result[:message] = 'Fundraiser payment account is not properly configured'
                result[:errors][:base] = ['Fundraiser payment account is not properly configured']
                result[:code] = 'INVALID_SUBACCOUNT'
                Rails.logger.error "Invalid subaccount for fundraiser: #{@campaign.fundraiser_id}, subaccount: #{subaccount.subaccount_code}"
              end
            end
          end

          # Campaign status validation
          if result[:valid] && !@campaign.live?
            result[:valid] = false
            result[:message] = "Campaign is not currently accepting investments"
            result[:errors][:base] = ["Campaign is not currently accepting investments (status: #{@campaign.equity_status})"]
            Rails.logger.error "Campaign not live: status=#{@campaign.equity_status}"
          end

          # Check if investment would exceed available shares (SOURCE OF TRUTH)
          if result[:valid] && @campaign.shares_available <= 0
            result[:valid] = false
            result[:message] = "No shares available for investment"
            result[:errors][:base] = ["No shares available for investment"]
            Rails.logger.error "No shares available: #{@campaign.shares_available}"
          end

          if result[:valid]
            price_per_share = @campaign.valuation.to_f / @campaign.total_shares.to_f
            requested_shares = (amount / price_per_share).round(4)
            
            if requested_shares > @campaign.shares_available
              available_amount = (@campaign.shares_available * price_per_share).floor
              result[:valid] = false
              result[:message] = "Not enough shares available. Maximum investment possible: #{@campaign.currency_symbol}#{available_amount}"
              result[:errors][:amount] = ["Not enough shares available. Maximum: #{@campaign.currency_symbol}#{available_amount}"]
              Rails.logger.error "Shares exceeded: requested=#{requested_shares}, available=#{@campaign.shares_available}"
            end
          end

          # Build error message from all errors
          unless result[:valid]
            result[:message] ||= result[:errors].map { |field, messages| 
              "#{field.to_s.humanize} #{messages.join(', ')}" 
            }.join('; ')
          end

          Rails.logger.info "Validation result: #{result.inspect}"
          result
        end

        def validate_subaccount_with_paystack(subaccount_code)
          return false unless subaccount_code.present?
          
          paystack_service = PaystackService.new
          begin
            # Try to fetch the subaccount to validate it exists
            response = paystack_service.fetch_subaccount(subaccount_code)
            response[:status] == true
          rescue => e
            Rails.logger.error "Error validating subaccount #{subaccount_code}: #{e.message}"
            false
          end
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
            finalized: false,
            cancellation_window_ended: false,
            metadata: investment.metadata
          }

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
            Rails.logger.error "Missing subaccount for fundraiser: #{@campaign.fundraiser_id}"
            return {
              success: false, 
              error: 'Fundraiser does not meet requirements for raising funds',
              code: 'MISSING_ACCOUNT_NUMBER'
            }
          end

          paystack_service = PaystackService.new
          
          begin
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
                metadata: investment.metadata.merge(metadata)
              )

              Rails.logger.info "Payment initialized successfully for investment #{investment.id}, reference: #{response[:data][:reference]}"

              {
                success: true,
                data: {
                  authorization_url: response[:data][:authorization_url],
                  redirect_url: redirect_url,
                  reference: response[:data][:reference],
                  investment: EquityInvestmentSerializer.new(investment).as_json,
                  total_investors: @campaign.total_investors
                }
              }
            else
              # Parse the actual error message from Paystack
              error_message = parse_paystack_error(response)
              error_code = response.dig(:body, 'code') || response[:data]&.[](:code) || 'PAYMENT_INIT_FAILED'
              
              Rails.logger.error "Paystack initialization failed: #{error_message}"
              
              # Update investment status to failed
              investment.update!(
                status: EquityInvestment::STATUS_FAILED,
                metadata: investment.metadata.merge(
                  'payment_error' => error_message,
                  'payment_error_code' => error_code,
                  'payment_failed_at' => Time.current.iso8601,
                  'paystack_response' => response
                )
              )
              
              {
                success: false, 
                error: error_message,
                code: error_code,
                details: "Please contact support. Error: #{error_message}"
              }
            end
          rescue => e
            Rails.logger.error "Exception during payment initialization: #{e.message}\n#{e.backtrace.join("\n")}"
            # Update investment status to failed
            investment.update!(
              status: EquityInvestment::STATUS_FAILED,
              metadata: investment.metadata.merge(
                'payment_exception' => e.message,
                'payment_failed_at' => Time.current.iso8601
              )
            )
            
            {
              success: false, 
              error: "Payment service error: #{e.message}",
              code: 'PAYMENT_SERVICE_ERROR'
            }
          end
        end

        def parse_paystack_error(response)
          # Try to extract the actual error message from Paystack response
          if response[:body].is_a?(String)
            begin
              parsed_body = JSON.parse(response[:body])
              return parsed_body['message'] if parsed_body['message']
            rescue JSON::ParserError
              # If parsing fails, use the original message
            end
          elsif response[:body].is_a?(Hash)
            return response[:body]['message'] if response[:body]['message']
          end
          
          # Fallback to the general message
          response[:message] || 'Payment initialization failed'
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
          # Allow both nested and flat structures for backward compatibility
          if params[:equity_investment].present?
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
          else
            # Fallback to flat structure if equity_investment key is missing
            params.permit(
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
            # issuer_signature_url: @campaign.fundraiser&.latest_kyc&.signature_image_url
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