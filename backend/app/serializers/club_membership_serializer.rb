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
      current_share: @membership.current_share,
      joined_at: @membership.created_at
    }
  end
end