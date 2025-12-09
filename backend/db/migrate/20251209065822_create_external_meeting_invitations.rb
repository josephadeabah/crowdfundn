class CreateExternalMeetingInvitations < ActiveRecord::Migration[7.1]
  def change
    create_table :external_meeting_invitations do |t|
      t.references :deal_room_meeting, null: false, foreign_key: true
      t.string :email, null: false
      t.string :token, null: false
      t.string :status, default: 'pending'
      t.datetime :accepted_at
      t.datetime :declined_at
      t.text :notes

      t.timestamps
    end

    add_index :external_meeting_invitations, :token, unique: true
    add_index :external_meeting_invitations, [:deal_room_meeting_id, :email], 
              unique: true, name: 'index_external_invites_on_meeting_and_email'
  end
end