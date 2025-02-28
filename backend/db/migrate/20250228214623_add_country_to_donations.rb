class AddCountryToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :country, :string
  end
end
