# app/models/external_meeting_invitation.rb
class ExternalMeetingInvitation < ApplicationRecord
  belongs_to :deal_room_meeting
  
  enum :status, {
    pending: 'pending',
    accepted: 'accepted',
    declined: 'declined',
    expired: 'expired'
  }
  
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :token, presence: true, uniqueness: true
  
  before_validation :generate_token, if: -> { token.blank? }
  
  def accept!
    update(status: :accepted, accepted_at: Time.current)
  end
  
  def decline!
    update(status: :declined, declined_at: Time.current)
  end
  
  def expired?
    created_at < 7.days.ago || deal_room_meeting.past?
  end
  
  private
  
  def generate_token
    self.token = SecureRandom.hex(20)
  end
end