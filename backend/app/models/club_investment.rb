class ClubInvestment < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  belongs_to :created_by, class_name: 'User'
  
  has_many :member_investment_shares, dependent: :destroy
  has_many :members, through: :member_investment_shares, source: :user
  has_many :votes, as: :votable, dependent: :destroy
  
  # Add these missing attributes
  attribute :proposed_share_percentage, :decimal, precision: 5, scale: 2
  attribute :voting_session_id, :string
  attribute :voting_ends_at, :datetime
  
  validates :investment_amount, numericality: { greater_than: 0 }
  validates :proposed_share_percentage, numericality: { greater_than: 0, less_than_or_equal_to: 100 }, allow_nil: true
  validates :shares_acquired, numericality: { greater_than_or_equal_to: 0 }
  
  enum status: {
    pending: 'pending',
    voting: 'voting',
    approved: 'approved',
    rejected: 'rejected'
  }
  
  before_create :generate_reference
  before_create :set_voting_session_id
  
  # Method to check if investment is approved based on voting
  def approved?
    status == 'approved'
  end
  
  # Method to get voting statistics
  def voting_stats
    votes = self.votes.where(voting_session_id: voting_session_id)
    total_votes = votes.count
    yes_votes = votes.where(vote_type: 'yes').count
    no_votes = votes.where(vote_type: 'no').count
    
    {
      total_votes: total_votes,
      yes_votes: yes_votes,
      no_votes: no_votes,
      approval_percentage: total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0
    }
  end
  
  # Method to check if voting threshold is met
  def voting_threshold_met?(threshold_percentage = 60)
    stats = voting_stats
    stats[:approval_percentage] >= threshold_percentage
  end
  
  # Method to finalize voting and update status
  def finalize_voting
    if voting_threshold_met?
      update(status: 'approved')
      # Add to approved campaigns container
      add_to_approved_campaigns
    else
      update(status: 'rejected')
    end
  end
  
  private
  
  def generate_reference
    self.reference ||= "CLUB-INV-#{SecureRandom.alphanumeric(10).upcase}"
  end
  
  def set_voting_session_id
    self.voting_session_id ||= SecureRandom.uuid
  end
  
  def add_to_approved_campaigns
    ApprovedCampaign.find_or_create_by(
      investment_club: investment_club,
      campaign: campaign,
      club_investment: self
    )
  end
end