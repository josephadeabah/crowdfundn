# app/models/mentor_application.rb
class MentorApplication < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :kyc, optional: true
  belongs_to :mentor, optional: true
  belongs_to :reviewed_by, class_name: 'User', foreign_key: 'reviewed_by_id', optional: true
  
  validates :professional_title, presence: true
  validates :years_of_experience, presence: true
  validates :industry_expertise, presence: true
  validates :previous_mentoring, presence: true
  validates :mentorship_approach, presence: true, length: { minimum: 100 }
  validates :availability, presence: true
  
  enum status: {
    draft: 'draft',
    submitted: 'submitted',
    under_review: 'under_review',
    approved: 'approved',
    rejected: 'rejected'
  }
  
  before_create :generate_tracking_id
  
  def submit_for_review
    return if user.nil? || status != 'draft'
    
    update(
      status: :submitted,
      submitted_at: Time.current
    )
    
    Rails.logger.info "Mentor application #{id} submitted for review by user #{user_id}"
  end
  
  def create_mentor_profile
    return unless approved? && user.present?
    
    return if user.mentor.present?
    
    mentor = Mentor.create!(
      user: user,
      professional_title: professional_title,
      years_of_experience: years_of_experience,
      linkedin_profile: linkedin_profile,
      bio: mentorship_approach,
      status: :approved,
      current_assignments: 0,
      max_assignments: 5,
      rating: 0,
      reviews_count: 0
    )
    
    (industry_expertise || []).each do |expertise|
      mentor.add_expertise(expertise)
    end
    
    update(mentor: mentor)
    
    Rails.logger.info "Created mentor profile #{mentor.id} for user #{user.id}"
  end

  def as_json(options = {})
    super(options).merge(
      'reviewed_by' => reviewed_by&.as_json(only: [:id, :full_name, :email])
    )
  end
  
  private
  
  def generate_tracking_id
    self.tracking_id = "MENTOR-#{SecureRandom.alphanumeric(8).upcase}"
  end
end