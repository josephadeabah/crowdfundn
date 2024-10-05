class CreateUserRoles < ActiveRecord::Migration[7.1]
  def change
    create_table :user_roles do |t|
      t.references :user, null: false, foreign_key: true
      t.references :role, null: false, foreign_key: true

      t.timestamps
    end

    # Creating default roles
    Role.create([{ name: 'Admin' }, { name: 'Manager' }, { name: 'Moderator' }, { name: 'User' }, { name: 'Custom' }])
  end
end
