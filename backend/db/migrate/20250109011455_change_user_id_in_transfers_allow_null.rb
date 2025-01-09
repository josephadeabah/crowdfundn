class ChangeUserIdInTransfersAllowNull < ActiveRecord::Migration[7.1]
  def change
    change_column_null :transfers, :user_id, true
  end
end
