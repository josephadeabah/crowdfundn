require "test_helper"

class Api::V1::Fundraisers::CommentsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_fundraisers_comments_create_url
    assert_response :success
  end

  test "should get index" do
    get api_v1_fundraisers_comments_index_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_fundraisers_comments_destroy_url
    assert_response :success
  end
end
