class AddTransferColumnsToSubaccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :subaccounts, :transfer_code, :string, null: true
    add_column :subaccounts, :amount, :integer, null: true
    add_column :subaccounts, :status, :string, default: 'pending', null: true
    add_column :subaccounts, :failure_reason, :string, null: true
    add_column :subaccounts, :completed_at, :datetime, null: true
    add_column :subaccounts, :reversed_at, :datetime, null: true
    add_reference :subaccounts, :campaign, foreign_key: true, null: true
  end
end
