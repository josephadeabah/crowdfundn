class Comment < ApplicationRecord
  belongs_to :campaign
  belongs_to :user
end
