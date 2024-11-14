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
    expected_signature = OpenSSL::HMAC.hexdigest('sha512', @secret_key, payload)

    # Compare the signatures
    signature == expected_signature
  end

  def initialize_transaction(email:, amount:, metadata: {})
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
      reference: SecureRandom.uuid,
      metadata: metadata
    }.to_json

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end

   # Charge using Bank account or other methods (mobile money, USSD, etc.)
   def charge_payment(email:, amount:, metadata:, bank:, payment_method:)
    url = URI("#{PAYSTACK_BASE_URL}/charge")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
  
    request = Net::HTTP::Post.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"
    request['Content-Type'] = 'application/json'
  
    # Construct the body, include bank details or mobile money based on the payment method
    body = {
      email: email,
      amount: (amount * 100).to_i, # Convert to subunit (e.g., kobo for NGN)
      metadata: metadata,
      currency: 'GHS' # Ensure the currency is correctly set
    }
  
    case payment_method
    when 'bank'
      # If payment method is 'bank', include bank details
      body[:bank] = {
        code: bank[:code],
        account_number: bank[:account_number]
      }
    when 'mobile_money'
      # If payment method is 'mobile_money', include mobile_money details
      body[:mobile_money] = {
        phone_number: metadata[:phone_number],  # Phone number associated with mobile money
        provider: metadata[:provider]           # Mobile money provider (e.g., 'MTN')
      }
    when 'ussd'
      body[:ussd] = {
        phone_number: metadata[:phone_number]
      }
    when 'qr'
      body[:qr] = {
        provider: metadata[:provider] # For example: 'scan-to-pay'
      }
    when 'authorization_code'
      body[:authorization_code] = metadata[:authorization_code]
    else
      raise ArgumentError, "Unsupported payment method: #{payment_method}"
    end
  
    request.body = body.to_json
  
    # Send the request
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
end
