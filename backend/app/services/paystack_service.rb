require 'net/http'
require 'uri'
require 'json'
require 'openssl'

class PaystackService
  PAYSTACK_BASE_URL = 'https://api.paystack.co'

  def initialize
    @secret_key = ENV['PAYSTACK_PRIVATE_KEY']
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

  def initialize_transaction(email:, amount:, plan:, metadata: {})
    return { status: 'error', message: 'Email address is required' } if email.blank?

    url = URI("#{PAYSTACK_BASE_URL}/transaction/initialize")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    request['Content-Type'] = 'application/json'
    request.body = {
      email: email,
      amount: (amount * 100).to_i,
      plan: plan,
      reference: SecureRandom.uuid,
      metadata: metadata
    }.to_json

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end
  

  def verify_transaction(reference)
    url = URI("#{PAYSTACK_BASE_URL}/transaction/verify/#{reference}")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end

  def initiate_transfer(amount)
    recipient_code = "YOUR_RECIPIENT_CODE" # Obtain this code by registering your bank account as a recipient

    url = URI("#{PAYSTACK_BASE_URL}/transfer")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    request['Content-Type'] = 'application/json'
    request.body = {
      source: "balance",
      amount: (amount * 100).to_i, # Convert to kobo
      recipient: recipient_code,
      reason: "Platform fees transfer"
    }.to_json

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end

  def create_subscription_plan(name:, interval:, amount:)
    return { status: 'error', message: 'Amount is required and must be a number' } if amount.nil? || amount <= 0
  
    url = URI("#{PAYSTACK_BASE_URL}/plan")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
  
    request = Net::HTTP::Post.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    request['Content-Type'] = 'application/json'
    request.body = {
      name: name,
      interval: interval,
      amount: (amount * 100).to_i, # Convert to kobo
    }.to_json
  
    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end
  

  def create_subscription(email:, plan:, authorization:)
    url = URI("#{PAYSTACK_BASE_URL}/subscription")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    request['Content-Type'] = 'application/json'
    request.body = {
      customer: email,
      plan: plan,
      authorization: authorization
    }.to_json

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end

  def cancel_subscription(subscription_code:, email_token:)
    url = URI("#{PAYSTACK_BASE_URL}/subscription/disable")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
  
    request = Net::HTTP::Post.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    request['Content-Type'] = 'application/json'
    request.body = {
      code: subscription_code,
      token: email_token
    }.to_json
  
    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end
  

  def fetch_subscription(subscription_code)
    url = URI("#{PAYSTACK_BASE_URL}/subscription/#{subscription_code}")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end

   # Create a single transfer recipient
   def create_transfer_recipient(name:, account_number:, bank_code:, email:)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient")
    body = {
      type: 'nuban',
      name: name,
      account_number: account_number,
      bank_code: bank_code,
      currency: 'GHS',
      email: email
    }.to_json

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
  def initiate_transfer(amount:, recipient:, reason: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer")
    body = {
      source: "balance",
      amount: amount * 100, # Convert to kobo
      recipient: recipient,
      reason: reason
    }.to_json

    response = make_post_request(uri, body)
    parse_response(response)
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
    JSON.parse(response.body, symbolize_names: true)
  rescue JSON::ParserError
    { status: false, message: 'Invalid JSON response from Paystack' }
  end
end