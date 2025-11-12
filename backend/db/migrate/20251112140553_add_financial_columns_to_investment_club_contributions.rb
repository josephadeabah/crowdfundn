class AddFinancialColumnsToInvestmentClubContributions < ActiveRecord::Migration[7.1]
  def change
    add_column :investment_club_contributions, :paystack_fee, :decimal, precision: 10, scale: 2, default: 0
    add_column :investment_club_contributions, :amount_settled, :decimal, precision: 10, scale: 2
    add_column :investment_club_contributions, :processed_at, :datetime
  end
end
