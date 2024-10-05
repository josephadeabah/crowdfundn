class AddDefaultRoles < ActiveRecord::Migration[7.1]
  def up
    Role.create([{ name: 'Admin' }, { name: 'Manager' }, { name: 'Moderator' }, { name: 'User' }, { name: 'Custom' }])
  end

  def down
    Role.where(name: ['Admin', 'Manager', 'Moderator', 'User', 'Custom']).destroy_all
  end
end
