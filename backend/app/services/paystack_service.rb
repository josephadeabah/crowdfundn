# app/services/paystack_service.rb
require 'net/http'
require 'uri'
require 'json'
require 'openssl'

class PaystackService
  PAYSTACK_BASE_URL = Rails.application.config.paystack[:base_url]

  CURRENCY_UNIT_MULTIPLIERS = {
    'NGN' => 100,  # Naira (100 Kobo)
    'USD' => 100,  # US Dollar (100 Cents)
    'EUR' => 100,  # Euro (100 Cents)
    'GBP' => 100,  # British Pound (100 Pence)
    'KES' => 100,  # Kenyan Shilling (100 Cents)
    'GHS' => 100 # Ghanaian Cedi (100 Pesewa)
  }

  def initialize
    @secret_key = Rails.application.config.paystack[:private_key]
    raise 'PAYSTACK_PRIVATE_KEY is not set in the environment variables.' if @secret_key.nil?

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
    if @secret_key.nil? || signature.nil? || payload.blank?
      Rails.logger.error('Missing secret key, signature, or payload.')
      return false
    end

    expected_signature = OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha512'), @secret_key, payload)
    Rack::Utils.secure_compare(expected_signature, signature)
  end

  # Fetch a subaccount's details from Paystack
  def fetch_subaccount(subaccount_code)
    uri = URI("#{PAYSTACK_BASE_URL}/subaccount/#{subaccount_code}")
    response = make_get_request(uri)
    
    parsed_response = parse_response(response)
    
    if parsed_response[:status] == true
      {
        status: true,
        data: parsed_response[:data],
        message: parsed_response[:message] || 'Subaccount retrieved successfully'
      }
    else
      {
        status: false,
        message: parsed_response[:message] || 'Failed to fetch subaccount',
        code: response.code
      }
    end
  rescue => e
    Rails.logger.error "Error fetching subaccount: #{e.message}"
    {
      status: false,
      message: "Error fetching subaccount: #{e.message}",
      error: e
    }
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
    }.compact.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # Update a subaccount
  def update_subaccount(subaccount_code:, business_name: nil, settlement_bank: nil, account_number: nil,
                        bank_code: nil, percentage_charge: nil, description: nil,
                        primary_contact_email: nil, primary_contact_name: nil,
                        primary_contact_phone: nil, metadata: nil, subaccount_type: nil)
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
      metadata: metadata,
      subaccount_type: subaccount_type
    }.compact.to_json

    response = make_put_request(uri, body)
    parse_response(response)
  end

  # Initialize Transaction with Split Code
  def initialize_transaction(email:, amount:, callback_url:, metadata:, currency:, subaccount: nil, plan: nil)
    return { status: 'error', message: 'Email address is required' } if email.blank?

    uri = URI("#{PAYSTACK_BASE_URL}/transaction/initialize")
    amount_in_smallest_unit = convert_to_smallest_unit(amount: amount, currency: currency)
    
    body = {
      email: email,
      amount: amount_in_smallest_unit,
      plan: plan,
      reference: SecureRandom.uuid,
      metadata: metadata,
      callback_url: callback_url,
      currency: currency
    }
    
    body[:subaccount] = subaccount if subaccount.present?
    
    response = make_post_request(uri, body.to_json)
    parse_response(response)
  end

  def verify_transaction(reference)
    uri = URI("#{PAYSTACK_BASE_URL}/transaction/verify/#{reference}")
    response = make_get_request(uri)
    parse_response(response)
  end

  def initiate_refund(transaction:, amount: nil, currency: nil, customer_note: nil, merchant_note: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/refund")
    
    converted_amount = if amount && currency
      convert_to_smallest_unit(amount: amount, currency: currency)
    end
    
    body = {
      transaction: transaction,
      amount: converted_amount,
      currency: currency,
      customer_note: customer_note,
      merchant_note: merchant_note
    }.compact.to_json

    response = make_post_request(uri, body)
    
    Rails.logger.info "Paystack refund response: #{response.body}"
    
    parse_response(response)
  end

  def cancel_authorized_payment(transaction_reference, amount = nil, currency = nil, reason = "Investment cancelled")
    initiate_refund(
      transaction: transaction_reference,
      amount: amount,
      currency: currency,
      customer_note: "Investment cancelled - #{reason}",
      merchant_note: "Automatic cancellation for equity investment"
    )
  end

  def create_subscription_plan(name:, interval:, amount:, currency:)
    valid_intervals = %w[daily weekly monthly quarterly biannually annually]

    return { status: 'error', message: 'Invalid interval' } unless valid_intervals.include?(interval.to_s)
    return { status: 'error', message: 'Amount must be at least 50' } if amount.to_f < 0.5

    uri = URI("#{PAYSTACK_BASE_URL}/plan")
    body = {
      name: name,
      interval: interval,
      amount: (amount.to_f * 100).to_i,
      currency: currency
    }.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

  def cancel_subscription(code:, token: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/subscription/disable")
    body = {
      code: code,
      token: token
    }.compact.to_json

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
    }.compact

    uri = URI("#{PAYSTACK_BASE_URL}/bank")
    uri.query = URI.encode_www_form(query_params)

    response = make_get_request(uri)
    parse_response(response)
  end

  # FIXED: Resolve account details with proper error handling
  def resolve_account_details(account_number:, bank_code:)
    uri = URI("#{PAYSTACK_BASE_URL}/bank/resolve")
    uri.query = URI.encode_www_form(account_number: account_number, bank_code: bank_code)
    
    Rails.logger.info "Paystack resolve account request: #{uri}"
    response = make_get_request(uri)
    
    Rails.logger.info "Paystack raw response code: #{response.code}"
    Rails.logger.info "Paystack raw response body: #{response.body}"
    
    parsed_response = parse_response(response)
    Rails.logger.info "Paystack parsed response: #{parsed_response.inspect}"
    
    # Ensure consistent response format
    if parsed_response[:status] == true
      {
        status: true,
        data: parsed_response[:data],
        message: parsed_response[:message] || 'Account resolved successfully'
      }
    else
      {
        status: false,
        message: parsed_response[:message] || 'Failed to resolve account',
        body: parsed_response
      }
    end
  rescue StandardError => e
    Rails.logger.error "Error in resolve_account_details: #{e.message}"
    {
      status: false,
      message: e.message,
      body: nil
    }
  end

  # Create a single transfer recipient
  def create_transfer_recipient(type:, name:, account_number:, bank_code:, currency:, metadata:, description: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient")
    body = {
      type: type,
      name: name,
      account_number: account_number,
      bank_code: bank_code,
      currency: currency,
      description: description,
      metadata: metadata
    }.compact.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # Update a transfer recipient
  def update_transfer_recipient(recipient_code:, name: nil, email: nil)
    uri = URI("#{PAYSTACK_BASE_URL}/transferrecipient/#{recipient_code}")

    body = {
      name: name,
      email: email
    }.compact.to_json

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
      available_balance = balance_response[:data].first[:balance] / 100.0
      available_balance >= amount
    else
      Rails.logger.error("Failed to retrieve balance: #{balance_response[:message]}")
      false
    end
  end

  def convert_to_smallest_unit(amount:, currency:)
    multiplier = CURRENCY_UNIT_MULTIPLIERS[currency.upcase]
    raise "Unsupported currency: #{currency}" if multiplier.nil?

    (amount.to_f * multiplier).to_i
  end

  # Initiate a transfer
  def initiate_transfer(amount:, recipient:, reason:, currency:)
    amount_in_smallest_unit = convert_to_smallest_unit(amount: amount, currency: currency)
    transfer_reference = SecureRandom.uuid

    uri = URI("#{PAYSTACK_BASE_URL}/transfer")
    body = {
      source: 'balance',
      amount: amount_in_smallest_unit,
      recipient: recipient,
      reason: reason,
      currency: currency,
      reference: transfer_reference
    }.compact.to_json

    response = make_post_request(uri, body)
    parse_response(response)
  end

  # Handle OTP confirmation using finalize_transfer
  def handle_otp_confirmation(transfer_code)
    loop do
      puts 'Enter the OTP sent to your email or phone:'
      otp = gets.chomp

      result = finalize_transfer(transfer_code: transfer_code, otp: otp)

      if result['status']
        puts "Transfer confirmed successfully: #{result['message']}"
        return result['data']
      else
        puts "Failed to confirm transfer: #{result['message']}"
        break unless result['message'].include?('invalid OTP')

        puts 'The OTP is invalid. Please try again.'
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
      source: 'balance',
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
    query_params = {
      perPage: per_page,
      page: page,
      subaccount: subaccount
    }.compact

    uri = URI("#{PAYSTACK_BASE_URL}/settlement")
    uri.query = URI.encode_www_form(query_params)

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

  def make_put_request(uri, body)
    request = Net::HTTP::Put.new(uri, headers)
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
      begin
        JSON.parse(response.body, symbolize_names: true)
      rescue JSON::ParserError => e
        { 
          status: false, 
          message: "Invalid JSON response from Paystack: #{e.message}",
          body: response.body 
        }
      end
    else
      begin
        error_body = JSON.parse(response.body, symbolize_names: true)
        { 
          status: false, 
          message: "HTTP #{response.code}: #{response.message}",
          body: error_body 
        }
      rescue JSON::ParserError
        { 
          status: false, 
          message: "HTTP #{response.code}: #{response.message}",
          body: response.body 
        }
      end
    end
  end
end