class ChangeDonationIdNullOnPoints < ActiveRecord::Migration[7.1]
  def change
    change_column_null :points, :donation_id, true
  end
end
