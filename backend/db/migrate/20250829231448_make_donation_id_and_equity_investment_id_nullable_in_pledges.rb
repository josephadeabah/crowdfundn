class MakeDonationIdAndEquityInvestmentIdNullableInPledges < ActiveRecord::Migration[7.1]
  def change
    change_column_null :pledges, :donation_id, true
    change_column_null :pledges, :equity_investment_id, true
  end
end
