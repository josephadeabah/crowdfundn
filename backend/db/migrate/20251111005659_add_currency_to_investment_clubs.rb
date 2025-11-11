class AddCurrencyToInvestmentClubs < ActiveRecord::Migration[7.1]
  def change
    add_column :investment_clubs, :currency, :string, default: 'GHS'
  end
end
