namespace :users do
    desc "Create default profiles for users without a profile"
    task create_default_profiles: :environment do
      User.where.missing(:profile).find_each do |user|
        user.create_default_profile
      end
      puts "Default profiles created for users without profiles."
    end
end
  