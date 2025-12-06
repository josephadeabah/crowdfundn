# app/models/deal_room_meeting_participant.rb
class DealRoomMeetingParticipant < ApplicationRecord
  belongs_to :deal_room_meeting
  belongs_to :user
  
  enum :role, {
    host: 'host',
    speaker: 'speaker',
    attendee: 'attendee'
  }
  
  enum :status, {
    invited: 'invited',
    accepted: 'accepted',
    declined: 'declined',
    attended: 'attended'
  }
  
  validates :user_id, uniqueness: { scope: :deal_room_meeting_id }
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :role, :status, :created_at, :updated_at]
    )).merge(
      user: { id: user.id, full_name: user.full_name, email: user.email },
      deal_room_meeting_id: deal_room_meeting_id
    )
  end
end