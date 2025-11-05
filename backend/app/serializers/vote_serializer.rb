# app/serializers/vote_serializer.rb
class VoteSerializer
  def initialize(vote)
    @vote = vote
  end
  
  def as_json
    {
      id: @vote.id,
      vote_type: @vote.vote_type,
      reason: @vote.reason,
      user: {
        id: @vote.user.id,
        full_name: @vote.user.full_name
      },
      created_at: @vote.created_at
    }
  end
end