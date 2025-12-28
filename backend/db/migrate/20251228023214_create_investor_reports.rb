class CreateInvestorReports < ActiveRecord::Migration[7.1]
  def change
    create_table :investor_reports do |t|
      t.references :campaign, null: false, foreign_key: true
      t.string :report_type, null: false # 'monthly', 'quarterly', 'annual', 'valuation_update', 'special'
      t.string :title, null: false
      t.text :executive_summary
      t.text :key_highlights
      t.text :challenges_risks
      t.text :forward_outlook
      t.date :report_date, null: false
      t.date :period_start
      t.date :period_end
      t.string :status, default: 'draft' # draft, published, archived
      t.boolean :notify_investors, default: true
      t.datetime :published_at
      t.references :published_by, foreign_key: { to_table: :users }
      t.integer :download_count, default: 0
      t.jsonb :metadata, default: {}
      
      t.timestamps
    end

    add_index :investor_reports, [:campaign_id, :report_type, :report_date], 
              unique: true, name: 'idx_investor_reports_campaign_type_date'
    add_index :investor_reports, :status
    add_index :investor_reports, :published_at
  end
end