# app/models/club_investment.rb
class ClubInvestment < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  has_many :votes, as: :votable, dependent: :destroy
  has_many :member_investment_shares, dependent: :destroy
  has_many :members, through: :member_investment_shares, source: :user
  
  validates :investment_amount, numericality: { greater_than: 0 }
  
  enum status: { 
    pending: 'pending', 
    voting: 'voting', 
    approved: 'approved', 
    rejected: 'rejected',
    transfer_initiated: 'transfer_initiated',
    executed: 'executed', 
    completed: 'completed',
    failed: 'failed'
  }
  
  before_create :generate_voting_session_id
  after_update :execute_investment, if: -> { saved_change_to_status? && approved? }
  after_update :distribute_shares, if: -> { saved_change_to_status? && executed? }
  
  def start_voting(duration_days = 7)
    update(
      status: 'voting', 
      voting_session_id: generate_voting_session_id,
      voting_ends_at: duration_days.days.from_now
    )
  end
  
  def calculate_approval_rate
    total_votes = yes_votes + no_votes
    return 0 if total_votes.zero?
    
    (yes_votes.to_f / total_votes * 100).round(2)
  end
  
  def update_voting_stats
    votes_data = votes.group(:vote_type).count
    update(
      yes_votes: votes_data['invest'] || votes_data['yes'] || 0,
      no_votes: votes_data['pass'] || votes_data['no'] || 0,
      approval_rate: calculate_approval_rate
    )
    
    # Auto-approve if threshold met and voting period hasn't ended
    if calculate_approval_rate >= 60.0 && voting? && (voting_ends_at.nil? || voting_ends_at > Time.current)
      update(status: 'approved')
    end
    
    # Auto-reject if voting period ended without sufficient approval
    if voting? && voting_ends_at && voting_ends_at <= Time.current && calculate_approval_rate < 60.0
      update(status: 'rejected')
    end
  end
  
  def approved?
    calculate_approval_rate >= 60.0
  end
  
  def can_vote?(user)
    membership = investment_club.membership_for(user)
    membership&.can_vote? && voting? && (voting_ends_at.nil? || voting_ends_at > Time.current)
  end
  
  def has_voted?(user)
    votes.exists?(user: user)
  end
  
  def voting_time_remaining
    return nil unless voting_ends_at
    [(voting_ends_at - Time.current).to_i, 0].max
  end
  
  def execute_via_service
    ClubInvestmentExecutionJob.perform_later(id)
  end
  
  private
  
  def generate_voting_session_id
    self.voting_session_id ||= "vote_#{SecureRandom.hex(10)}"
  end
  
  def execute_investment
    execute_via_service
  end
  
  def distribute_shares
    # Shares are distributed via ClubInvestmentService in process_investment_execution
    # This ensures proper transaction handling with your existing service
  end
end