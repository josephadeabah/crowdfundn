class CreateCampaignKpis < ActiveRecord::Migration[7.1]
  def change
    create_table :campaign_kpis do |t|
      t.references :campaign, null: false, foreign_key: true
      t.string :kpi_type, null: false # 'financial', 'operational', 'growth', 'engagement'
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :unit # 'currency', 'percentage', 'number', 'days', etc.
      t.decimal :target_value, precision: 20, scale: 4
      t.string :target_period # 'monthly', 'quarterly', 'annual'
      t.boolean :is_primary, default: false
      t.boolean :is_public, default: false
      t.integer :display_order, default: 0
      t.jsonb :calculation_config, default: {}
      t.jsonb :metadata, default: {}
      
      t.timestamps
    end

    add_index :campaign_kpis, [:campaign_id, :slug], unique: true
    add_index :campaign_kpis, [:campaign_id, :kpi_type]
    add_index :campaign_kpis, :is_primary
  end
end