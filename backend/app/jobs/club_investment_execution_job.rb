# app/jobs/club_investment_execution_job.rb
class ClubInvestmentExecutionJob < ApplicationJob
  queue_as :default

  def perform(club_investment_id)
    club_investment = ClubInvestment.find_by(id: club_investment_id)
    return unless club_investment
    
    # Only execute if still approved and in voting status
    if club_investment.approved? && club_investment.voting?
      investment_service = ClubInvestmentService.new(club_investment)
      result = investment_service.execute_investment
      
      unless result[:success]
        Rails.logger.error "Failed to auto-execute club investment #{club_investment_id}: #{result[:error]}"
        # Notify club admins of failure using new service
        club_investment.investment_club.admin_members.each do |admin|
          ClubEmailService.send_investment_execution_failed(
            admin: admin,
            club_investment: club_investment,
            error: result[:error]
          )
        end
      end
    end
  end
end