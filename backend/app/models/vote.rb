# app/models/vote.rb
class Vote < ApplicationRecord
  belongs_to :votable, polymorphic: true
  belongs_to :user
  
  validates :user_id, uniqueness: { 
    scope: [:votable_type, :votable_id, :voting_session_id],
    message: "has already voted in this session"
  }
  validates :vote_type, presence: true
  
  # Reusable voting types - can be extended for other features
  VOTE_TYPES = {
    investment: ['invest', 'pass'],
    general: ['yes', 'no', 'abstain'],
    rating: ['1', '2', '3', '4', '5']
  }.freeze
  
  after_save :update_votable_stats, if: -> { votable.respond_to?(:update_voting_stats) }
  
  def self.vote_types_for(context)
    VOTE_TYPES[context.to_sym] || VOTE_TYPES[:general]
  end
end