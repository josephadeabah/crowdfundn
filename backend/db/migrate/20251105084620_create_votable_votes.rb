# db/migrate/xxx_create_votable_votes.rb
class CreateVotableVotes < ActiveRecord::Migration[7.1]
  def change
    create_table :votes do |t|
      t.references :votable, polymorphic: true, null: false
      t.references :user, null: false
      t.string :vote_type, null: false # 'invest', 'pass', 'yes', 'no', etc.
      t.text :reason
      t.string :voting_session_id # To group votes for the same session
      
      t.timestamps
    end
    
    add_index :votes, [:votable_type, :votable_id, :user_id, :voting_session_id], 
              unique: true, 
              name: 'index_votes_on_votable_and_user_and_session'
    add_index :votes, :voting_session_id
  end
end