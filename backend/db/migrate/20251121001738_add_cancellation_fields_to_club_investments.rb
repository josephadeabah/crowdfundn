class AddCancellationFieldsToClubInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :club_investments, :committed_at, :datetime
    add_column :club_investments, :cancel_window_expires_at, :datetime
    add_column :club_investments, :cancellation_reason, :text
    add_column :club_investments, :canceled_at, :datetime
    add_column :club_investments, :finalized_at, :datetime
    
    # Add indexes for better query performance
    add_index :club_investments, :committed_at
    add_index :club_investments, :cancel_window_expires_at
    add_index :club_investments, :canceled_at
    add_index :club_investments, :finalized_at
  end
end
