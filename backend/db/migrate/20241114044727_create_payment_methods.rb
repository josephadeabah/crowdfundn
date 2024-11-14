class CreatePaymentMethods < ActiveRecord::Migration[7.1]
  def change
    create_table :payment_methods do |t|
      t.references :user, null: false, foreign_key: true
      t.string :authorization_code
      t.string :card_type
      t.string :last4
      t.string :exp_month
      t.string :exp_year
      t.string :bank
      t.string :brand
      t.boolean :reusable

      t.timestamps
    end
  end
end
