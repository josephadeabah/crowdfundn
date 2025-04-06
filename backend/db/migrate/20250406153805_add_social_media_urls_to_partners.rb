class AddSocialMediaUrlsToPartners < ActiveRecord::Migration[7.1]
  def change
    add_column :partners, :social_media_urls, :text
  end
end
