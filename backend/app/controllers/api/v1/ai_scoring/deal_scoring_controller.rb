# app/controllers/api/v1/ai_scoring/deal_scoring_controller.rb
module Api
  module V1
    module AiScoring
      class DealScoringController < ApplicationController
        include ActionController::Live

        before_action :authenticate_request
        before_action :set_campaign, only: [:analyze, :analysis_history, :similar_deals, :streaming_analyze]

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
              sentiment_analysis: result[:analysis]['sentiment_analysis'],
              team_assessment: result[:analysis]['team_assessment'],
              market_opportunity: result[:analysis]['market_opportunity'],
              funding_potential: result[:analysis]['funding_potential'],
              timing_assessment: result[:analysis]['timing_assessment'],
              competitive_advantage: result[:analysis]['competitive_advantage'],
              exit_potential: result[:analysis]['exit_potential'],
              log_id: result[:log]&.id
            }
          else
            render json: { success: false, error: result[:error] }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/ai_scoring/deal_scoring/streaming_analyze
        def streaming_analyze
          # Set SSE headers
          response.headers['Content-Type'] = 'text/event-stream'
          response.headers['Cache-Control'] = 'no-cache'
          response.headers['X-Accel-Buffering'] = 'no' # Disable buffering for nginx
          response.headers['Access-Control-Allow-Origin'] = '*'
          response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

          service = ::AI::DealScoringService.new(@campaign)
          
          begin
            # Use the enumerator-based streaming
            service.analyze_with_rails_streaming.each do |chunk_data|
              response.stream.write("data: #{chunk_data}\n\n")
            end
          rescue => e
            Rails.logger.error "Streaming analysis error: #{e.message}"
            Rails.logger.error e.backtrace.join("\n")
            response.stream.write("data: #{ { type: 'error', message: e.message }.to_json }\n\n")
          ensure
            response.stream.close
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
                downside_risks: log.downside_risks || log.key_risks,
                upside_potential: log.upside_potential,
                strengths: log.strengths,
                sentiment_analysis: log.sentiment_analysis,
                team_assessment: log.team_assessment,
                market_opportunity: log.market_opportunity,
                investment_thesis: log.investment_thesis,
                funding_potential: log.funding_potential,
                timing_assessment: log.timing_assessment,
                competitive_advantage: log.competitive_advantage,
                exit_potential: log.exit_potential,
                scalability_assessment: log.scalability_assessment,
                product_market_fit: log.product_market_fit,
                technology_assessment: log.technology_assessment,
                regulatory_risks: log.regulatory_risks,
                market_trends: log.market_trends,
                investor_alignment: log.investor_alignment,
                social_impact: log.social_impact,
                sustainability_score: log.sustainability_score
              }
            end,
            latest_analysis: extract_latest_analysis(logs.first)
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
                common_features: similar[:common_features],
                ai_metrics: similar[:ai_metrics]
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
            sentiment_distribution: campaigns.group(:ai_sentiment).count,
            team_assessment_distribution: campaigns.group(:ai_team_assessment).count,
            market_opportunity_distribution: campaigns.group(:ai_market_opportunity).count,
            top_deals: campaigns.order(ai_deal_score: :desc).limit(5).map do |campaign|
              {
                id: campaign.id,
                title: campaign.title,
                deal_score: campaign.ai_deal_score,
                risk_score: campaign.ai_risk_score,
                sentiment_analysis: campaign.ai_sentiment,
                team_assessment: campaign.ai_team_assessment,
                market_opportunity: campaign.ai_market_opportunity
              }
            end,
            high_potential_deals: campaigns.where(ai_deal_score: 80..100).limit(5).map do |campaign|
              {
                id: campaign.id,
                title: campaign.title,
                deal_score: campaign.ai_deal_score,
                risk_score: campaign.ai_risk_score,
                sentiment_analysis: campaign.ai_sentiment
              }
            end
          }
          
          render json: { metrics: metrics }
        end

        private

        def set_campaign
          # Handle both campaign_id parameter (from POST) and id parameter (from GET)
          campaign_id = params[:campaign_id] || params[:id]
          
          @campaign = Campaign.find_by(id: campaign_id) || 
                      Campaign.find_by(slug: campaign_id)
          
          unless @campaign
            render json: { 
              success: false, 
              error: "Campaign not found: #{campaign_id}" 
            }, status: :not_found
            return false
          end
        end

        def extract_latest_analysis(latest_log)
          return nil unless latest_log
          
          {
            downside_risks: latest_log.downside_risks || latest_log.key_risks,
            upside_potential: latest_log.upside_potential,
            strengths: latest_log.strengths,
            sentiment_analysis: latest_log.sentiment_analysis,
            team_assessment: latest_log.team_assessment,
            market_opportunity: latest_log.market_opportunity,
            investment_thesis: latest_log.investment_thesis,
            funding_potential: latest_log.funding_potential,
            timing_assessment: latest_log.timing_assessment,
            competitive_advantage: latest_log.competitive_advantage,
            exit_potential: latest_log.exit_potential,
            scalability_assessment: latest_log.scalability_assessment,
            product_market_fit: latest_log.product_market_fit,
            technology_assessment: latest_log.technology_assessment,
            regulatory_risks: latest_log.regulatory_risks,
            market_trends: latest_log.market_trends,
            investor_alignment: latest_log.investor_alignment,
            social_impact: latest_log.social_impact,
            sustainability_score: latest_log.sustainability_score
          }
        end
      end
    end
  end
end