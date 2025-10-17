module Api
  module V1
    module Fundraisers
      class InvestmentCancellationsController < ApplicationController
        before_action :authenticate_request
        before_action :set_investment

        def create
          if @investment.can_be_cancelled?
            ActiveRecord::Base.transaction do
              if @investment.cancel!(cancellation_params[:reason])
                # Success response
                render json: {
                  success: true,
                  message: 'Investment cancelled successfully',
                  investment: EquityInvestmentSerializer.new(@investment).as_json,
                  refund_status: @investment.metadata&.[]('refund_status') || 'processing'
                }, status: :ok
              else
                # If cancel! returns false (unlikely with your current implementation)
                render json: {
                  success: false,
                  error: 'Failed to cancel investment',
                  details: @investment.errors.full_messages
                }, status: :unprocessable_entity
              end
            end
          else
            render json: {
              success: false,
              error: 'Investment cannot be cancelled',
              details: cancellation_error_details
            }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "Investment cancellation error: #{e.message}"
          render json: {
            success: false,
            error: 'An unexpected error occurred while cancelling the investment'
          }, status: :internal_server_error
        end

        private

        def set_investment
          @investment = @current_user.equity_investments.find(params[:investment_id])
        rescue ActiveRecord::RecordNotFound
          render json: { 
            success: false,
            error: 'Investment not found' 
          }, status: :not_found
        end

        def cancellation_params
          params.require(:cancellation).permit(:reason)
        end
        
        def cancellation_error_details
          if @investment.cancel_window_expires_at && @investment.cancel_window_expires_at <= Time.current
            "Cancellation window expired on #{@investment.cancel_window_expires_at}"
          elsif !@investment.committed?
            "Investment status is #{@investment.status}, not committed"
          else
            "Unknown cancellation restriction"
          end
        end
      end
    end
  end
end