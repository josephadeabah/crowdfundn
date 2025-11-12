# app/serializers/member_share_change_serializer.rb
class MemberShareChangeSerializer
  def initialize(share_change, options = {})
    @share_change = share_change
    @include_details = options[:include_details] || false
  end

  def as_json
    json_data = {
      id: @share_change.id,
      previous_share: @share_change.previous_share,
      new_share: @share_change.new_share,
      change_amount: @share_change.change_amount,
      change_percentage: @share_change.share_change_percentage,
      change_reason: @share_change.change_reason,
      total_contributions_at_time: @share_change.total_contributions_at_time,
      created_at: @share_change.created_at,
      updated_at: @share_change.updated_at
    }

    # Include contribution details if available and requested
    if @share_change.investment_club_contribution && @include_details
      json_data[:contribution] = {
        id: @share_change.investment_club_contribution.id,
        amount: @share_change.investment_club_contribution.amount,
        currency: @share_change.investment_club_contribution.currency,
        created_at: @share_change.investment_club_contribution.created_at
      }
    end

    # Include membership details
    if @share_change.investment_club_membership
      membership = @share_change.investment_club_membership
      json_data[:membership] = {
        id: membership.id,
        user: {
          id: membership.user.id,
          full_name: membership.user.full_name
        },
        club: {
          id: membership.investment_club.id,
          name: membership.investment_club.name,
          slug: membership.investment_club.slug
        }
      }
    end

    json_data
  end
end