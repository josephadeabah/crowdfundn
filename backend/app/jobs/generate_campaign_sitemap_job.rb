# app/jobs/generate_campaign_sitemap_job.rb
class GenerateCampaignSitemapJob < ApplicationJob
  queue_as :default

  SITEMAP_PATH = Rails.root.join('public', 'sitemap-campaigns.xml')

  def perform
    campaigns = Campaign.active.where(is_public: true).where(appear_in_search_results: true).select(:id, :slug, :updated_at).select(:id, :slug, :updated_at)
    base_url = 'https://www.bantuhive.com'

    xml = Nokogiri::XML::Builder.new(encoding: 'UTF-8') do |xml|
      xml.urlset(xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9') do
        campaigns.each do |campaign|
          xml.url do
            xml.loc "#{base_url}/campaign/#{campaign.slug}"
            xml.lastmod campaign.updated_at.iso8601
            xml.changefreq 'daily'
            xml.priority '0.8'
          end
        end
      end
    end

    File.write(SITEMAP_PATH, xml.to_xml)
    Rails.logger.info "[Sitemap] Generated sitemap-campaigns.xml with #{campaigns.count} campaigns"
  rescue => e
    Rails.logger.error "[Sitemap] Failed to generate sitemap: #{e.message}"
  end
end
