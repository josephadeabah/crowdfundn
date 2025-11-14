class AddCreatedByIdToClubInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :club_investments, :created_by_id, :integer
    add_foreign_key :club_investments, :users, column: :created_by_id
    add_index :club_investments, :created_by_id
  end
end
