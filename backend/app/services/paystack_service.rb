require 'net/http'
require 'uri'
require 'json'
require 'openssl'

class PaystackService
  PAYSTACK_BASE_URL = 'https://api.paystack.co'

  def initialize
    @secret_key = ENV['PAYSTACK_PRIVATE_KEY']
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
end