class CreatePremiumSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :premium_subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.string :transaction_reference, null: false
      t.string :plan_name
      t.datetime :expires_at
      t.string :status, default: 'active'

      t.timestamps
    end

    add_index :premium_subscriptions, :transaction_reference, unique: true
  end
end