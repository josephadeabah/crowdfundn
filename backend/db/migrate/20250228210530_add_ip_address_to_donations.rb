class AddIpAddressToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :ip_address, :string
  end
end
