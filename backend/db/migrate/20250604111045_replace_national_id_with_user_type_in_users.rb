class ReplaceNationalIdWithUserTypeInUsers < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :national_id, :string
    add_column :users, :user_type, :string, default: 'individual'
  end
end
