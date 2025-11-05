# db/migrate/20241105130000_rename_club_type_to_access_type.rb
class RenameClubTypeToAccessType < ActiveRecord::Migration[7.1]
  def change
    rename_column :investment_clubs, :club_type, :access_type
  end
end