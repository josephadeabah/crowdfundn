# app/services/club_analytics_service.rb
class ClubAnalyticsService
  def initialize(club)
    @club = club
  end

  def calculate_analytics
    {
      total_members: @club.active_members.count,
      total_contributions: @club.total_contributions,
      total_invested: @club.total_invested,
      current_balance: @club.current_balance,
      active_investments: @club.club_investments.voting.count,
      completed_investments: @club.club_investments.executed.count,
      pending_investments: @club.club_investments.pending.count,
      average_contribution: calculate_average_contribution,
      member_engagement: calculate_member_engagement,
      investment_success_rate: calculate_investment_success_rate
    }
  end

  private

  def calculate_average_contribution
    total_contributions = @club.total_contributions
    active_members = @club.active_members.count
    active_members > 0 ? (total_contributions / active_members).round(2) : 0
  end

  def calculate_member_engagement
    total_members = @club.active_members.count
    voting_members = Vote.where(
      votable_type: 'ClubInvestment', 
      voting_session_id: @club.club_investments.pluck(:voting_session_id).compact
    ).distinct.count(:user_id)
    
    total_members > 0 ? ((voting_members.to_f / total_members) * 100).round(2) : 0
  end

  def calculate_investment_success_rate
    total_investments = @club.club_investments.count
    successful_investments = @club.club_investments.executed.count
    
    total_investments > 0 ? ((successful_investments.to_f / total_investments) * 100).round(2) : 0
  end
end