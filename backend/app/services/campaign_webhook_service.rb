# app/services/campaign_webhook_service.rb
class CampaignWebhookService
  attr_reader :campaign

  def initialize(campaign)
    @campaign = campaign
    @webhook_url = ENV.fetch('BACKEND_BASE_URL', 'https://api.crowdfundn.vercel.app') + '/api/v1/fundraisers/campaigns/webhook_status_update'
    @api_key = ENV.fetch('WEBHOOK_API_KEY', nil) # Optional: Add API key if needed
  end

  def send_status_update
    payload = build_payload
    headers = build_headers

    begin
      response = RestClient.post(@webhook_url, payload.to_json, headers)
      Rails.logger.info "Webhook sent successfully for campaign #{@campaign.id}, response: #{response.body}"
      
      # Parse response if needed
      parse_response(response)
    rescue RestClient::ExceptionWithResponse => e
      handle_rest_client_error(e)
    rescue RestClient::ConnectionFailed => e
      handle_connection_error(e)
    rescue RestClient::TimeoutError => e
      handle_timeout_error(e)
    rescue StandardError => e
      handle_unexpected_error(e)
    end
  end

  private

  def build_payload
    {
      campaign_id: @campaign.id,
      status: @campaign.status,
      title: @campaign.title,
      slug: @campaign.slug,
      fundraiser_id: @campaign.fundraiser_id,
      updated_at: @campaign.updated_at.iso8601,
      created_at: @campaign.created_at.iso8601,
      webhook_sent_at: Time.current.iso8601,
      environment: Rails.env
    }.compact
  end

  def build_headers
    headers = {
      content_type: :json,
      accept: :json,
      'User-Agent' => "Bantuhive-Rails/#{Rails.version} (#{Rails.env})"
    }
    
    # Add API key if configured
    headers['X-API-Key'] = @api_key if @api_key.present?
    headers['Authorization'] = "Bearer #{@api_key}" if @api_key.present? && ENV.fetch('WEBHOOK_AUTH_TYPE', 'header') == 'bearer'
    
    headers
  end

  def parse_response(response)
    JSON.parse(response.body) if response.body.present?
  rescue JSON::ParserError => e
    Rails.logger.warn "Could not parse webhook response JSON: #{e.message}"
    nil
  end

  def handle_rest_client_error(e)
    if e.response
      status_code = e.response.code
      response_body = e.response.body
      Rails.logger.error "Webhook failed for campaign #{@campaign.id}: #{status_code} - #{response_body}"
      
      # Log to error tracking service if configured
      log_to_error_tracking(e, status_code, response_body)
      
      # Return false so caller knows it failed
      false
    else
      Rails.logger.error "Webhook failed for campaign #{@campaign.id}: No response received"
      false
    end
  end

  def handle_connection_error(e)
    Rails.logger.error "Webhook connection failed for campaign #{@campaign.id}: #{e.message}"
    log_to_error_tracking(e)
    false
  end

  def handle_timeout_error(e)
    Rails.logger.error "Webhook timeout for campaign #{@campaign.id}: #{e.message}"
    log_to_error_tracking(e)
    false
  end

  def handle_unexpected_error(e)
    Rails.logger.error "Unexpected webhook error for campaign #{@campaign.id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
    log_to_error_tracking(e)
    false
  end

  def log_to_error_tracking(error, status_code = nil, response_body = nil)
    # Add your error tracking service here (e.g., Sentry, Honeybadger, etc.)
    if defined?(Sentry)
      Sentry.capture_exception(error, extra: { 
        campaign_id: @campaign.id, 
        status_code: status_code, 
        response_body: response_body 
      })
    end
    
    # You could also log to a dedicated webhook_errors table
    # WebhookError.create!(
    #   campaign_id: @campaign.id,
    #   error_class: error.class.name,
    #   error_message: error.message,
    #   status_code: status_code,
    #   response_body: response_body,
    #   backtrace: error.backtrace&.join("\n")
    # )
  end
end