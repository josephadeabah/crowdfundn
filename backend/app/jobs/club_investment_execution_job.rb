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
        # Notify club admins of failure
        notify_execution_failure(club_investment, result[:error])
      end
    end
  end

  private

  def notify_execution_failure(club_investment, error)
    club_investment.investment_club.admin_members.each do |admin|
      ClubMailer.investment_execution_failed(admin, club_investment, error).deliver_later
    end
  end
end