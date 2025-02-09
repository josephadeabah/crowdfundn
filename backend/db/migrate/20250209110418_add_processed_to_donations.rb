class AddProcessedToDonations < ActiveRecord::Migration[7.1]
  def change
    # Add the `processed` column with a default value of `true`
    add_column :donations, :processed, :boolean, default: true, null: false

    # If you want new donations to have `processed` set to `false` by default,
    # you can update the default value after the column is added.
    change_column_default :donations, :processed, from: true, to: false
  end
end
