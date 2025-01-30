class CreateFundraiserLeaderboardEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :fundraiser_leaderboard_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :total_raised
      t.integer :ranking

      t.timestamps
    end
  end
end
