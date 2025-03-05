class AddShippingAndRewardsToPledges < ActiveRecord::Migration[7.1]
  def change
    add_column :pledges, :shipping_data, :jsonb, default: {}
    add_column :pledges, :selected_rewards, :jsonb, default: []
    add_column :pledges, :delivery_option, :string
  end
end
