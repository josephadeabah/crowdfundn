# app/controllers/api/v1/ai_scoring/deal_scoring_controller.rb
module Api
  module V1
    module AiScoring
      class DealScoringController < ApplicationController

        # Add these require statements
        require Rails.root.join('app/services/ai/deal_scoring_service')
        require Rails.root.join('app/services/ai/similar_deals_service')

        before_action :authenticate_request
        before_action :set_campaign, only: [:analyze, :analysis_history, :similar_deals]

        # POST /api/v1/ai_scoring/deal_scoring/analyze
        def analyze
          result = ::AI::DealScoringService.analyze_campaign(@campaign)
          
          if result[:success]
            render json: {
              success: true,
              analysis: result[:analysis],
              deal_score: result[:analysis]['deal_score'],
              risk_score: result[:analysis]['risk_score'],
              risk_category: result[:analysis]['risk_category'],
              log_id: result[:log]&.id
            }
          else
            render json: { success: false, error: result[:error] }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/ai_scoring/deal_scoring/analysis_history
        def analysis_history
          logs = @campaign.deal_score_logs.recent.limit(10)
          
          render json: {
            campaign_id: @campaign.id,
            current_scores: {
              deal_score: @campaign.ai_deal_score,
              risk_score: @campaign.ai_risk_score,
              risk_category: @campaign.ai_risk_category,
              sentiment_analysis: @campaign.ai_sentiment,
              team_assessment: @campaign.ai_team_assessment,
              market_opportunity: @campaign.ai_market_opportunity,
              updated_at: @campaign.ai_analysis_updated_at
            },
            analysis_history: logs.map do |log|
              {
                id: log.id,
                analysis_type: log.analysis_type,
                deal_score: log.deal_score,
                risk_score: log.risk_score,
                risk_category: log.risk_category,
                analyzed_at: log.analyzed_at,
                downside_risks: log.downside_risks || log.key_risks, # Backward compatible
                upside_potential: log.upside_potential,
                strengths: log.strengths,
                sentiment_analysis: log.sentiment_analysis,
                team_assessment: log.team_assessment,
                market_opportunity: log.market_opportunity,
                investment_thesis: log.investment_thesis
              }
            end
          }
        end

        # GET /api/v1/ai_scoring/deal_scoring/similar_deals
        def similar_deals
          similar_deals = ::AI::SimilarDealsService.new(@campaign).find_similar
          
          render json: {
            campaign_id: @campaign.id,
            similar_deals: similar_deals.map do |similar|
              campaign = similar[:campaign]
              {
                id: campaign.id,
                title: campaign.title,
                type: campaign.class.name,
                goal_amount: campaign.goal_amount,
                currency: campaign.currency,
                performance_percentage: campaign.performance_percentage,
                deal_score: campaign.ai_deal_score,
                risk_score: campaign.ai_risk_score,
                similarity_score: similar[:similarity_score],
                common_features: similar[:common_features]
              }
            end
          }
        end

        # GET /api/v1/ai_scoring/deal_scoring/dashboard_metrics
        def dashboard_metrics
          campaigns = Campaign.where.not(ai_deal_score: nil)
          
          metrics = {
            total_analyzed: campaigns.count,
            average_deal_score: campaigns.average(:ai_deal_score)&.round(2),
            average_risk_score: campaigns.average(:ai_risk_score)&.round(2),
            risk_distribution: campaigns.group(:ai_risk_category).count,
            top_deals: campaigns.order(ai_deal_score: :desc).limit(5).map do |campaign|
              {
                id: campaign.id,
                title: campaign.title,
                deal_score: campaign.ai_deal_score,
                risk_score: campaign.ai_risk_score
              }
            end
          }
          
          render json: { metrics: metrics }
        end

        private

        def set_campaign
          # Try to find by ID first, then by slug
          @campaign = Campaign.find_by(id: params[:campaign_id]) || 
                      Campaign.find_by(slug: params[:campaign_id])
          
          unless @campaign
            render json: { 
              success: false, 
              error: "Campaign not found: #{params[:campaign_id]}" 
            }, status: :not_found
            return false
          end
        end
      end
    end
  end
end