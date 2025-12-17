# app/models/mentor_assignment.rb
class MentorAssignment < ApplicationRecord
  belongs_to :campaign
  belongs_to :mentor
  belongs_to :entrepreneur, class_name: 'User'
  
  enum status: {
    pending: 'pending',
    active: 'active',
    completed: 'completed',
    cancelled: 'cancelled'
  }
  
  validates :mentor_fee, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  before_create :set_defaults
  after_create :increment_mentor_assignments
  after_destroy :decrement_mentor_assignments
  
  scope :active, -> { where(status: 'active') }
  scope :pending, -> { where(status: 'pending') }
  scope :completed, -> { where(status: 'completed') }
  
  def approve!
    update(status: :active, started_at: Time.current)
    send_notification(:assignment_approved)
  end
  
  def complete!(rating = nil, feedback = nil)
    transaction do
      update(
        status: :completed,
        completed_at: Time.current,
        rating: rating,
        feedback: feedback
      )
      
      mentor.update_rating(rating) if rating.present?
    end
    send_notification(:assignment_completed)
  end
  
  def cancel!(reason = nil)
    update(status: :cancelled, cancelled_at: Time.current, cancellation_reason: reason)
    send_notification(:assignment_cancelled)
  end
  
  private
  
  def set_defaults
    self.status ||= :pending
    self.mentor_fee ||= mentor.hourly_rate
  end
  
  def increment_mentor_assignments
    mentor.increment_assignments
  end
  
  def decrement_mentor_assignments
    mentor.decrement_assignments
  end
  
  def send_notification(event_type)
    # FIXED: Use keyword arguments to match the service method signature
    MentorNotificationService.send_mentor_assignment_notification(
      assignment: self, 
      event_type: event_type
    )
  end
end