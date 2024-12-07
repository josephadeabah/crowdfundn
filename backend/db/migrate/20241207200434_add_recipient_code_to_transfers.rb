class AddRecipientCodeToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :recipient_code, :string
  end
end
