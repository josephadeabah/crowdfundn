class CreateEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    create_table :equity_investments do |t|
      t.references :campaign, null: false, foreign_key: true  # Points to campaigns (STI)
      t.references :user, null: false, foreign_key: true
      t.decimal :amount, precision: 15, scale: 2
      t.decimal :share_count, precision: 15, scale: 2
      t.string :status

      t.timestamps
    end
  end
end
