# app/models/mentor_expertise_tag.rb
class MentorExpertiseTag < ApplicationRecord
  belongs_to :mentor
  belongs_to :expertise_tag
end