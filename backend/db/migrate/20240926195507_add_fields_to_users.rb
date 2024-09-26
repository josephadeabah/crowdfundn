class AddFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :full_name, :string
    add_column :users, :phone_number, :string
    add_column :users, :country, :string
    add_column :users, :payment_method, :string
    add_column :users, :mobile_money_provider, :string
    add_column :users, :currency, :string
    add_column :users, :birth_date, :date
    add_column :users, :category, :string
    add_column :users, :target_amount, :decimal
    add_column :users, :duration_in_days, :integer
    add_column :users, :national_id, :string
  end
end
