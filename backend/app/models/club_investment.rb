# app/models/club_investment.rb
class ClubInvestment < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  belongs_to :created_by, class_name: 'User', foreign_key: 'created_by_id', optional: true
  
  has_many :member_investment_shares, dependent: :destroy
  has_many :members, through: :member_investment_shares, source: :user
  has_many :votes, as: :votable, dependent: :destroy
  
  # Add these missing attributes
  attribute :proposed_share_percentage, :decimal, precision: 5, scale: 2
  attribute :voting_session_id, :string
  attribute :voting_ends_at, :datetime
  attribute :shares_acquired, :integer, default: 0
  attribute :reference, :string
  
  validates :investment_amount, numericality: { greater_than: 0 }
  validates :proposed_share_percentage, numericality: { greater_than: 0, less_than_or_equal_to: 100 }, allow_nil: true
  # Removed shares_acquired validation
  
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
    
    # Use current_members_count from the club
    total_members = investment_club.current_members_count
    
    # Calculate if threshold is met (all members voted)
    all_members_voted = total_votes >= total_members
    threshold_met = all_members_voted && yes_votes > no_votes
    
    {
      total_votes: total_votes,
      yes_votes: yes_votes,
      no_votes: no_votes,
      approval_percentage: total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0,
      total_members: total_members,
      all_members_voted: all_members_voted,
      threshold_met: threshold_met
    }
  end
  
  # Method to check if voting threshold is met
  def voting_threshold_met?
    stats = voting_stats
    stats[:threshold_met]
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
    return if reference.present?
    
    # Generate a unique reference
    self.reference = "CLUB-INV-#{SecureRandom.alphanumeric(10).upcase}"
    
    # Ensure uniqueness
    while ClubInvestment.exists?(reference: reference)
      self.reference = "CLUB-INV-#{SecureRandom.alphanumeric(10).upcase}"
    end
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