# app/services/investment_club_creation_service.rb
class InvestmentClubCreationService
  def initialize(creator, params)
    @creator = creator
    @params = params
  end
  
  def create
    InvestmentClub.transaction do
      # Extract and prepare club data
      club_data = @params[:investment_club] || @params
      
      # Create the club with the creator
      club_attributes = {
        name: club_data[:name],
        mission: club_data[:mission],
        investment_focus: club_data[:investment_focus],
        minimum_monthly_contribution: club_data[:minimum_monthly_contribution],
        max_members: club_data[:max_members],
        creator: @creator,
        current_members_count: 0 # Start with 0, will be updated by callback
      }
      
      # Set club_type which will map to access_type via the setter
      club_attributes[:club_type] = club_data[:club_type] if club_data[:club_type].present?
      
      club = InvestmentClub.new(club_attributes)
      
      if club.save
        # Force update members count to ensure it's correct
        club.update_members_count
        
        # Generate digital constitution
        generate_constitution(club)
        
        { success: true, club: club }
      else
        { success: false, errors: club.errors.full_messages }
      end
    end
  rescue => e
    { success: false, error: e.message }
  end
  
  private
  
  def generate_constitution(club)
    constitution_data = {
      club_name: club.name,
      mission: club.mission,
      rules: {
        minimum_contribution: club.minimum_monthly_contribution,
        voting_threshold: 60.0,
        max_members: club.max_members
      },
      created_at: Time.current,
      creator: @creator.full_name
    }
    
    club.update(constitution_data: constitution_data)
  end
end