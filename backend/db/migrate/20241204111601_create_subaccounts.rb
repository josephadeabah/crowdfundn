class CreateSubaccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :subaccounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :subaccount_code
      t.string :subaccount_bank_code
      t.string :business_name
      t.string :bank_code
      t.string :account_number
      t.decimal :percentage_charge
      t.string :description
      t.text :metadata
      t.string :settlement_bank

      t.timestamps
    end
  end
end
