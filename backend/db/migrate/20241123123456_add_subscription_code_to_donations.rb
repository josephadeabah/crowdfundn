class AddSubscriptionCodeToDonations < ActiveRecord::Migration[7.1]
    def change
      add_column :donations, :subscription_code, :string
    end
end
  