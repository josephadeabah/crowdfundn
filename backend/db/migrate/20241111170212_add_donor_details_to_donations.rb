class AddDonorDetailsToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :full_name, :string
    add_column :donations, :email, :string, null: false, default: ""
    add_column :donations, :phone, :string
  end
end
