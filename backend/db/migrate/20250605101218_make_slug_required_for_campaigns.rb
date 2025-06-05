class MakeSlugRequiredForCampaigns < ActiveRecord::Migration[7.1]
  def up
    # First add slugs to any campaigns that don't have them
    Campaign.where(slug: nil).find_each do |campaign|
      slug = campaign.title.parameterize
      if Campaign.exists?(slug: slug)
        slug = "#{slug}-#{SecureRandom.hex(4)}"
      end
      campaign.update_column(:slug, slug) # skip validations for speed
    end

    # Then make the column non-nullable
    change_column_null :campaigns, :slug, false
  end

  def down
    change_column_null :campaigns, :slug, true
  end
end