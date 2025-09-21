class AddAnonymousToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :anonymous, :boolean
  end
end
