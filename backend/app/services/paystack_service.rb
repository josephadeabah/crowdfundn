require 'net/http'
require 'uri'
require 'json'
require 'openssl'

class PaystackService
  PAYSTACK_BASE_URL = Rails.application.config.paystack[:base_url]

  CURRENCY_UNIT_MULTIPLIERS = {
    "NGN" => 100,  # Naira (100 Kobo)
    "USD" => 100,  # US Dollar (100 Cents)
    "EUR" => 100,  # Euro (100 Cents)
    "GBP" => 100,  # British Pound (100 Pence)
    "KES" => 100,  # Kenyan Shilling (100 Cents)
    "GHS" => 100,  # Ghanaian Cedi (100 Pesewa)
    # Add more currencies here as necessary
  }

  def initialize
    @secret_key = Rails.application.config.paystack[:private_key]
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

    # Create a subaccount
    def create_subaccount(
      business_name: nil, 
      settlement_bank: nil, 
      account_number: nil, 
      bank_code: nil, 
      percentage_charge: nil, 
      description: nil, 
      primary_contact_email: nil, 
      primary_contact_name: nil, 
      primary_contact_phone: nil, 
      metadata: nil
    )
      uri = URI("#{PAYSTACK_BASE_URL}/subaccount")
      body = {
        business_name: business_name,
        settlement_bank: settlement_bank,
        account_number: account_number,
        bank_code: bank_code,
        percentage_charge: percentage_charge,
        description: description,
        primary_contact_email: primary_contact_email,
        primary_contact_name: primary_contact_name,
        primary_contact_phone: primary_contact_phone,
        metadata: metadata
      }.compact.to_json # Remove nil values
  
      response = make_post_request(uri, body)
      parse_response(response)
    end

      # Update a subaccount
  def update_subaccount(subaccount_code:, business_name: nil, settlement_bank: nil, account_number: nil, 
                        bank_code: nil, percentage_charge: nil, description: nil, 
                        primary_contact_email: nil, primary_contact_name: nil, 
                        primary_contact_phone: nil, metadata: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/subaccount/#{subaccount_code}")
    
    body = {
      business_name: business_name,
      settlement_bank: settlement_bank,
      account_number: account_number,
      bank_code: bank_code,
      percentage_charge: percentage_charge,
      description: description,
      primary_contact_email: primary_contact_email,
      primary_contact_name: primary_contact_name,
      primary_contact_phone: primary_contact_phone,
      metadata: metadata
    }.compact.to_json  # Remove nil values
    
    response = make_put_request(uri, body)
    parse_response(response)
  end

  def create_split(name:, type:, currency:, subaccounts: [])
    uri = URI("#{PAYSTACK_BASE_URL}/split")
    body = {
      name: name,
      type: type,
      currency: currency,
      subaccounts: subaccounts
    }.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # 3. Initialize Transaction with Split Code
  def initialize_transaction(email:, amount:, plan: nil, metadata: {}, subaccount:, split_code:)
    return { status: 'error', message: 'Email address is required' } if email.blank?

    uri = URI("#{PAYSTACK_BASE_URL}/transaction/initialize")
    body = {
      email: email,
      amount: (amount * 100).to_i, # Convert to kobo
      plan: plan,
      reference: SecureRandom.uuid,
      metadata: metadata, # Add metadata to the transaction
      subaccount: subaccount,  # Add the subaccount_code here
      split_code: split_code
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

  # verifies validity of an account number for users in ghana & nigeria
  def resolve_account_details(account_number:, bank_code:)
    uri = URI("#{PAYSTACK_BASE_URL}/bank/resolve")
    uri.query = URI.encode_www_form(account_number: account_number, bank_code: bank_code)
    response = make_get_request(uri)
    parse_response(response)
  end


   # Create a single transfer recipient
  def create_transfer_recipient(type:, name:, account_number:, bank_code:, currency:, description: nil, metadata:)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient")
    body = {
      type: type,
      name: name,
      account_number: account_number,
      bank_code: bank_code,
      currency: currency,
      description: description,
      metadata: metadata
    }.compact.to_json # Removes nil values from the hash

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # Update a transfer recipient
  def update_transfer_recipient(recipient_code:, name: nil, email: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient/#{recipient_code}")

    body = {
      name: name,
      email: email
    }.compact.to_json # Remove nil values

    response = make_put_request(uri, body)
    parse_response(response)
  end

  # Delete a transfer recipient by recipient_code
  def delete_transfer_recipient(recipient_code)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient/#{recipient_code}")
    response = make_delete_request(uri)
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

  def check_balance
    uri = URI("#{PAYSTACK_BASE_URL}/balance")
    response = make_get_request(uri)
    parse_response(response)
  end
  
  def sufficient_balance?(amount)
    balance_response = check_balance
    if balance_response[:status]
      available_balance = balance_response[:data].first[:balance] / 100.0 # Convert from kobo to your currency
      available_balance >= amount
    else
      Rails.logger.error("Failed to retrieve balance: #{balance_response[:message]}")
      false
    end
  end

  def convert_to_smallest_unit(amount:, currency:)
    # Get the multiplier for the given currency
    multiplier = CURRENCY_UNIT_MULTIPLIERS[currency.upcase]
    raise "Unsupported currency: #{currency}" if multiplier.nil?

    # Convert the amount to the smallest unit (e.g., cents or kobo)
    amount_in_smallest_unit = (amount.to_f * multiplier).to_i
    amount_in_smallest_unit
  end
  
  # Initiate a transfer
  def initiate_transfer(amount:, recipient:, reason:, currency:)

    amount_in_smallest_unit = convert_to_smallest_unit(amount: amount, currency: currency)
    # Generate a unique transfer reference (UUID)
    transfer_reference = SecureRandom.uuid

    uri = URI("#{PAYSTACK_BASE_URL}/transfer")
    body = {
      source: "balance",
      amount: amount_in_smallest_unit,
      recipient: recipient,
      reason: reason,
      currency: currency,
      reference: transfer_reference  # Add the generated reference to the body
    }.compact.to_json

    response = make_post_request(uri, body)
    parse_response(response)
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
  def fetch_transfer(transfer_code)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer/#{transfer_code}")
    response = make_get_request(uri)
    parse_response(response)
  end

  # Verify transfer status
  def verify_transfer(reference)
    uri = URI("#{PAYSTACK_BASE_URL}/transfer/verify/#{reference}")
    response = make_get_request(uri)
    parse_response(response)
  end

  # Fetch Settlements with optional query parameters
  def fetch_settlements(page: 1, per_page: 50, subaccount: nil)
    # Build query parameters
    query_params = {
      perPage: per_page,
      page: page,
      subaccount: subaccount,
    }.compact  # Remove nil values

    # Build the URI with query parameters
    uri = URI("#{PAYSTACK_BASE_URL}/settlement")
    uri.query = URI.encode_www_form(query_params)

    # Make GET request to fetch settlements
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

  # Make PUT request
  def make_put_request(uri, body)
    request = Net::HTTP::Put.new(uri, headers)  # Use PUT method
    request.body = body
    @http.request(request)
  end

  def make_delete_request(uri)
    request = Net::HTTP::Delete.new(uri, headers)
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