class FixMentorApplications < ActiveRecord::Migration[7.1]
  def up
    # Find mentor KYCs without mentor applications linked to users
    MentorApplication.where(user_id: nil).find_each do |app|
      kyc = Kyc.find_by(id: app.kyc_id)
      if kyc && kyc.user
        app.update_column(:user_id, kyc.user_id)
        puts "Fixed mentor application #{app.id}: linked to user #{kyc.user_id}"
      end
    end
    
    # Create mentor profiles for approved applications
    MentorApplication.where(status: 'approved', mentor_id: nil).find_each do |app|
      if app.user
        mentor = Mentor.find_or_create_by(user_id: app.user_id) do |m|
          m.professional_title = app.professional_title
          m.years_of_experience = app.years_of_experience
          m.linkedin_profile = app.linkedin_profile
          m.bio = app.mentorship_approach
          m.status = 'approved'
          m.current_assignments = 0
          m.max_assignments = 5
          m.rating = 0
          m.reviews_count = 0
        end
        
        # Add expertise tags
        (app.industry_expertise || []).each do |expertise|
          mentor.add_expertise(expertise)
        end
        
        app.update_column(:mentor_id, mentor.id)
        puts "Created mentor profile #{mentor.id} for user #{app.user_id}"
      end
    end
  end
  
  def down
    # Rollback if needed
  end
end