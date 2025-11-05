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
    {
      total_votes: votes.count,
      vote_breakdown: votes.group(:vote_type).count,
      user_vote: get_vote&.vote_type
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
end