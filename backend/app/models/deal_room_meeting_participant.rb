# app/models/deal_room_meeting_participant.rb
class DealRoomMeetingParticipant < ApplicationRecord
  belongs_to :deal_room_meeting
  belongs_to :user
  
  # Enums
  enum :role, {
    host: 'host',
    co_host: 'co_host',
    speaker: 'speaker',
    attendee: 'attendee',
    observer: 'observer'
  }
  
  enum :status, {
    invited: 'invited',
    accepted: 'accepted',
    declined: 'declined',
    tentative: 'tentative',
    attended: 'attended',
    no_show: 'no_show'
  }
  
  # Validations
  validates :user_id, uniqueness: { scope: :deal_room_meeting_id, message: "is already a participant" }
  
  # Scopes
  scope :accepted, -> { where(status: :accepted) }
  scope :attended, -> { where(status: :attended) }
  scope :invited, -> { where(status: :invited) }
  scope :declined, -> { where(status: :declined) }
  
  # Callbacks
  after_create :send_invitation_email
  after_update :send_rsvp_confirmation, if: :saved_change_to_status?
  
  # Methods
  
  def accept!
    update(status: :accepted, responded_at: Time.current)
  end
  
  def decline!
    update(status: :declined, responded_at: Time.current)
  end
  
  def tentative!
    update(status: :tentative, responded_at: Time.current)
  end
  
  def mark_attended!
    update(status: :attended, attended_at: Time.current)
  end
  
  def mark_no_show!
    update(status: :no_show)
  end
  
  def responded?
    !responded_at.nil?
  end
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :role, :status, :created_at, :updated_at, :responded_at, :attended_at]
    )).merge(
      user: user_basic_info,
      meeting_title: deal_room_meeting.title,
      meeting_start_time: deal_room_meeting.start_time,
      meeting_end_time: deal_room_meeting.end_time
    )
  end
  
  private
  
  def send_invitation_email
    return if deal_room_meeting.status == 'draft'
    
    MeetingMailer.invitation_email(deal_room_meeting, user).deliver_later
  end
  
  def send_rsvp_confirmation
    return if deal_room_meeting.status == 'draft'
    
    MeetingMailer.rsvp_confirmation_email(deal_room_meeting, user, status).deliver_later
  end
  
  def user_basic_info
    {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar_url: user.avatar_url,
      title: user.profile&.title
    }
  end
end