class InvestmentClubSerializer
  def initialize(club, options = {})
    @club = club
    @current_user = options[:current_user]
  end
  
  def as_json
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
      # ADD: Now this field exists in the database
      current_members_count: @club.current_members_count,
      financials: {
        total_contributions: @club.total_contributions,
        total_invested: @club.total_invested,
        current_balance: @club.current_balance
      },
      creator: {
        id: @club.creator.id,
        name: @club.creator.full_name
      },
      is_member: @current_user ? @club.is_member?(@current_user) : false,
      is_admin: @current_user ? @club.is_admin?(@current_user) : false,
      created_at: @club.created_at,
      updated_at: @club.updated_at
    }
  end
end