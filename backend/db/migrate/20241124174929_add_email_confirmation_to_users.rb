class AddEmailConfirmationToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :email_confirmed, :boolean, default: false
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmed_at, :datetime
    add_index :users, :confirmation_token, unique: true
  end
end
