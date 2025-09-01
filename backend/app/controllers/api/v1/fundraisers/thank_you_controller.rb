# app/controllers/api/v1/fundraisers/thank_you_controller.rb
module Api
  module V1
    module Fundraisers
      class ThankYouController < ApplicationController
        before_action :authenticate_request

        # POST /api/v1/fundraisers/send_thank_you_email
        def send_thank_you_email
          thank_you_params = params.permit(:email, :full_name, :amount, :campaign_title, :currency, :type)

          # Use your existing ThankYouEmailService
          ThankYouEmailService.send_thank_you_email(
            thank_you_params[:email],
            thank_you_params[:full_name] || 'Anonymous',
            @current_user.full_name,
            @current_user.profile&.avatar_url,
            thank_you_params[:campaign_title],
            thank_you_params[:currency] || 'GHS',
            thank_you_params[:amount].to_f.round(2)
          )

          render json: { message: 'Thank you email sent successfully' }, status: :ok
        rescue => e
          Rails.logger.error "Error sending thank you email: #{e.message}"
          render json: { error: 'Failed to send thank you email' }, status: :unprocessable_entity
        end

        # POST /api/v1/fundraisers/send_bulk_thank_you_emails
        def send_bulk_thank_you_emails
          backers = params[:backers] || []

          backers.each do |backer|
            ThankYouEmailService.send_thank_you_email(
              backer[:email],
              backer[:full_name] || 'Anonymous',
              @current_user.full_name,
              @current_user.profile&.avatar_url,
              backer[:campaign_title],
              backer[:currency] || 'GHS',
              backer[:amount].to_f.round(2)
            )
          end

          render json: { message: 'Thank you emails sent successfully' }, status: :ok
        rescue => e
          Rails.logger.error "Error sending bulk thank you emails: #{e.message}"
          render json: { error: 'Failed to send thank you emails' }, status: :unprocessable_entity
        end
      end
    end
  end
end