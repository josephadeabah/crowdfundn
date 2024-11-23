class AddSubscriberNameToSubscriptions < ActiveRecord::Migration[7.1]
    def change
      add_column :subscriptions, :subscriber_name, :string
    end
end
  