class AddPlanToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :plan, :string
  end
end
