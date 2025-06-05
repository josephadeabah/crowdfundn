namespace :campaigns do
  desc "Add slugs to existing campaigns"
  task add_slugs: :environment do
    Campaign.where(slug: nil).find_each do |campaign|
      begin
        slug = campaign.title.parameterize
        # Handle duplicate slugs
        if Campaign.exists?(slug: slug)
          slug = "#{slug}-#{SecureRandom.hex(4)}"
        end
        campaign.update!(slug: slug)
        puts "Updated campaign #{campaign.id} (#{campaign.title}) with slug: #{campaign.slug}"
      rescue => e
        puts "Failed to update campaign #{campaign.id}: #{e.message}"
      end
    end
    puts "Slug generation complete!"
  end
end