class DealRoomMeeting < ApplicationRecord
  belongs_to :deal_room
  belongs_to :organizer, class_name: 'User', foreign_key: 'organizer_id'
  
  # Simplified - just track organizer as participant
  has_many :deal_room_meeting_participants, dependent: :destroy
  has_many :participants, through: :deal_room_meeting_participants, source: :user
  
  # Simplified enums
  enum :status, {
    scheduled: 'scheduled',
    completed: 'completed',
    canceled: 'canceled'
  }
  
  enum :meeting_type, {
    one_on_one: 'one_on_one',
    pitch_review: 'pitch_review',
    due_diligence: 'due_diligence',
    investor_update: 'investor_update'
  }
  
  # Required fields
  validates :title, presence: true
  validates :meeting_type, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :meeting_link, presence: true
  
  # Basic validations
  validate :end_time_after_start_time
  validate :meeting_duration_limits
  
  # Simple scopes
  scope :upcoming, -> { where('start_time > ?', Time.current).order(start_time: :asc) }
  scope :past, -> { where('end_time < ?', Time.current).order(start_time: :desc) }
  scope :for_deal_room, ->(deal_room) { where(deal_room: deal_room) }
  
  # Auto-set status
  before_create :set_default_status
  
  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?
    
    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
  
  def meeting_duration_limits
    return if end_time.blank? || start_time.blank?
    
    duration = (end_time - start_time) / 60  # duration in minutes
    
    if duration < 15
      errors.add(:base, "Meeting must be at least 15 minutes")
    elsif duration > 480  # 8 hours
      errors.add(:base, "Meeting cannot exceed 8 hours")
    end
  end
  
  def duration_minutes
    return 0 if start_time.blank? || end_time.blank?
    ((end_time - start_time) / 60).to_i
  end
  
  def upcoming?
    start_time > Time.current
  end
  
  def ongoing?
    start_time <= Time.current && end_time >= Time.current
  end
  
  def past?
    end_time < Time.current
  end
  
  def can_edit?(user)
    organizer == user || deal_room.user == user
  end
  
  def can_delete?(user)
    organizer == user
  end
  
  # Simplified JSON response
  def as_json(options = {})
    super(options.merge(
      only: [:id, :title, :description, :meeting_type, :status, :start_time, 
             :end_time, :meeting_link, :notes, :created_at, :updated_at]
    )).merge(
      organizer: organizer_basic_info,
      duration_minutes: duration_minutes,
      upcoming: upcoming?,
      ongoing: ongoing?,
      past: past?,
      can_edit: options[:current_user] ? can_edit?(options[:current_user]) : false,
      can_delete: options[:current_user] ? can_delete?(options[:current_user]) : false,
      deal_room_id: deal_room_id,
      deal_room_name: deal_room.name,
      formatted_start_time: start_time.strftime('%B %d, %Y at %I:%M %p'),
      formatted_end_time: end_time.strftime('%B %d, %Y at %I:%M %p')
    )
  end
  
  private
  
  def set_default_status
    self.status ||= :scheduled
  end
  
  def organizer_basic_info
    {
      id: organizer.id,
      name: organizer.full_name,
      email: organizer.email
    }
  end
end