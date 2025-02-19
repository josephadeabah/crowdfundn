class Comment < ApplicationRecord
  belongs_to :campaign
  belongs_to :user, optional: true
  validates :content, presence: true
end
