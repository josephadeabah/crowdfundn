class CampaignWebhookService
    def initialize(campaign)
      @campaign = campaign
    end
  
    def send_status_update
        url = "https://api.bantuhive.com/crowdfundn-backend2/api/v1/fundraisers/campaigns/webhook_status_update"
        
        payload = {
          campaign_id: @campaign.id,
          status: @campaign.status,
          title: @campaign.title,
          updated_at: @campaign.updated_at
        }
      
        begin
          response = RestClient.post(url, payload.to_json, { content_type: :json, accept: :json })
          Rails.logger.info "Webhook sent successfully, response: #{response.body}"
        rescue RestClient::ExceptionWithResponse => e
          if e.response
            Rails.logger.error "Webhook failed: #{e.response.code} - #{e.response.body}"
          else
            Rails.logger.error "Webhook failed: No response received."
          end
        rescue StandardError => e
          Rails.logger.error "Unexpected error: #{e.message}"
        end
    end      
end
  