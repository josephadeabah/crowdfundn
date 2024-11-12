require 'net/http'
require 'uri'
require 'json'

class PaystackService
  PAYSTACK_BASE_URL = 'https://api.paystack.co'

  def initialize
    @secret_key = ENV['PAYSTACK_PRIVATE_KEY']
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

  def verify_transaction(reference)
    url = URI("#{PAYSTACK_BASE_URL}/transaction/verify/#{reference}")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request['Authorization'] = "Bearer #{@secret_key}"

    response = http.request(request)
    JSON.parse(response.body, symbolize_names: true)
  end
end
