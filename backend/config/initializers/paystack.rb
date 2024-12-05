# config/initializers/paystack.rb
Rails.application.config.paystack = {
    base_url: 'https://api.paystack.co',
    private_key: ENV['PAYSTACK_PRIVATE_KEY']
}
  