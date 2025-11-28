class AddSubaccountToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_reference :transfers, :subaccount, foreign_key: true, null: true
  end
end
