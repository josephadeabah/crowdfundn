# db/migrate/[timestamp]_add_fields_to_equity_investments.rb
class AddFieldsToEquityInvestments < ActiveRecord::Migration[7.0]
  def change
    add_column :equity_investments, :transaction_reference, :string
    add_column :equity_investments, :gross_amount, :decimal, precision: 10, scale: 2
    add_column :equity_investments, :net_amount, :decimal, precision: 10, scale: 2
    add_column :equity_investments, :platform_fee, :decimal, precision: 10, scale: 2
    add_column :equity_investments, :subaccount_code, :string
    add_column :equity_investments, :processed, :boolean, default: false
    add_column :equity_investments, :reward_id, :bigint
    add_column :equity_investments, :country, :string
    add_column :equity_investments, :ip_address, :string
    
    add_index :equity_investments, :transaction_reference, unique: true
    add_index :equity_investments, :reward_id
    add_foreign_key :equity_investments, :rewards, column: :reward_id
  end
end