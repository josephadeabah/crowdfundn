# app/models/mentor_application.rb
class MentorApplication < ApplicationRecord
  belongs_to :user, optional: true  # Make optional temporarily
  belongs_to :kyc, optional: true
  belongs_to :mentor, optional: true
  
  validates :professional_title, presence: true
  validates :years_of_experience, presence: true
  validates :industry_expertise, presence: true
  validates :previous_mentoring, presence: true
  validates :mentorship_approach, presence: true, length: { minimum: 100 }
  validates :availability, presence: true
    
  before_create :generate_tracking_id
  
  enum status: {
    draft: 'draft',
    submitted: 'submitted',
    under_review: 'under_review',
    approved: 'approved',
    rejected: 'rejected'
  }
  
  # Call this method after user is set
  def submit_for_review
    return if user.nil? || status != 'draft'
    
    update(
      status: 'submitted',
      submitted_at: Time.current
    )
    
    # TEMPORARILY DISABLE NOTIFICATIONS TO FIX THE ERROR
    # Send notification to admins
    # MentorNotificationService.new_mentor_application_submitted(self) if defined?(MentorNotificationService)
    
    # Log instead for debugging
    Rails.logger.info "Mentor application #{id} submitted for review by user #{user_id}"
  end
  
  def create_mentor_profile
    # Create mentor profile when application is approved
    return unless approved? && user.present?
    
    mentor = Mentor.create!(
      user: user,
      professional_title: professional_title,
      years_of_experience: years_of_experience,
      linkedin_profile: linkedin_profile,
      bio: mentorship_approach,
      status: 'approved',
      current_assignments: 0,
      max_assignments: 5, # Default max assignments
      rating: 0,
      reviews_count: 0
    )
    
    # Add expertise tags
    (industry_expertise || []).each do |expertise|
      mentor.add_expertise(expertise)
    end
    
    update(mentor: mentor)
  end
  
  private
  
  def generate_tracking_id
    self.tracking_id = "MENTOR-#{SecureRandom.alphanumeric(8).upcase}"
  end
end