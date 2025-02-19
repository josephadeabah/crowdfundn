require 'test_helper'

class Api::V1::Fundraisers::TransfersControllerTest < ActionDispatch::IntegrationTest
  test 'should get initialize_transfer' do
    get api_v1_fundraisers_transfers_initialize_transfer_url
    assert_response :success
  end

  test 'should get finalize_transfer' do
    get api_v1_fundraisers_transfers_finalize_transfer_url
    assert_response :success
  end

  test 'should get initiate_bulk_transfer' do
    get api_v1_fundraisers_transfers_initiate_bulk_transfer_url
    assert_response :success
  end

  test 'should get fetch_transfer' do
    get api_v1_fundraisers_transfers_fetch_transfer_url
    assert_response :success
  end

  test 'should get verify_transfer' do
    get api_v1_fundraisers_transfers_verify_transfer_url
    assert_response :success
  end
end
