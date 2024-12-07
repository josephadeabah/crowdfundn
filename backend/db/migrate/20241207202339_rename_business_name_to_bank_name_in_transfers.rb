class RenameBusinessNameToBankNameInTransfers < ActiveRecord::Migration[7.1]
  def change
    rename_column :transfers, :business_name, :bank_name
  end
end
