class RemoveUniqueIndexFromClubInvestments < ActiveRecord::Migration[7.1]
  def up
    # Remove the unique index if it exists
    remove_index :club_investments, [:investment_club_id, :campaign_id] if index_exists?(:club_investments, [:investment_club_id, :campaign_id])
    
    # Add a non-unique index for performance instead
    add_index :club_investments, [:investment_club_id, :campaign_id]
  end

  def down
    # Remove the non-unique index
    remove_index :club_investments, [:investment_club_id, :campaign_id]
    
    # Add back the unique constraint if needed
    add_index :club_investments, [:investment_club_id, :campaign_id], unique: true
  end
end
