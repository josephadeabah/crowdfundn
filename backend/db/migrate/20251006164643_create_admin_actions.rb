# db/migrate/20250101000000_create_admin_actions.rb
class CreateAdminActions < ActiveRecord::Migration[7.1]
  def change
    create_table :admin_actions do |t|
      t.references :admin_user, null: false, foreign_key: { to_table: :users }
      t.references :target_user, null: false, foreign_key: { to_table: :users }
      t.references :campaign, foreign_key: true
      t.string :action, null: false
      t.jsonb :metadata, default: {}
      t.string :ip_address
      t.string :user_agent
      
      t.timestamps
    end

    add_index :admin_actions, :action
    add_index :admin_actions, :created_at
  end
end