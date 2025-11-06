class AddDefaultsToInvestmentClubs < ActiveRecord::Migration[7.1]
  def change
    change_column_default :investment_clubs, :current_members_count, from: nil, to: 0
    change_column_default :investment_clubs, :max_members, from: nil, to: 50
    change_column_default :investment_clubs, :minimum_monthly_contribution, from: nil, to: 0.0
    
    # Add not null constraints
    change_column_null :investment_clubs, :current_members_count, false
    change_column_null :investment_clubs, :max_members, false
    change_column_null :investment_clubs, :minimum_monthly_contribution, false
  end
end
