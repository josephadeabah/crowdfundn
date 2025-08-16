class AddIndexesForCampaignsPerformance < ActiveRecord::Migration[7.1]
  def change
    indexes_to_add = [
      [:fundraiser_id],
      [:status],
      [:end_date],
      [:created_at],
      [:status, :end_date] # compound index
    ]

    indexes_to_add.each do |columns|
      unless index_exists?(:campaigns, columns)
        add_index :campaigns, columns
      end
    end
  end
end