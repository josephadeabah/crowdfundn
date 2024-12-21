class AddFullNameAndEmailToComments < ActiveRecord::Migration[7.1]
  def change
    add_column :comments, :full_name, :string
    add_column :comments, :email, :string
  end
end
