# app/services/voting_service.rb
class VotingService
  def initialize(votable, user, voting_session_id = nil)
    @votable = votable
    @user = user
    @voting_session_id = voting_session_id || votable.try(:voting_session_id)
  end
  
  def cast_vote(vote_type, reason = nil)
    return { success: false, error: 'Invalid vote type' } unless valid_vote_type?(vote_type)
    return { success: false, error: 'User cannot vote' } unless can_vote?
    
    vote = Vote.find_or_initialize_by(
      votable: @votable,
      user: @user,
      voting_session_id: @voting_session_id
    )
    
    vote.vote_type = vote_type
    vote.reason = reason
    
    if vote.save
      # Check if voting should be finalized after this vote
      check_and_finalize_voting
      { success: true, vote: vote }
    else
      { success: false, error: vote.errors.full_messages.join(', ') }
    end
  end
  
  def get_vote
    Vote.find_by(votable: @votable, user: @user, voting_session_id: @voting_session_id)
  end
  
  def voting_stats
    votes = Vote.where(votable: @votable, voting_session_id: @voting_session_id)
    total_votes = votes.count
    yes_votes = votes.where(vote_type: 'yes').count
    no_votes = votes.where(vote_type: 'no').count
    total_members = @votable.investment_club.active_members.count
    
    # Calculate if threshold is met (all members voted)
    all_members_voted = total_votes >= total_members
    threshold_met = all_members_voted && yes_votes > no_votes
    
    {
      total_votes: total_votes,
      vote_breakdown: votes.group(:vote_type).count,
      user_vote: get_vote&.vote_type,
      approval_percentage: total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0,
      yes_votes: yes_votes,
      no_votes: no_votes,
      total_members: total_members,
      all_members_voted: all_members_voted,
      threshold_met: threshold_met
    }
  end
  
  private
  
  def valid_vote_type?(vote_type)
    Vote.vote_types_for(voting_context).include?(vote_type)
  end
  
  def voting_context
    @votable.class.name.underscore.to_sym
  end
  
  def can_vote?
    @votable.respond_to?(:can_vote?) ? @votable.can_vote?(@user) : true
  end
  
  def check_and_finalize_voting
    # Only finalize voting for club investments
    if @votable.is_a?(ClubInvestment) && @votable.voting?
      stats = voting_stats
      
      # Finalize if all members have voted OR after 7 days
      if stats[:all_members_voted] || @votable.created_at <= 7.days.ago
        @votable.finalize_voting
      end
    end
  end
end