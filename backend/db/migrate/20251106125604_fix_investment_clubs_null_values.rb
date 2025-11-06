class FixInvestmentClubsNullValues < ActiveRecord::Migration[7.1]
  def up
    # First, set default values for existing null records
    InvestmentClub.where(current_members_count: nil).update_all(current_members_count: 0)
    InvestmentClub.where(max_members: nil).update_all(max_members: 50)
    InvestmentClub.where(minimum_monthly_contribution: nil).update_all(minimum_monthly_contribution: 0.0)

    # Then add the constraints
    change_column_default :investment_clubs, :current_members_count, from: nil, to: 0
    change_column_default :investment_clubs, :max_members, from: nil, to: 50
    change_column_default :investment_clubs, :minimum_monthly_contribution, from: nil, to: 0.0
    
    change_column_null :investment_clubs, :current_members_count, false
    change_column_null :investment_clubs, :max_members, false
    change_column_null :investment_clubs, :minimum_monthly_contribution, false
  end

  def down
    change_column_null :investment_clubs, :current_members_count, true
    change_column_null :investment_clubs, :max_members, true
    change_column_null :investment_clubs, :minimum_monthly_contribution, true
    
    change_column_default :investment_clubs, :current_members_count, from: 0, to: nil
    change_column_default :investment_clubs, :max_members, from: 50, to: nil
    change_column_default :investment_clubs, :minimum_monthly_contribution, from: 0.0, to: nil
  end
end