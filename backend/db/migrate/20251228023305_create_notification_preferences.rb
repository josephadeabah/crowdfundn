class CreateNotificationPreferences < ActiveRecord::Migration[7.1]
  def change
    # Create table only if it doesn't exist
    create_table :notification_preferences, if_not_exists: true do |t|
      t.references :user, null: false, foreign_key: true
      
      # Investor reporting notifications
      t.boolean :financial_statements, default: true
      t.boolean :valuation_updates, default: true
      t.boolean :monthly_reports, default: true
      t.boolean :quarterly_reports, default: true
      t.boolean :annual_reports, default: true
      t.boolean :campaign_updates, default: true
      t.boolean :portfolio_updates, default: true
      
      # Delivery methods
      t.boolean :email_notifications, default: true
      t.boolean :push_notifications, default: true
      t.boolean :in_app_notifications, default: true
      
      # Frequency
      t.string :summary_frequency, default: 'weekly' # 'daily', 'weekly', 'monthly', 'none'
      t.time :preferred_time # Preferred time of day for notifications
      
      t.timestamps
    end

    # Add index only if it doesn't exist
    add_index :notification_preferences, :user_id, unique: true, if_not_exists: true
  end
end