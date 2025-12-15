# app/models/expertise_tag.rb
class ExpertiseTag < ApplicationRecord
  has_many :mentor_expertise_tags, dependent: :destroy
  has_many :mentors, through: :mentor_expertise_tags
  
  validates :name, presence: true, uniqueness: true
  
  # Common expertise tags
  COMMON_TAGS = [
    'Technology', 'SaaS', 'E-commerce', 'Healthcare', 'Finance',
    'Marketing', 'Sales', 'Product Development', 'Operations',
    'Fundraising', 'Legal', 'HR', 'Business Strategy', 'Scaling',
    'International Expansion', 'Product-Market Fit', 'Pitching',
    'Team Building', 'Investor Relations', 'Financial Modeling'
  ].freeze
end