# app/models/deal_room_meeting.rb
class DealRoomMeeting < ApplicationRecord
  belongs_to :deal_room
  belongs_to :organizer, class_name: 'User', foreign_key: 'organizer_id'
  has_many :deal_room_meeting_participants, dependent: :destroy
  has_many :participants, through: :deal_room_meeting_participants, source: :user
  
  # Enums for status and meeting type
  enum :status, {
    scheduled: 'scheduled',
    in_progress: 'in_progress',
    completed: 'completed',
    canceled: 'canceled',
    draft: 'draft'
  }
  
  enum :meeting_type, {
    qna: 'qna',
    pitch: 'pitch',
    due_diligence: 'due_diligence',
    investor_update: 'investor_update',
    one_on_one: 'one_on_one',
    group_discussion: 'group_discussion',
    webinar: 'webinar'
  }
  
  # Validations
  validates :title, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :meeting_type, presence: true
  validate :end_time_after_start_time
  validate :meeting_duration_limits
  validate :future_start_time, on: :create
  
  # Scopes
  scope :upcoming, -> { where('start_time > ?', Time.current).order(start_time: :asc) }
  scope :past, -> { where('end_time < ?', Time.current).order(start_time: :desc) }
  scope :ongoing, -> { where('start_time <= ? AND end_time >= ?', Time.current, Time.current) }
  scope :for_user, ->(user) {
    joins(:deal_room_meeting_participants)
      .where(deal_room_meeting_participants: { user_id: user.id })
      .or(where(organizer_id: user.id))
      .distinct
  }
  scope :for_deal_room, ->(deal_room) { where(deal_room: deal_room) }
  scope :scheduled, -> { where(status: :scheduled) }
  
  # Callbacks
  before_create :generate_meeting_link_if_needed
  before_update :send_update_notifications, if: :meeting_details_changed?
  after_create :notify_participants
  after_update :notify_status_change, if: :saved_change_to_status?
  
  # Virtual attributes for frontend
  attribute :participant_emails, :string, array: true, default: []
  attribute :participant_ids, :integer, array: true, default: []
  
  # Methods
  
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
  
  def future_start_time
    return if start_time.blank?
    
    if start_time < Time.current + 15.minutes
      errors.add(:start_time, "must be at least 15 minutes from now")
    end
  end
  
  def add_participant(user, role: 'attendee', status: 'invited')
    participant = deal_room_meeting_participants.find_or_initialize_by(user: user)
    participant.role = role
    participant.status = status
    participant.save
  end
  
  def add_participants_by_email(emails)
    emails.each do |email|
      user = User.find_by(email: email.strip.downcase)
      if user
        add_participant(user)
      else
        # Optionally create an invitation for non-users
        create_external_invitation(email)
      end
    end
  end
  
  def remove_participant(user)
    deal_room_meeting_participants.where(user: user).destroy_all
  end
  
  def update_participant_status(user, status)
    participant = deal_room_meeting_participants.find_by(user: user)
    participant&.update(status: status)
  end
  
  def duration_minutes
    return 0 if start_time.blank? || end_time.blank?
    ((end_time - start_time) / 60).to_i
  end
  
  def duration_hours
    duration_minutes / 60.0
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
    organizer == user || user.admin? || deal_room.user == user
  end
  
  def can_delete?(user)
    organizer == user || user.admin?
  end
  
  def participant_status(user)
    participant = deal_room_meeting_participants.find_by(user: user)
    participant&.status || 'not_invited'
  end
  
  def generate_meeting_link
    # Generate a unique meeting link (you can integrate with Zoom, Google Meet, etc.)
    self.meeting_link = "https://meet.yourplatform.com/#{SecureRandom.hex(10)}"
  end
  
  def start_meeting
    update(status: :in_progress, started_at: Time.current)
  end
  
  def end_meeting
    update(status: :completed, ended_at: Time.current)
  end
  
  def cancel_meeting(reason = nil)
    update(status: :canceled, canceled_at: Time.current, cancel_reason: reason)
  end
  
  def reschedule(new_start_time, new_end_time)
    update(start_time: new_start_time, end_time: new_end_time, status: :scheduled)
  end
  
  def send_invitations
    deal_room_meeting_participants.invited.each do |participant|
      MeetingMailer.invitation_email(self, participant.user).deliver_later
      Notification.create(
        user: participant.user,
        title: "Meeting Invitation: #{title}",
        body: "You've been invited to #{title} on #{start_time.strftime('%B %d, %Y at %I:%M %p')}",
        notification_type: 'meeting_invitation',
        data: { meeting_id: id, deal_room_id: deal_room_id }
      )
    end
  end
  
  def send_reminders
    return unless upcoming? && start_time < 1.hour.from_now
    
    deal_room_meeting_participants.accepted.each do |participant|
      MeetingMailer.reminder_email(self, participant.user).deliver_later
      Notification.create(
        user: participant.user,
        title: "Meeting Reminder: #{title}",
        body: "Meeting starts in 1 hour: #{title}",
        notification_type: 'meeting_reminder',
        data: { meeting_id: id, deal_room_id: deal_room_id }
      )
    end
  end
  
  def as_json(options = {})
    super(options.merge(
      only: [:id, :title, :description, :meeting_type, :status, :start_time, 
             :end_time, :meeting_link, :notes, :created_at, :updated_at]
    )).merge(
      organizer: organizer_basic_info,
      participants: participants_info,
      duration_minutes: duration_minutes,
      duration_hours: duration_hours.round(2),
      upcoming: upcoming?,
      ongoing: ongoing?,
      past: past?,
      can_edit: options[:current_user] ? can_edit?(options[:current_user]) : false,
      can_delete: options[:current_user] ? can_delete?(options[:current_user]) : false,
      participant_status: options[:current_user] ? participant_status(options[:current_user]) : nil,
      deal_room_id: deal_room_id,
      deal_room_name: deal_room.name,
      formatted_start_time: start_time.strftime('%B %d, %Y at %I:%M %p'),
      formatted_end_time: end_time.strftime('%B %d, %Y at %I:%M %p')
    )
  end
  
  private
  
  def generate_meeting_link_if_needed
    generate_meeting_link if meeting_link.blank? && meeting_type != 'one_on_one'
  end
  
  def meeting_details_changed?
    saved_change_to_start_time? || saved_change_to_end_time? || 
    saved_change_to_title? || saved_change_to_description?
  end
  
  def send_update_notifications
    return unless scheduled? || in_progress?
    
    deal_room_meeting_participants.each do |participant|
      next if participant.user == organizer
      
      MeetingMailer.update_email(self, participant.user, changed_attributes).deliver_later
      Notification.create(
        user: participant.user,
        title: "Meeting Updated: #{title}",
        body: "Meeting details have been updated",
        notification_type: 'meeting_updated',
        data: { meeting_id: id, deal_room_id: deal_room_id, changes: changed_attributes }
      )
    end
  end
  
  def notify_participants
    send_invitations
  end
  
  def notify_status_change
    return unless saved_change_to_status?
    
    deal_room_meeting_participants.each do |participant|
      next if participant.user == organizer
      
      MeetingMailer.status_change_email(self, participant.user, status_before_last_save).deliver_later
      Notification.create(
        user: participant.user,
        title: "Meeting Status Changed: #{title}",
        body: "Meeting status changed from #{status_before_last_save} to #{status}",
        notification_type: 'meeting_status_changed',
        data: { meeting_id: id, deal_room_id: deal_room_id }
      )
    end
  end
  
  def create_external_invitation(email)
    # Create a record for external invitees
    ExternalMeetingInvitation.create(
      deal_room_meeting: self,
      email: email,
      token: SecureRandom.hex(20),
      status: 'pending'
    )
  end
  
  def organizer_basic_info
    {
      id: organizer.id,
      name: organizer.full_name,
      email: organizer.email,
      avatar: organizer.avatar_url
    }
  end
  
  def participants_info
    deal_room_meeting_participants.includes(:user).map do |participant|
      {
        id: participant.user.id,
        name: participant.user.full_name,
        email: participant.user.email,
        avatar: participant.user.avatar_url,
        role: participant.role,
        status: participant.status,
        rsvp_at: participant.updated_at
      }
    end
  end
end