class DealRoomMeetingParticipant < ApplicationRecord
  belongs_to :deal_room_meeting
  belongs_to :user
  
  # Simple roles
  enum :role, {
    host: 'host',
    attendee: 'attendee'
  }
  
  # Simple statuses
  enum :status, {
    invited: 'invited',
    accepted: 'accepted',
    declined: 'declined'
  }
  
  validates :user_id, uniqueness: { scope: :deal_room_meeting_id, message: "is already a participant" }
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :role, :status, :created_at, :updated_at]
    )).merge(
      user: user_basic_info
    )
  end
  
  private
  
  def user_basic_info
    {
      id: user.id,
      full_name: user.full_name,
      email: user.email
    }
  end
end