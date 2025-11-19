class MakeUserIdOptionalInEquityInvestments < ActiveRecord::Migration[7.1]
  def up
    # Remove the NOT NULL constraint
    change_column_null :equity_investments, :user_id, true
  end

  def down
    # Restore the NOT NULL constraint
    change_column_null :equity_investments, :user_id, false
  end
end
