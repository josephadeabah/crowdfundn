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
      
      # Ensure club_type is properly set
      Rails.logger.info "DEBUG: Creating club with club_type=#{club_data[:club_type]}"
      
      # Create the club with the creator
      club = InvestmentClub.new(club_data.merge(creator: @creator))
      
      # Debug the club attributes before save
      Rails.logger.info "DEBUG: Club attributes before save:"
      Rails.logger.info "  club_type=#{club.club_type}"
      Rails.logger.info "  access_type=#{club.access_type}"
      
      if club.save
        Rails.logger.info "DEBUG: Club saved successfully:"
        Rails.logger.info "  club_type=#{club.club_type}"
        Rails.logger.info "  access_type=#{club.access_type}"
        # Creator becomes first admin member
        membership = club.investment_club_memberships.create!(
          user: @creator,
          role: 'creator',
          status: 'active'
        )
        
        # Generate digital constitution
        generate_constitution(club)
        
        { success: true, club: club, membership: membership }
      else
        Rails.logger.error "DEBUG: Club save failed: #{club.errors.full_messages}"
        { success: false, errors: club.errors.full_messages }
      end
    end
  rescue => e
    { success: false, error: e.message }
  end
  
  private
  
  def generate_constitution(club)
    # Use existing canvas signature setup as mentioned in your requirements
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
    
    # Store constitution - could be PDF generated with your existing system
    club.update(constitution_data: constitution_data)
  end
end