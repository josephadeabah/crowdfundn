class AddEmailAndUserNameToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :email, :string
    add_column :transfers, :user_name, :string
  end
end
