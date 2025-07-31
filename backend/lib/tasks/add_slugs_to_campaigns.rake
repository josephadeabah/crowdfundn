namespace :campaigns do
  desc 'Add slugs to existing campaigns'
  task add_slugs: :environment do
    Campaign.transaction do
      Campaign.where(slug: nil).find_each do |campaign|
        slug = campaign.title.parameterize
        slug = "#{slug}-#{SecureRandom.hex(4)}" if Campaign.exists?(slug: slug)
        campaign.update!(slug: slug)
        puts "Updated campaign #{campaign.id} (#{campaign.title}) with slug: #{campaign.slug}"
      rescue StandardError => e
        puts "Failed to update campaign #{campaign.id}: #{e.message}"
        raise # This will rollback the transaction if any update fails
      end
    end
    puts 'Slug generation complete!'
  end
end
