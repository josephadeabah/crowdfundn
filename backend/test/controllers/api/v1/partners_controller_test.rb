require "test_helper"

class Api::V1::PartnersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_partners_index_url
    assert_response :success
  end

  test "should get create_application" do
    get api_v1_partners_create_application_url
    assert_response :success
  end

  test "should get request_partnership" do
    get api_v1_partners_request_partnership_url
    assert_response :success
  end

  test "should get dashboard" do
    get api_v1_partners_dashboard_url
    assert_response :success
  end
end
