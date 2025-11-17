# app/controllers/api/v1/club_contributions_controller.rb
module Api
  module V1
    class ClubContributionsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership

      def index
        contributions = @club.investment_club_contributions
                            .includes(:user)
                            .order(created_at: :desc)
                            .page(params[:page])
                            .per(params[:per_page] || 6)

        render json: {
          contributions: contributions.map { |c| ClubContributionSerializer.new(c).as_json },
          pagination: {
            current_page: contributions.current_page,
            total_pages: contributions.total_pages,
            total_count: contributions.total_count,
            per_page: contributions.limit_value
          }
        }
      end

      def create
        if params[:amount].to_f < @club.minimum_monthly_contribution
          return render json: { 
            error: "Minimum contribution is #{@club.currency_symbol}#{@club.minimum_monthly_contribution}" 
          }, status: :unprocessable_entity
        end

        contribution = @club.investment_club_contributions.new(
          user: @current_user,
          amount: params[:amount],
          currency: @club.currency || 'GHS',
          status: 'pending'
        )

        if contribution.save
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

      def verify
        reference = params[:reference]
        
        unless reference
          return render json: { error: 'Reference parameter is required' }, status: :bad_request
        end

        # Use PaystackService to verify the transaction
        paystack_service = PaystackService.new
        verification_result = paystack_service.verify_transaction(reference)

        unless verification_result[:status]
          return render json: { 
            success: false, 
            error: 'Transaction verification failed',
            paystack_error: verification_result[:message]
          }, status: :unprocessable_entity
        end

        transaction_data = verification_result[:data]
        
        # Check if transaction was successful
        if transaction_data[:status] != 'success'
          return render json: { 
            success: false, 
            error: "Transaction not successful: #{transaction_data[:status]}",
            status: transaction_data[:status]
          }, status: :unprocessable_entity
        end

        # Find contribution by reference with lock to prevent race conditions
        contribution = InvestmentClubContribution.find_by(transaction_reference: reference)
        
        unless contribution
          # If contribution not found by reference, try to find by metadata
          metadata = transaction_data[:metadata] || {}
          contribution_id = metadata[:contribution_id]
          
          if contribution_id
            contribution = InvestmentClubContribution.find_by(id: contribution_id)
          end
        end

        unless contribution
          return render json: { error: 'Contribution not found' }, status: :not_found
        end

        # FIXED: Use locking to prevent race conditions between webhook and manual verification
        contribution.with_lock do
          # If webhook hasn't processed it yet, update status but DON'T process
          if contribution.pending?
            contribution.update!(
              status: 'completed',
              transaction_reference: reference,
              paystack_fee: 0,
              amount_settled: contribution.amount
            )
            # NOTE: We don't call process_completion! here - let webhook handle it
          end
        end

        # Get updated membership data (webhook should have updated it)
        membership = @club.membership_for(@current_user)

        render json: { 
          success: true, 
          contribution: ClubContributionSerializer.new(contribution).as_json,
          transaction_status: transaction_data[:status],
          membership: membership ? {
            total_contributed: membership.total_contributed,
            contributed_share: membership.contributed_share
          } : nil,
          processed_by_webhook: contribution.processed_at.present?,
          already_processed: contribution.completed? && contribution.processed_at.present?
        }
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

        paystack_service.initialize_transaction(
          email: @current_user.email,
          amount: contribution.amount,
          callback_url: 'https://www.bantuhive.com/account#Your%20Clubs', # User redirect
          metadata: metadata,
          currency: @current_user.currency.upcase
        )
      end
    end
  end
end