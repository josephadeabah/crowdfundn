class AddReasonToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :reason, :string
  end
end
