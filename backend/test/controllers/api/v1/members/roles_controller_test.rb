require "test_helper"

class Api::V1::Members::RolesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_members_roles_create_url
    assert_response :success
  end
end
