# app/serializers/club_contribution_serializer.rb
class ClubContributionSerializer
  def initialize(contribution)
    @contribution = contribution
  end
  
  def as_json
    {
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
  end
end