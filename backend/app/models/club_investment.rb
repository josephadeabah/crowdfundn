class ClubInvestment < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  has_many :votes, as: :votable, dependent: :destroy
  
  validates :investment_amount, numericality: { greater_than: 0 }
  
  enum status: { 
    pending: 'pending', 
    voting: 'voting', 
    approved: 'approved', 
    rejected: 'rejected',
    executed: 'executed', 
    completed: 'completed',
    failed: 'failed'
  }
  
  before_create :generate_voting_session_id
  
  # FIXED: Use after_update instead of after_save to avoid infinite loops
  after_update :execute_investment, if: -> { saved_change_to_status? && approved? }
  
  def start_voting
    update(status: 'voting', voting_session_id: generate_voting_session_id)
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
    
    # Auto-approve if threshold met
    if calculate_approval_rate >= 60.0 && voting?
      update(status: 'approved')
    end
  end
  
  def approved?
    # Check if investment meets approval criteria
    calculate_approval_rate >= 60.0
  end
  
  def can_vote?(user)
    investment_club.is_member?(user) && voting?
  end
  
  private
  
  def generate_voting_session_id
    self.voting_session_id ||= "vote_#{SecureRandom.hex(10)}"
  end
  
  def execute_investment
    # This will be implemented in Phase 2 - integrates with existing payment system
    ClubInvestmentExecutionJob.perform_later(id)
  end
end