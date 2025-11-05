class AddCurrentMembersCountToInvestmentClubs < ActiveRecord::Migration[7.1]
  def change
    add_column :investment_clubs, :current_members_count, :integer
  end
end
