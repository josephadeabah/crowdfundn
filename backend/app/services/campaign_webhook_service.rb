class CampaignWebhookService
    def initialize(campaign)
      @campaign = campaign
    end
  
    def send_status_update
      url = "https://api.bantuhive.com/crowdfundn-backend2/api/v1/fundraisers/campaigns/webhook_status_update" # Your webhook URL
      
      payload = {
        campaign_id: @campaign.id,
        status: @campaign.status,
        title: @campaign.title,
        updated_at: @campaign.updated_at
      }
  
      # POST request to send the webhook
      response = RestClient.post(url, payload.to_json, { content_type: :json, accept: :json })
  
      Rails.logger.info "Webhook sent successfully, response: #{response.body}"
    rescue RestClient::ExceptionWithResponse => e
      Rails.logger.error "Webhook failed: #{e.response}"
    end
end
  