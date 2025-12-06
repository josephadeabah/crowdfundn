# app/models/deal_room_meeting.rb
class DealRoomMeeting < ApplicationRecord
  belongs_to :deal_room
  belongs_to :organizer, class_name: 'User', foreign_key: 'user_id'
  has_many :deal_room_meeting_participants, dependent: :destroy
  has_many :participants, through: :deal_room_meeting_participants, source: :user
  
  enum :status, {
    scheduled: 'scheduled',
    in_progress: 'in_progress',
    completed: 'completed',
    canceled: 'canceled'
  }
  
  enum :meeting_type, {
    qna: 'qna',
    pitch: 'pitch',
    due_diligence: 'due_diligence',
    investor_update: 'investor_update'
  }
  
  validates :title, :start_time, :end_time, presence: true
  validate :end_time_after_start_time
  
  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?
    
    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
  
  def add_participant(user, role = 'attendee')
    deal_room_meeting_participants.create!(user: user, role: role)
  end
  
  def duration_minutes
    return 0 if start_time.blank? || end_time.blank?
    ((end_time - start_time) / 60).to_i
  end
  
  def upcoming?
    start_time > Time.current
  end
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :title, :description, :meeting_type, :status, :start_time, :end_time, :meeting_link, :notes, :created_at, :updated_at]
    )).merge(
      organizer: { id: organizer.id, name: organizer.full_name },
      participants: participants.map do |p|
        {
          id: p.id,
          name: p.full_name,
          role: deal_room_meeting_participants.find_by(user: p)&.role
        }
      end,
      duration_minutes: duration_minutes,
      upcoming: upcoming?,
      deal_room_id: deal_room_id
    )
  end
end