class AddSettingsToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :accept_donations, :boolean
    add_column :campaigns, :leave_words_of_support, :boolean
    add_column :campaigns, :appear_in_search_results, :boolean
    add_column :campaigns, :suggested_fundraiser_lists, :boolean
    add_column :campaigns, :receive_donation_email, :boolean
    add_column :campaigns, :receive_daily_summary, :boolean
    add_column :campaigns, :is_public, :boolean
    add_column :campaigns, :enable_promotions, :boolean
    add_column :campaigns, :schedule_promotion, :boolean
    add_column :campaigns, :promotion_frequency, :string
    add_column :campaigns, :promotion_duration, :integer
  end
end
