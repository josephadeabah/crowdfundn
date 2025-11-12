# app/serializers/club_membership_serializer.rb
class ClubMembershipSerializer
  def initialize(membership)
    @membership = membership
  end
  
  def as_json
    {
      id: @membership.id,
      user: {
        id: @membership.user.id,
        full_name: @membership.user.full_name,
        email: @membership.user.email,
        avatar_url: @membership.user.profile&.avatar_url
      },
      role: @membership.role,
      status: @membership.status,
      total_contributed: @membership.total_contributed,
      # CHANGED: current_share to contributed_share
      contributed_share: @membership.contributed_share,
      joined_at: @membership.created_at,
      can_manage: @membership.can_manage?,
      can_vote: @membership.can_vote?,
      can_contribute: @membership.can_contribute?,
      # REMOVED: estimated_share_value since we don't calculate individual share values for contributions
      # Investment shares will be tracked separately when investments are made
    }
  end
end