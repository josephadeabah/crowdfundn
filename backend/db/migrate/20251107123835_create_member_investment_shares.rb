class CreateMemberInvestmentShares < ActiveRecord::Migration[7.1]
  def change
    create_table :member_investment_shares do |t|
      t.references :user, null: false, foreign_key: true
      t.references :club_investment, null: false, foreign_key: true
      t.decimal :share_percentage, precision: 10, scale: 4, default: 0.0
      t.decimal :effective_shares, precision: 15, scale: 6, default: 0.0
      t.decimal :investment_value, precision: 15, scale: 2, default: 0.0

      t.timestamps
    end

    add_index :member_investment_shares, [:user_id, :club_investment_id], unique: true, name: 'index_member_shares_on_user_and_investment'
  end
end
