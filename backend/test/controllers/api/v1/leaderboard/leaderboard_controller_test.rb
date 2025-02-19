require 'test_helper'

class Api::V1::Leaderboard::LeaderboardControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    get api_v1_leaderboard_leaderboard_index_url
    assert_response :success
  end
end
