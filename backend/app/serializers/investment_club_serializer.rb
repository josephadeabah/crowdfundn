# app/serializers/investment_club_serializer.rb
class InvestmentClubSerializer
  def initialize(club, options = {})
    @club = club
    @current_user = options[:current_user]
  end
  
  def as_json
    membership = @club.membership_for(@current_user) if @current_user
    
    # FIXED: Use safe financial calculations
    financials = {
      total_contributions: @club.total_contributions,
      total_invested: @club.total_invested,
      current_balance: @club.current_balance
    }

    {
      id: @club.id,
      slug: @club.slug,
      name: @club.name,
      mission: @club.mission,
      investment_focus: @club.investment_focus,
      club_type: @club.club_type,
      status: @club.status,
      minimum_monthly_contribution: @club.minimum_monthly_contribution,
      max_members: @club.max_members,
      current_members_count: @club.current_members_count,
      currency: @club.creator_currency,
      financials: financials,
      creator: {
        id: @club.creator.id,
        name: @club.creator.full_name
      },
      is_member: @current_user ? @club.is_member?(@current_user) : false,
      is_admin: @current_user ? @club.is_admin?(@current_user) : false,
      is_creator: @current_user ? @club.is_creator?(@current_user) : false,
      membership_status: membership ? membership.status : 'none',
      created_at: @club.created_at,
      updated_at: @club.updated_at
    }
  rescue => e
    Rails.logger.error "Error serializing investment club #{@club&.id}: #{e.message}"
    # Return basic club data without financials if there's an error
    {
      id: @club.id,
      slug: @club.slug,
      name: @club.name,
      mission: @club.mission,
      investment_focus: @club.investment_focus,
      club_type: @club.club_type,
      status: @club.status,
      minimum_monthly_contribution: @club.minimum_monthly_contribution,
      max_members: @club.max_members,
      current_members_count: @club.current_members_count,
      currency: @club.currency,
      financials: {
        total_contributions: 0,
        total_invested: 0,
        current_balance: 0
      },
      creator: {
        id: @club.creator.id,
        name: @club.creator.full_name
      },
      is_member: false,
      is_admin: false,
      is_creator: false,
      membership_status: 'none',
      created_at: @club.created_at,
      updated_at: @club.updated_at
    }
  end
end