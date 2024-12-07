class DropTransfersTable < ActiveRecord::Migration[7.1]
  def change
    drop_table :transfers, if_exists: true
  end
end
