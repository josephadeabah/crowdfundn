# db/migrate/20251101001307_create_deal_score_logs.rb
class CreateDealScoreLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_score_logs do |t|
      t.references :campaign, null: false, foreign_key: true
      t.text :prompt, null: false
      t.text :response, null: false
      t.jsonb :analysis_data
      t.decimal :risk_score, precision: 5, scale: 2
      t.decimal :deal_score, precision: 5, scale: 2
      t.string :risk_category
      t.text :key_risks, array: true, default: []
      t.text :strengths, array: true, default: []
      t.text :recommendations, array: true, default: []
      t.string :analysis_type
      t.datetime :analyzed_at

      t.timestamps
    end

    add_index :deal_score_logs, [:campaign_id, :analyzed_at]
    add_index :deal_score_logs, :risk_score
    add_index :deal_score_logs, :deal_score

    # Add AI analysis fields to campaigns table
    add_column :campaigns, :ai_deal_score, :decimal, precision: 5, scale: 2
    add_column :campaigns, :ai_risk_score, :decimal, precision: 5, scale: 2
    add_column :campaigns, :ai_risk_category, :string
    add_column :campaigns, :ai_analysis_updated_at, :datetime

    add_index :campaigns, :ai_deal_score
    add_index :campaigns, :ai_risk_score
    add_index :campaigns, :ai_risk_category
  end
end