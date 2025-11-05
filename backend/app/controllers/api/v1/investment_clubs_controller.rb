# app/controllers/api/v1/investment_clubs_controller.rb
module Api
  module V1
    class InvestmentClubsController < ApplicationController
      before_action :authenticate_request
      
      def index
        clubs = InvestmentClub.active.includes(:creator, :active_members)
        
        render json: {
          clubs: clubs.map { |club| InvestmentClubSerializer.new(club).as_json },
          pagination: pagination_data(clubs)
        }
      end
      
      def create
        result = InvestmentClubCreationService.new(@current_user, club_params).create
        
        if result[:success]
          render json: { 
            success: true, 
            club: InvestmentClubSerializer.new(result[:club]).as_json 
          }, status: :created
        else
          render json: { 
            success: false, 
            error: result[:errors] || result[:error] 
          }, status: :unprocessable_entity
        end
      end
      
      def show
        club = InvestmentClub.find_by(slug: params[:id])
        
        if club && (club.public? || club.is_member?(@current_user))
          render json: { 
            club: InvestmentClubSerializer.new(club, current_user: @current_user).as_json 
          }
        else
          render json: { error: 'Club not found or access denied' }, status: :not_found
        end
      end
      
      def update
        club = InvestmentClub.find_by(slug: params[:id])
        
        if club && club.is_admin?(@current_user)
          if club.update(club_params)
            render json: { 
              success: true, 
              club: InvestmentClubSerializer.new(club).as_json 
            }
          else
            render json: { 
              success: false, 
              errors: club.errors.full_messages 
            }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      private
      
      def club_params
        params.require(:investment_club).permit(
          :name, :mission, :minimum_monthly_contribution, 
          :investment_focus, :max_members, :club_type
        )
      end
    end
  end
end