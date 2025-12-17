class Mentor < ApplicationRecord
  belongs_to :user
  has_many :mentor_applications, dependent: :destroy
  has_many :mentor_assignments, dependent: :destroy
  has_many :assigned_campaigns, through: :mentor_assignments, source: :campaign
  has_many :mentor_expertise_tags, dependent: :destroy
  has_many :expertise_tags, through: :mentor_expertise_tags
  
  enum status: {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    inactive: 'inactive'
  }
  
  validates :professional_title, presence: true
  validates :years_of_experience, presence: true
  validates :hourly_rate, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :max_assignments, numericality: { greater_than: 0, less_than_or_equal_to: 10 }, allow_nil: true
  
  scope :available, -> { approved.where('current_assignments < max_assignments OR max_assignments IS NULL') }
  scope :by_expertise, ->(expertise) { joins(:expertise_tags).where(expertise_tags: { name: expertise }) }
  scope :highly_rated, -> { where('rating >= ?', 4.0) }
  
  def available?
    approved? && (max_assignments.nil? || current_assignments < max_assignments)
  end
  
  def increment_assignments
    update(current_assignments: current_assignments + 1)
  end
  
  def decrement_assignments
    update(current_assignments: [current_assignments - 1, 0].max)
  end
  
  def update_rating(new_rating)
    total_ratings = reviews_count.to_f
    current_average = rating.to_f * total_ratings
    new_total_ratings = total_ratings + 1
    new_average = (current_average + new_rating) / new_total_ratings
    
    update(
      rating: new_average,
      reviews_count: reviews_count + 1
    )
  end
  
  def expertise_list
    expertise_tags.pluck(:name)
  end
  
  def add_expertise(tag_name)
    tag = ExpertiseTag.find_or_create_by(name: tag_name.downcase.strip)
    mentor_expertise_tags.find_or_create_by(expertise_tag: tag)
  end
end