class UpdatePremiumSubscriptions < ActiveRecord::Migration[7.1]
  def change
    # Add foreign key to premium_plans
    add_reference :premium_subscriptions, :premium_plan, foreign_key: true
    
    # Add new columns for subscription management
    add_column :premium_subscriptions, :paystack_subscription_code, :string
    add_column :premium_subscriptions, :start_date, :datetime
    add_column :premium_subscriptions, :end_date, :datetime
    add_column :premium_subscriptions, :next_payment_date, :datetime
    add_column :premium_subscriptions, :auto_renew, :boolean, default: true
    add_column :premium_subscriptions, :payment_method, :string
    add_column :premium_subscriptions, :currency, :string, default: 'GHS'
    
    # Update existing columns if needed
    change_column :premium_subscriptions, :amount, :decimal, precision: 10, scale: 2
    
    # Add indexes
    add_index :premium_subscriptions, :paystack_subscription_code, unique: true
    add_index :premium_subscriptions, :status
  end
end