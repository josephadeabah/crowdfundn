# app/controllers/api/v1/club_contributions_controller.rb
module Api
  module V1
    class ClubContributionsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership

      def create
        if params[:amount].to_f < @club.minimum_monthly_contribution
          return render json: { 
            error: "Minimum contribution is #{@club.currency_symbol}#{@club.minimum_monthly_contribution}" 
          }, status: :unprocessable_entity
        end

        contribution = @club.investment_club_contributions.new(
          user: @current_user,
          amount: params[:amount],
          currency: @club.currency || 'USD',
          status: 'pending'
        )

        if contribution.save
          # Initialize payment using PaystackService
          result = initialize_contribution_payment(contribution)
          
          if result[:status] == true
            render json: { 
              success: true, 
              contribution: ClubContributionSerializer.new(contribution).as_json,
              authorization_url: result[:data][:authorization_url],
              reference: result[:data][:reference]
            }, status: :created
          else
            contribution.update!(status: 'failed')
            render json: { 
              success: false, 
              error: result[:message] || 'Payment initialization failed'
            }, status: :unprocessable_entity
          end
        else
          render json: { 
            success: false, 
            errors: contribution.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      private

      def set_club
        @club = InvestmentClub.find_by(slug: params[:investment_club_id])
        render json: { error: 'Club not found' }, status: :not_found unless @club
      end

      def verify_membership
        render json: { error: 'Club membership required' }, status: :forbidden unless @club.is_member?(@current_user)
      end

      def initialize_contribution_payment(contribution)
        paystack_service = PaystackService.new
        
        metadata = {
          type: 'club_contribution',
          contribution_id: contribution.id,
          club_id: @club.id,
          user_id: @current_user.id,
          club_name: @club.name
        }

        # Use your existing PaystackService initialize_transaction method
        paystack_service.initialize_transaction(
          email: @current_user.email,
          amount: contribution.amount,
          callback_url: Rails.application.routes.url_helpers.api_v1_fundraisers_paystack_webhook_receive_url,
          metadata: metadata,
          currency: contribution.currency.upcase
        )
      end
    end
  end
end