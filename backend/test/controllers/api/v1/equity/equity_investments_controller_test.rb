require "test_helper"

class Api::V1::Equity::EquityInvestmentsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_equity_equity_investments_create_url
    assert_response :success
  end
end
