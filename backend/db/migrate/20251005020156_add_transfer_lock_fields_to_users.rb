class AddTransferLockFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :transfer_locked, :boolean, default: false
    add_column :users, :transfer_locked_reason, :text
    add_column :users, :transfer_locked_at, :datetime
    add_column :users, :transfer_locked_by, :bigint
    add_column :users, :last_transfer_reset_at, :datetime
    add_column :users, :total_transferred_amount, :decimal, precision: 15, scale: 2, default: 0.0
    
    # Add foreign key for admin who locked the transfers
    add_foreign_key :users, :users, column: :transfer_locked_by
  end
end
