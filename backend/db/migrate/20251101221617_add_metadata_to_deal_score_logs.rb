# db/migrate/20251101000000_add_metadata_to_deal_score_logs.rb
class AddMetadataToDealScoreLogs < ActiveRecord::Migration[7.1]
  def change
    add_column :deal_score_logs, :metadata, :jsonb, default: {}
    
    # Add new AI analysis fields to campaigns table for enhanced analysis
    add_column :campaigns, :ai_sentiment, :string
    add_column :campaigns, :ai_team_assessment, :string
    add_column :campaigns, :ai_market_opportunity, :string
    
    add_index :deal_score_logs, :metadata, using: :gin
    add_index :campaigns, :ai_sentiment
    add_index :campaigns, :ai_team_assessment
    add_index :campaigns, :ai_market_opportunity
  end
end