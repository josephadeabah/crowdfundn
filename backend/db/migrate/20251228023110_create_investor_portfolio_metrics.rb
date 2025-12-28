class CreateInvestorPortfolioMetrics < ActiveRecord::Migration[7.1]
  def change
    create_table :investor_portfolio_metrics do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, foreign_key: true # null for overall portfolio metrics
      t.references :equity_investment, foreign_key: true
      
      # Portfolio metrics
      t.decimal :total_invested, precision: 20, scale: 2, default: 0.0
      t.decimal :current_value, precision: 20, scale: 2, default: 0.0
      t.decimal :total_returns, precision: 20, scale: 2, default: 0.0
      t.decimal :roi, precision: 10, scale: 2, default: 0.0
      t.decimal :moic, precision: 10, scale: 2, default: 0.0
      t.decimal :irr, precision: 10, scale: 2, default: 0.0
      
      # Risk metrics
      t.decimal :portfolio_concentration, precision: 5, scale: 4, default: 0.0
      t.decimal :volatility, precision: 5, scale: 4, default: 0.0
      t.decimal :sharpe_ratio, precision: 5, scale: 4, default: 0.0
      t.string :risk_category # 'low', 'medium', 'high'
      
      # Time-based metrics
      t.date :calculation_date, null: false
      t.string :period # 'daily', 'weekly', 'monthly', 'quarterly'
      t.jsonb :breakdown, default: {} # Detailed breakdown by campaign
      t.jsonb :trend_data, default: {} # Historical trend
      t.jsonb :benchmarks, default: {} # Comparison with benchmarks
      
      t.timestamps
    end

    add_index :investor_portfolio_metrics, [:user_id, :calculation_date, :campaign_id], 
              unique: true, name: 'idx_investor_metrics_user_date_campaign'
    add_index :investor_portfolio_metrics, [:user_id, :period]
    add_index :investor_portfolio_metrics, :calculation_date
  end
end