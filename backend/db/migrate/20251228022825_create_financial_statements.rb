class CreateFinancialStatements < ActiveRecord::Migration[7.1]
  def change
    create_table :financial_statements do |t|
      t.references :campaign, null: false, foreign_key: true
      t.string :period_type, null: false # 'monthly', 'quarterly', 'annual'
      t.date :period_start, null: false
      t.date :period_end, null: false
      t.decimal :revenue, precision: 20, scale: 2, default: 0.0
      t.decimal :expenses, precision: 20, scale: 2, default: 0.0
      t.decimal :gross_profit, precision: 20, scale: 2, default: 0.0
      t.decimal :net_income, precision: 20, scale: 2, default: 0.0
      t.decimal :cash_flow, precision: 20, scale: 2, default: 0.0
      t.decimal :assets, precision: 20, scale: 2, default: 0.0
      t.decimal :liabilities, precision: 20, scale: 2, default: 0.0
      t.decimal :equity, precision: 20, scale: 2, default: 0.0
      t.decimal :burn_rate, precision: 20, scale: 2, default: 0.0
      t.decimal :runway_months, precision: 5, scale: 2, default: 0.0
      
      # SaaS/Product specific metrics
      t.decimal :mrr, precision: 20, scale: 2, default: 0.0
      t.decimal :arr, precision: 20, scale: 2, default: 0.0
      t.decimal :customer_acquisition_cost, precision: 10, scale: 2, default: 0.0
      t.decimal :lifetime_value, precision: 10, scale: 2, default: 0.0
      t.decimal :churn_rate, precision: 5, scale: 4, default: 0.0
      
      # E-commerce/Marketplace
      t.decimal :gmv, precision: 20, scale: 2, default: 0.0
      t.integer :active_customers
      t.decimal :average_order_value, precision: 10, scale: 2, default: 0.0
      
      # Status and metadata
      t.string :status, default: 'draft' # draft, published, archived
      t.boolean :is_public, default: false
      t.datetime :published_at
      t.jsonb :metadata, default: {}
      
      t.timestamps
    end

    add_index :financial_statements, [:campaign_id, :period_type, :period_start], 
              unique: true, name: 'idx_financial_statements_campaign_period'
    add_index :financial_statements, :status
    add_index :financial_statements, :published_at
  end
end