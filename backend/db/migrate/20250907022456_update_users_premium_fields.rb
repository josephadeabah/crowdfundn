class UpdateUsersPremiumFields < ActiveRecord::Migration[7.1]
  def change
    # Remove string premium_plan column
    remove_column :users, :premium_plan, :string
    
    # Add foreign key to premium_plans
    add_reference :users, :premium_plan, foreign_key: true
    
    # Add subscription reference
    add_column :users, :premium_subscription_id, :string
    
    # Add auto-renew preference
    add_column :users, :premium_auto_renew, :boolean, default: true
  end
end