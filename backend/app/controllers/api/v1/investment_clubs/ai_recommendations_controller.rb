# app/controllers/api/v1/investment_clubs/ai_recommendations_controller.rb
module Api
  module V1
    module InvestmentClubs
      class AiRecommendationsController < ApplicationController
        require Rails.root.join('app/services/ai/club_recommendation_service')

        before_action :authenticate_request
        before_action :set_investment_club
        before_action :check_membership

        # GET /api/v1/investment_clubs/:id/ai_recommendations
        def index
          limit = params[:limit] || 10
          risk_tolerance = params[:risk_tolerance]
          investment_focus = params[:investment_focus]

          recommendation_service = AI::ClubRecommendationService.new(@investment_club, @current_user)
          result = recommendation_service.recommend_campaigns(
            limit: limit.to_i,
            risk_tolerance: risk_tolerance,
            investment_focus: investment_focus
          )

          if result[:success]
            render json: {
              success: true,
              recommendations: result[:recommendations].map { |rec| format_recommendation(rec) },
              matching_criteria: result[:matching_criteria],
              total_considered: result[:total_considered],
              club_risk_profile: result[:club_risk_profile] # Use the one from result instead of calling method again
            }
          else
            render json: { 
              success: false, 
              error: result[:error],
              recommendations: []
            }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/investment_clubs/:id/ai_recommendations/explain?campaign_id=:campaign_id
        def explain
          campaign = Campaign.find_by(id: params[:campaign_id])
          
          unless campaign
            return render json: { 
              success: false, 
              error: "Campaign not found" 
            }, status: :not_found
          end

          begin
            # Add timeout protection on the backend too
            Timeout.timeout(75) do # 75 second backend timeout
              recommendation_service = AI::ClubRecommendationService.new(@investment_club, @current_user)
              result = recommendation_service.explain_recommendation(campaign)

              if result[:success]
                render json: {
                  success: true,
                  explanation: result[:explanation],
                  club_alignment: result[:club_alignment],
                  key_factors: result[:key_factors],
                  campaign: format_campaign_for_explanation(campaign),
                  processing_time: "completed" # Add this for debugging
                }
              else
                render json: { 
                  success: false, 
                  error: result[:error],
                  fallback_explanation: result[:fallback_explanation],
                  processing_time: "failed"
                }, status: :unprocessable_entity
              end
            end
          rescue Timeout::Error
            render json: { 
              success: false, 
              error: "Explanation generation timeout",
              fallback_explanation: "The analysis is taking longer than expected. Please try again in a moment.",
              processing_time: "timeout"
            }, status: :request_timeout
          end
        end

        # GET /api/v1/investment_clubs/:id/ai_recommendations/risk_profile
        def risk_profile
          recommendation_service = AI::ClubRecommendationService.new(@investment_club, @current_user)
          risk_profile = recommendation_service.get_club_risk_profile

          render json: {
            success: true,
            risk_profile: risk_profile,
            club: {
              id: @investment_club.id,
              name: @investment_club.name,
              mission: @investment_club.mission
            }
          }
        end

        private

        def calculate_performance_percentage(campaign)
          return 0 if campaign.goal_amount.to_f <= 0
          campaign.performance_percentage || ((campaign.current_amount.to_f / campaign.goal_amount.to_f) * 100).round(2)
        end

        def set_investment_club
          @investment_club = InvestmentClub.find_by(slug: params[:id])
          unless @investment_club
            render json: { success: false, error: "Investment club not found" }, status: :not_found
          end
        end

        def check_membership
          unless @investment_club.is_member?(@current_user)
            render json: { success: false, error: "Not a member of this investment club" }, status: :forbidden
          end
        end

        def format_recommendation(recommendation)
          campaign = recommendation[:campaign]
          {
            campaign: format_campaign_basic(campaign),
            match_score: recommendation[:match_score],
            reasoning: recommendation[:reasoning],
            key_alignment_factors: recommendation[:key_alignment_factors],
            potential_concerns: recommendation[:potential_concerns],
            investment_confidence: recommendation[:investment_confidence] || "medium", # Add this new field
            ai_analysis_available: campaign.comprehensive_ai_analysis_present?,
            quick_assessment: {
              risk_alignment: calculate_risk_alignment_display(campaign),
              strategic_fit: calculate_strategic_fit_display(campaign),
              financial_suitability: calculate_financial_suitability_display(campaign),
              fundraiser_trust: calculate_fundraiser_trust_display(campaign) # Add this new field
            }
          }
        end

        def format_campaign_basic(campaign)
          performance_percentage = calculate_performance_percentage(campaign)
          
          {
            id: campaign.id,
            title: campaign.title,
            category: campaign.category,
            description: campaign.description.to_plain_text.truncate(200),
            goal_amount: campaign.goal_amount,
            current_amount: campaign.current_amount,
            performance_percentage: performance_percentage, # Use calculated value
            currency: campaign.currency,
            location: campaign.location,
            status: campaign.status,
            ai_deal_score: campaign.ai_deal_score,
            ai_risk_score: campaign.ai_risk_score,
            ai_risk_category: campaign.ai_risk_category,
            fundraiser: {
              id: campaign.fundraiser.id,
              name: campaign.fundraiser.full_name,
              kyc_verified: campaign.fundraiser.kyc_verified?,
              reports_count: campaign.fundraiser.reports_against.where('created_at >= ?', 6.months.ago).count # Add this
            },
            media_url: campaign.media_url,
            total_donors: campaign.total_donors,
            remaining_days: campaign.remaining_days,
            # Add equity campaign specific fields
            type: campaign.class.name,
            equity_data: campaign.is_a?(EquityCampaign) ? {
              valuation: campaign.valuation,
              equity_offered: campaign.equity_offered,
              shares_available: campaign.shares_available,
              equity_status: campaign.equity_status,
              company_name: campaign.company_name,
              funding_round: campaign.funding_round
            } : nil
          }
        end

        def format_campaign_for_explanation(campaign)
          format_campaign_basic(campaign).merge({
            team_assessment: campaign.ai_team_assessment_data,
            market_analysis: campaign.ai_market_analysis,
            investment_thesis: campaign.investment_thesis,
            upside_downside_analysis: campaign.upside_downside_analysis,
            team_members: campaign.campaign_team_members.includes(:user).map do |member|
              {
                id: member.id,
                name: member.name,
                role: member.role,
                title: member.title,
                equity_percentage: member.equity_percentage,
                description: member.description
              }
            end
          })
        end

        def calculate_risk_alignment_display(campaign)
          return "unknown" unless campaign.ai_risk_score
          
          case campaign.ai_risk_score
          when 0..30 then "low"
          when 31..60 then "medium" 
          when 61..100 then "high"
          else "unknown"
          end
        end

        def calculate_strategic_fit_display(campaign)
          # Enhanced strategic fit based on category alignment with club
          club_mission = @investment_club.mission.to_s.downcase
          campaign_category = campaign.category.to_s.downcase
          campaign_description = campaign.description.to_s.downcase
          
          # Check multiple fields for better alignment
          alignment_score = 0
          alignment_score += 1 if club_mission.include?(campaign_category) || campaign_category.include?(@investment_club.mission.to_s.downcase)
          alignment_score += 1 if campaign_description.include?(@investment_club.mission.to_s.downcase[0..20]) # Check first part of mission
          
          case alignment_score
          when 2 then "high"
          when 1 then "medium"
          else "low"
          end
        end

        def calculate_financial_suitability_display(campaign)
          club_balance = @investment_club.current_balance.to_f
          campaign_goal = campaign.goal_amount.to_f
          
          if campaign_goal <= club_balance * 0.1
            "excellent"
          elsif campaign_goal <= club_balance * 0.3
            "good"
          elsif campaign_goal <= club_balance * 0.6
            "moderate"
          elsif campaign_goal <= club_balance
            "challenging"
          else
            "very challenging"
          end
        end

        def calculate_fundraiser_trust_display(campaign)
          fundraiser = campaign.fundraiser
          return "unknown" unless fundraiser
          
          # Calculate trust score based on multiple factors
          trust_score = 0
          trust_score += 4 if fundraiser.kyc_verified?
          
          recent_reports = fundraiser.reports_against
                                   .where('created_at >= ?', 6.months.ago)
                                   .where(status: ['pending', 'under_review'])
          trust_score += 3 if recent_reports.empty?
          
          successful_campaigns = fundraiser.campaigns.where(status: 'completed')
          trust_score += [successful_campaigns.count, 3].min
          
          case trust_score
          when 8..10 then "high"
          when 5..7 then "medium"
          else "low"
          end
        end
      end
    end
  end
end