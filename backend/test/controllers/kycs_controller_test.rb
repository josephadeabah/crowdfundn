require "test_helper"

class KycsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get kycs_index_url
    assert_response :success
  end

  test "should get create" do
    get kycs_create_url
    assert_response :success
  end

  test "should get update" do
    get kycs_update_url
    assert_response :success
  end
end
