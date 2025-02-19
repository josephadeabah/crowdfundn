namespace :user do
  desc 'Backfill confirmation tokens for legacy unconfirmed users'
  task backfill_tokens: :environment do
    # Target users where confirmation_token is nil and email_confirmed is false
    legacy_unconfirmed_users = User.where(confirmation_token: nil, email_confirmed: false)

    puts "Found #{legacy_unconfirmed_users.count} legacy unconfirmed users to backfill tokens for."

    legacy_unconfirmed_users.find_each do |user|
      user.generate_confirmation_token
      user.save!(validate: false) # Avoid validations for incomplete legacy data
      puts "Generated confirmation token for user with ID #{user.id} (email: #{user.email})"
    end

    puts "Backfill complete. Processed #{legacy_unconfirmed_users.count} users."
  end
end
