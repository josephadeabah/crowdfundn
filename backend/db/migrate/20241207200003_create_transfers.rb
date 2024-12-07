class CreateTransfers < ActiveRecord::Migration[7.1]
  def change
    create_table :transfers do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true
      t.string :business_name
      t.string :account_number
      t.decimal :amount
      t.string :transfer_code
      t.string :failure_reason
      t.datetime :completed_at
      t.datetime :reversed_at
      t.string :reference

      t.timestamps
    end
  end
end
