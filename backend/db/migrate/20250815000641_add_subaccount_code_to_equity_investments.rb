# db/migrate/[timestamp]_add_subaccount_code_to_equity_investments.rb
class AddSubaccountCodeToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :equity_investments, :subaccount_code, :string

    # Add index if you'll be querying by this column frequently
    add_index :equity_investments, :subaccount_code
  end
end