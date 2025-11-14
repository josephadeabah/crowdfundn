class AddReferenceToClubInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :club_investments, :reference, :string
    add_index :club_investments, :reference, unique: true
  end
end
