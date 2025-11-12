# app/serializers/club_contribution_serializer.rb
class ClubContributionSerializer
  def initialize(contribution, options = {})
    @contribution = contribution
    @include_membership = options[:include_membership] || false
  end
  
  def as_json
    json_data = {
      id: @contribution.id,
      amount: @contribution.amount,
      currency: @contribution.currency,
      status: @contribution.status,
      user: {
        id: @contribution.user.id,
        full_name: @contribution.user.full_name
      },
      transaction_reference: @contribution.transaction_reference,
      created_at: @contribution.created_at
    }

    # Include membership data if requested
    if @include_membership
      membership = @contribution.investment_club.membership_for(@contribution.user)
      if membership
        json_data[:membership] = {
          total_contributed: membership.total_contributed,
          contributed_share: membership.contributed_share
        }
      end
    end

    json_data
  end
end