class AddClubInvestmentIdToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :equity_investments, :club_investment_id, :bigint
    add_index :equity_investments, :club_investment_id
    add_foreign_key :equity_investments, :club_investments
  end
end