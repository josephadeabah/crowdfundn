class ChangeUserIdInDonations < ActiveRecord::Migration[6.0]
  def change
    change_column_null :donations, :user_id, true
  end
end
