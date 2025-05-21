class AddPremiumFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :premium_access, :boolean, default: false
    add_column :users, :premium_expires_at, :datetime
    add_column :users, :premium_plan, :string
  end
end