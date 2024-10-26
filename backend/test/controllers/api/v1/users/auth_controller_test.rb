require 'test_helper'

class Api::V1::Users::AuthControllerTest < ActionDispatch::IntegrationTest
  test 'should get signup' do
    get api_v1_users_auth_signup_url
    assert_response :success
  end

  test 'should get login' do
    get api_v1_users_auth_login_url
    assert_response :success
  end

  test 'should get password_reset' do
    get api_v1_users_auth_password_reset_url
    assert_response :success
  end

  test 'should get reset_password' do
    get api_v1_users_auth_reset_password_url
    assert_response :success
  end
end
