class AddIndexesForCampaignsPerformance < ActiveRecord::Migration[7.1]
  # This migration adds indexes to the campaigns table to improve performance
  # for queries filtering by fundraiser_id, status, equity_status, and created_at.
  #
  # Indexes are crucial for optimizing database performance, especially for large datasets.
  # They allow the database to quickly locate and retrieve rows that match specific criteria,
  # significantly speeding up query execution times.
  def change
    add_index :campaigns, :fundraiser_id
    add_index :campaigns, :status
    add_index :campaigns, :equity_status
    add_index :campaigns, :created_at
  end
end