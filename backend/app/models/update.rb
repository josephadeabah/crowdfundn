class Update < ApplicationRecord
  belongs_to :campaign
  validates :content, presence: true
end
