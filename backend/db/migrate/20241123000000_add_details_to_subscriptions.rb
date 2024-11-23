class AddDetailsToSubscriptions < ActiveRecord::Migration[7.1]
    def change
      add_column :subscriptions, :interval, :string
      add_column :subscriptions, :card_type, :string
      add_column :subscriptions, :last4, :string
      add_column :subscriptions, :next_payment_date, :datetime
      add_column :subscriptions, :plan_code, :string
      add_column :subscriptions, :email, :string
      add_column :subscriptions, :amount, :decimal
    end
end
  