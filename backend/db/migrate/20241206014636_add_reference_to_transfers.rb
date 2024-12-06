class AddReferenceToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :reference, :string
  end
end
