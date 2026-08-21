# db/migrate/20260821101446_add_confirmation_token_expires_at_to_users.rb
class AddConfirmationTokenExpiresAtToUsers < ActiveRecord::Migration[7.1]
  def change
    # Only add the column if it doesn't exist
    unless column_exists?(:users, :confirmation_token_expires_at)
      add_column :users, :confirmation_token_expires_at, :datetime
    end
    
    # Only add the index if it doesn't exist
    unless index_exists?(:users, :confirmation_token)
      add_index :users, :confirmation_token, unique: true, where: "confirmation_token IS NOT NULL"
    end
  end
end