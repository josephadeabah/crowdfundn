# db/migrate/xxx_create_investment_club_memberships.rb
class CreateInvestmentClubMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :investment_club_memberships do |t|
      t.references :investment_club, null: false
      t.references :user, null: false
      t.string :role, default: 'member' # member, admin, creator
      t.string :status, default: 'pending' # pending, active, inactive
      t.decimal :total_contributed, precision: 15, scale: 2, default: 0
      t.decimal :current_share, precision: 10, scale: 4, default: 0
      
      t.timestamps
    end
    
    add_index :investment_club_memberships, [:investment_club_id, :user_id], unique: true, name: 'index_club_memberships_on_club_and_user'
  end
end