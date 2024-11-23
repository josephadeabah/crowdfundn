class PaystackWebhook::TransferSuccessHandler
    def initialize(data)
      @data = data
    end
  
    def call
      Rails.logger.debug "Processing transfer success: #{@data[:reference]}"
      # Handle transfer logic here
      # Add any additional logic for successful transfers
    end
end
  