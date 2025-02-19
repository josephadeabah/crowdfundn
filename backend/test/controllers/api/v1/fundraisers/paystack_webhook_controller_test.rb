require 'test_helper'

class Api::V1::Fundraisers::PaystackWebhookControllerTest < ActionDispatch::IntegrationTest
  test 'should get receive' do
    get api_v1_fundraisers_paystack_webhook_receive_url
    assert_response :success
  end
end
