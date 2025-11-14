class AddProposedSharePercentageToClubInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :club_investments, :proposed_share_percentage, :decimal, precision: 5, scale: 2
  end
end
