class AddTotalSuccessfulDonationsToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :total_successful_donations, :decimal, precision: 15, scale: 2, default: 0.0, null: false
  end
end
