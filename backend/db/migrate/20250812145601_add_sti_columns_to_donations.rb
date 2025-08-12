class AddStiColumnsToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :type, :string
    add_index :donations, :type
    add_column :donations, :shares, :decimal, precision: 20, scale: 4
    add_column :donations, :percentage, :decimal, precision: 10, scale: 8
    add_column :donations, :certificate_number, :string
    add_column :donations, :investment_date, :date
  end
end