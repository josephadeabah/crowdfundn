# app/controllers/api/v1/ai/deal_scoring_controller.rb
module Api
  module V1
    module AI
      class DealScoringController < ApplicationController
        before_action :authenticate_user!
        before_action :set_campaign, only: [:analyze, :analysis_history, :similar_deals]

        # POST /api/v1/ai/deal_scoring/analyze
        def analyze
          authorize! :read, @campaign

          result = AI::DealScoringService.analyze_campaign(@campaign)
          
          if result[:success]
            render json: {
              success: true,
              analysis: result[:analysis],
              deal_score: result[:analysis]['deal_score'],
              risk_score: result[:analysis]['risk_score'],
              risk_category: result[:analysis]['risk_category'], # ✅ FIXED: removed extra single quote
              log_id: result[:log]&.id
            }
          else
            render json: { success: false, error: result[:error] }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/ai/deal_scoring/analysis_history
        def analysis_history
          authorize! :read, @campaign

          logs = @campaign.deal_score_logs.recent.limit(10)
          
          render json: {
            campaign_id: @campaign.id,
            current_scores: {
              deal_score: @campaign.ai_deal_score,
              risk_score: @campaign.ai_risk_score,
              risk_category: @campaign.ai_risk_category,
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
                key_risks: log.key_risks,
                strengths: log.strengths
              }
            end
          }
        end

        # GET /api/v1/ai/deal_scoring/similar_deals
        def similar_deals
          authorize! :read, @campaign

          similar_deals = AI::SimilarDealsService.new(@campaign).find_similar
          
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

        # GET /api/v1/ai/deal_scoring/dashboard_metrics
        def dashboard_metrics
          authorize! :read, :ai_dashboard

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
          @campaign = Campaign.find(params[:campaign_id])
        end
      end
    end
  end
end