class AddStatusToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :status, :string, default: 'pending', null: false
    add_index :transfers, :status
  end
end
