require 'net/http'
require 'uri'
require 'json'
require 'openssl'

class PaystackService
  PAYSTACK_BASE_URL = 'https://api.paystack.co'

  def initialize
    @secret_key = ENV['PAYSTACK_PRIVATE_KEY']
    raise "PAYSTACK_PRIVATE_KEY is not set in the environment variables." if @secret_key.nil?
    @http = Net::HTTP.new(URI(PAYSTACK_BASE_URL).host, URI(PAYSTACK_BASE_URL).port)
    @http.use_ssl = true
  end

  def headers
    {
      'Authorization' => "Bearer #{@secret_key}",
      'Content-Type' => 'application/json'
    }
  end

  def verify_paystack_signature(payload, signature)
    # Ensure the secret key and signature are available
    if @secret_key.nil? || signature.nil? || payload.blank?
      Rails.logger.error("Missing secret key, signature, or payload.")
      return false
    end

    # Create the hash to verify the signature
    expected_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha512'), @secret_key, payload)

    # Compare the signatures
    Rack::Utils.secure_compare(expected_signature, signature)
  end

  def initialize_transaction(email:, amount:, plan: nil, metadata: {})
    return { status: 'error', message: 'Email address is required' } if email.blank?
  
    uri = URI("#{PAYSTACK_BASE_URL}/transaction/initialize")
    body = {
      email: email,
      amount: (amount * 100).to_i, # Convert to kobo
      plan: plan,
      reference: SecureRandom.uuid,
      metadata: metadata
    }.compact.to_json
  
    response = make_post_request(uri, body)
    parse_response(response)
  end
  
  def verify_transaction(reference)
    uri = URI("#{PAYSTACK_BASE_URL}/transaction/verify/#{reference}")
    response = make_get_request(uri)
    parse_response(response)
  end

  
  def create_subscription_plan(name:, interval:, amount:)
    return { status: 'error', message: 'Amount is required and must be a number' } if amount.nil? || amount <= 0
  
    uri = URI("#{PAYSTACK_BASE_URL}/plan")
    body = {
      name: name,
      interval: interval,
      amount: (amount * 100).to_i # Convert to kobo
    }.to_json
  
    response = make_post_request(uri, body)
    parse_response(response)
  end
  
  def create_subscription(email:, plan:, authorization:)
    uri = URI("#{PAYSTACK_BASE_URL}/subscription")
    body = {
      customer: email,
      plan: plan,
      authorization: authorization
    }.to_json
  
    response = make_post_request(uri, body)
    parse_response(response)
  end
  
  def cancel_subscription(subscription_code:, email_token:)
    uri = URI("#{PAYSTACK_BASE_URL}/subscription/disable")
    body = {
      code: subscription_code,
      token: email_token
    }.to_json
  
    response = make_post_request(uri, body)
    parse_response(response)
  end
  
  def fetch_subscription(subscription_code)
    uri = URI("#{PAYSTACK_BASE_URL}/subscription/#{subscription_code}")
    response = make_get_request(uri)
    parse_response(response)
  end
  
  # Fetch list of supported countries
  def get_supported_countries
    url = URI("#{PAYSTACK_BASE_URL}/country")
    response = make_get_request(url)
    parse_response(response)
  end

    # Fetch list of banks with pagination and filters
  def get_bank_list(
    country: nil, 
    use_cursor: false, 
    per_page: 50, 
    next_cursor: nil, 
    previous_cursor: nil, 
    pay_with_bank_transfer: nil, 
    pay_with_bank: nil, 
    enabled_for_verification: nil, 
    gateway: nil, 
    type: nil, 
    currency: nil
  )
    # Build query parameters
    query_params = {
      country: country,
      use_cursor: use_cursor,
      perPage: per_page,
      next: next_cursor,
      previous: previous_cursor,
      pay_with_bank_transfer: pay_with_bank_transfer,
      pay_with_bank: pay_with_bank,
      enabled_for_verification: enabled_for_verification,
      gateway: gateway,
      type: type,
      currency: currency
    }.compact # Remove nil values

    # Build URI with query parameters
    uri = URI("#{PAYSTACK_BASE_URL}/bank")
    uri.query = URI.encode_www_form(query_params)

    # Make GET request
    response = make_get_request(uri)
    parse_response(response)
  end

   # Create a single transfer recipient
  def create_transfer_recipient(type:, name:, account_number: nil, bank_code: nil, currency:, authorization_code: nil, description: nil, metadata: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient")
    body = {
      type: type,
      name: name,
      account_number: account_number,
      bank_code: bank_code,
      currency: currency,
      authorization_code: authorization_code,
      description: description,
      metadata: metadata
    }.compact.to_json # Removes nil values from the hash

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # Bulk create transfer recipients
  def bulk_create_transfer_recipients(recipients:)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient/bulk")
    body = { batch: recipients }.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # List transfer recipients
  def list_transfer_recipients(page: 1, per_page: 50)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient?perPage=#{per_page}&page=#{page}")
    response = make_get_request(uri)
    parse_response(response)
  end

  # Fetch transfer recipient details by code
  def fetch_transfer_recipient(recipient_code)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient/#{recipient_code}")
    response = make_get_request(uri)
    parse_response(response)
  end

  # Initiate a transfer
  def initiate_transfer(amount:, recipient:, reason: nil, user:, campaign:, currency: "NGN")
    uri = URI("#{PAYSTACK_BASE_URL}/transfer")
    body = {
      source: "balance",
      amount: amount * 100, # Convert to kobo
      recipient: recipient,
      reason: reason,
      currency: currency
    }.compact.to_json
  
    response = make_post_request(uri, body)
    result = parse_response(response)
  
    unless result["status"]
      Rails.logger.error "Failed to initiate transfer: #{result['message']}"
      raise StandardError, "Transfer initiation failed: #{result['message']}"
    end
  
    transfer_code = result.dig("data", "transfer_code")
    transfer_status = result.dig("data", "status")
    otp_required = transfer_status == "otp"
  
    if otp_required
      puts "Transfer requires OTP confirmation."
      handle_otp_confirmation(transfer_code)
    else
      puts "Transfer is in progress or completed with status: #{transfer_status}."
    end
  
    # Save transfer details to the database
    Transfer.create!(
      transfer_code: transfer_code,
      recipient_code: recipient,
      amount: amount,
      user: user,
      campaign: campaign,
      status: transfer_status,
      otp_required: otp_required
    )
  
    result
  end  
  
  # Handle OTP confirmation using finalize_transfer
  def handle_otp_confirmation(transfer_code)
    loop do
      puts "Enter the OTP sent to your email or phone:"
      otp = gets.chomp
  
      result = finalize_transfer(transfer_code: transfer_code, otp: otp)
  
      if result["status"]
        puts "Transfer confirmed successfully: #{result['message']}"
        return result["data"]
      else
        puts "Failed to confirm transfer: #{result['message']}"
        if result['message'].include?('invalid OTP')
          puts "The OTP is invalid. Please try again."
        else
          break # Exit loop for other errors
        end
      end
    end
    nil
  end  

  # Finalize a transfer
  def finalize_transfer(transfer_code:, otp:)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer/finalize_transfer")
    body = {
      transfer_code: transfer_code,
      otp: otp
    }.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

   # Initiate a bulk transfer
   def initiate_bulk_transfer(transfers:)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer/bulk")
    body = {
      source: "balance",
      transfers: transfers
    }.to_json

    response = make_post_request(uri, body)
    parse_response(response)
   end

  # Fetch transfer details
  def fetch_transfer(id_or_code)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer/#{id_or_code}")
    response = make_get_request(uri)
    parse_response(response)
  end

  # Verify transfer status
  def verify_transfer(reference)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer/verify/#{reference}")
    response = make_get_request(uri)
    parse_response(response)
  end

  private

  def make_post_request(uri, body)
    request = Net::HTTP::Post.new(uri, headers)
    request.body = body
    @http.request(request)
  end

  def make_get_request(uri)
    request = Net::HTTP::Get.new(uri, headers)
    @http.request(request)
  end

  def parse_response(response)
    case response
    when Net::HTTPSuccess
      JSON.parse(response.body, symbolize_names: true)
    else
      { status: false, message: "HTTP #{response.code}: #{response.message}", body: response.body }
    end
  rescue JSON::ParserError
    { status: false, message: 'Invalid JSON response from Paystack' }
  end  
end