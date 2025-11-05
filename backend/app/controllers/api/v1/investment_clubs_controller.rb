# app/controllers/api/v1/investment_clubs_controller.rb
module Api
  module V1
    class InvestmentClubsController < ApplicationController
      before_action :authenticate_request
      
      def index
        clubs = InvestmentClub.active.includes(
          :creator, 
          investment_club_memberships: :user
        )
        
        render json: {
          clubs: clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json }
        }
      end
      
      def create
        result = InvestmentClubCreationService.new(@current_user, club_params).create
        
        if result[:success]
          # Reload the club with associations for serialization
          club = InvestmentClub.includes(
            :creator, 
            investment_club_memberships: :user
          ).find(result[:club].id)
          
          render json: { 
            success: true, 
            club: InvestmentClubSerializer.new(club, current_user: @current_user).as_json 
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

      # app/controllers/api/v1/investment_clubs_controller.rb
      def portfolio
        club = InvestmentClub.find_by(slug: params[:id])
        
        if club && club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(club)
          portfolio_data = portfolio_service.calculate_portfolio
          
          render json: portfolio_data
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end

      def analytics
        club = InvestmentClub.find_by(slug: params[:id])
        
        if club && club.is_member?(@current_user)
          analytics_service = ClubAnalyticsService.new(club)
          analytics_data = analytics_service.calculate_analytics
          
          render json: analytics_data
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      private
      
      def club_params
        params.require(:investment_club).permit(
          :name, :mission, :minimum_monthly_contribution, 
          :investment_focus, :max_members, :club_type,
          :constitution_data
        )
      end
    end
  end
end