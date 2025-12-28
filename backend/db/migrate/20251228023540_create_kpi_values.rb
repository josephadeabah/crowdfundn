class CreateKpiValues < ActiveRecord::Migration[7.1]
  def change
    create_table :kpi_values do |t|
      t.references :campaign_kpi, null: false, foreign_key: true
      t.references :financial_statement, foreign_key: true
      t.date :period_date, null: false
      t.decimal :value, precision: 20, scale: 4, null: false
      t.decimal :previous_value, precision: 20, scale: 4
      t.decimal :change_percentage, precision: 10, scale: 4
      t.boolean :is_actual, default: true # actual vs projected
      t.string :data_source # 'manual', 'imported', 'calculated'
      t.jsonb :metadata, default: {}
      
      t.timestamps
    end

    add_index :kpi_values, [:campaign_kpi_id, :period_date], unique: true
    add_index :kpi_values, :period_date
  end
end