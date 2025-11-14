module Api
  module V1
    class VotesController < ApplicationController
      before_action :authenticate_request
      before_action :set_votable

      def create
        voting_service = VotingService.new(@votable, @current_user, params[:voting_session_id])
        
        result = voting_service.cast_vote(params[:vote_type], params[:reason])
        
        if result[:success]
          response_data = { 
            success: true, 
            vote: VoteSerializer.new(result[:vote]).as_json,
            voting_stats: voting_service.voting_stats
          }
          
          # Include updated votable status if it's a club investment
          if @votable.is_a?(ClubInvestment)
            response_data[:votable_status] = @votable.status
          end
          
          render json: response_data
        else
          render json: { 
            success: false, 
            error: result[:error] 
          }, status: :unprocessable_entity
        end
      end

      def index
        voting_service = VotingService.new(@votable, @current_user, params[:voting_session_id])
        
        render json: {
          votes: Vote.where(votable: @votable, voting_session_id: params[:voting_session_id])
                    .includes(:user)
                    .map { |v| VoteSerializer.new(v).as_json },
          voting_stats: voting_service.voting_stats,
          user_vote: voting_service.get_vote&.vote_type
        }
      end

      def destroy
        vote = Vote.find_by(
          votable: @votable,
          user: @current_user,
          voting_session_id: params[:voting_session_id]
        )
        
        if vote&.destroy
          render json: { success: true }
        else
          render json: { error: 'Vote not found' }, status: :not_found
        end
      end

      private

      def set_votable
        votable_class = params[:votable_type].classify.constantize
        @votable = votable_class.find(params[:votable_id])
      rescue NameError
        render json: { error: 'Invalid votable type' }, status: :bad_request
      end
    end
  end
end