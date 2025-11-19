class AddEquityInvestmentColumnsToClubInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :club_investments, :shares, :decimal, precision: 20, scale: 4
    add_column :club_investments, :percentage, :decimal, precision: 10, scale: 6
    add_column :club_investments, :investment_date, :date
    add_column :club_investments, :certificate_number, :string
    add_column :club_investments, :transaction_reference, :string
    add_column :club_investments, :equity_investment_id, :integer
    add_column :club_investments, :current_value, :decimal, precision: 15, scale: 2
    add_column :club_investments, :notes, :text
    
    # Add index for better performance
    add_index :club_investments, :equity_investment_id
    add_index :club_investments, :certificate_number, unique: true
  end
end