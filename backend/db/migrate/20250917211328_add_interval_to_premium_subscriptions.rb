class AddIntervalToPremiumSubscriptions < ActiveRecord::Migration[7.1]
  def change
    add_column :premium_subscriptions, :interval, :string
  end
end
