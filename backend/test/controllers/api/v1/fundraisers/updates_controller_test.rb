require 'test_helper'

class Api::V1::Fundraisers::UpdatesControllerTest < ActionDispatch::IntegrationTest
  test 'should get create' do
    get api_v1_fundraisers_updates_create_url
    assert_response :success
  end

  test 'should get update' do
    get api_v1_fundraisers_updates_update_url
    assert_response :success
  end

  test 'should get destroy' do
    get api_v1_fundraisers_updates_destroy_url
    assert_response :success
  end
end
