class AddIndexToDonationsStatus < ActiveRecord::Migration[7.1]
  def change
    add_index :donations, :status
  end
end
