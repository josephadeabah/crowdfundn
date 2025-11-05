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
      
      # Create the club with the creator - use merge to ensure proper assignment
      club_attributes = {
        name: club_data[:name],
        mission: club_data[:mission],
        investment_focus: club_data[:investment_focus],
        minimum_monthly_contribution: club_data[:minimum_monthly_contribution],
        max_members: club_data[:max_members],
        creator: @creator,
        # Don't set current_members_count here - let the callback handle it
        current_members_count: 0 # Start with 0, callback will update to 1
      }
      
      # Set club_type which will map to access_type via the setter
      club_attributes[:club_type] = club_data[:club_type] if club_data[:club_type].present?
      
      club = InvestmentClub.new(club_attributes)
      
      # Debug the club attributes before save
      Rails.logger.info "DEBUG: Club attributes before save:"
      Rails.logger.info "  club_type=#{club.club_type}"
      Rails.logger.info "  access_type=#{club.access_type}"
      Rails.logger.info "  current_members_count=#{club.current_members_count}"
      Rails.logger.info "  valid?=#{club.valid?}"
      Rails.logger.info "  errors=#{club.errors.full_messages}" unless club.valid?
      
      if club.save
        Rails.logger.info "DEBUG: Club saved successfully:"
        Rails.logger.info "  club_type=#{club.club_type}"
        Rails.logger.info "  access_type=#{club.access_type}"
        Rails.logger.info "  current_members_count=#{club.current_members_count}"
        
        # The creator membership is now created via after_create callback
        # Generate digital constitution
        generate_constitution(club)
        
        { success: true, club: club }
      else
        Rails.logger.error "DEBUG: Club save failed: #{club.errors.full_messages}"
        { success: false, errors: club.errors.full_messages }
      end
    end
  rescue => e
    Rails.logger.error "DEBUG: Club creation error: #{e.message}"
    Rails.logger.error "DEBUG: Backtrace: #{e.backtrace.first(10).join("\n")}"
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