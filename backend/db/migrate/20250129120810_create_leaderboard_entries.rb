class CreateLeaderboardEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :leaderboard_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :points
      t.integer :ranking

      t.timestamps
    end
  end
end
