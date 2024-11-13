module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index]

        def index
          if @current_user.nil?
            return render json: { error: 'You need to log in to access donations.' }, status: :unauthorized
          end
          
          page = params[:page] || 1
          per_page = params[:per_page] || 10
          
          campaigns = Campaign.where(fundraiser_id: @current_user.id)
          
          donations = Donation.where(status: 'successful')
                              .where('user_id IS NULL OR user_id = ?', @current_user.id)
                              .where(campaign_id: campaigns.pluck(:id))
                              .order(created_at: :desc)
                              .page(page)
                              .per(per_page)
          
          pagination = {
            current_page: donations.current_page,
            total_pages: donations.total_pages,
            per_page: donations.limit_value,
            total_count: donations.total_count
          }
          
          render json: { donations: donations, pagination: pagination }, status: :ok
        end

        def create
          campaign = Campaign.find_by(id: params[:campaign_id])
          unless campaign
            return render json: { error: 'The campaign you are trying to donate to no longer exists.' }, status: :not_found
          end

          donation = Donation.new(donation_params)
          donation.campaign_id = campaign.id
          donation.status = 'pending'
          donation.user_id = @current_user&.id
          
          donation.metadata[:campaign] = {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description.to_plain_text,
            goal_amount: campaign.goal_amount,
            current_amount: campaign.current_amount,
            currency: campaign.currency,
            currency_symbol: campaign.currency_symbol,
            fundraiser_id: campaign.fundraiser_id,
            fundraiser_name: campaign.fundraiser.full_name
          }

          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: donation.email,
            amount: donation.amount,
            metadata: { user_id: donation.user_id, campaign_id: donation.campaign_id }
          )

          if response[:status] == true
            donation.transaction_reference = response[:data][:reference]
            if donation.save
              total_donors = campaign.total_donors
              render json: {
                authorization_url: response[:data][:authorization_url],
                donation: donation,
                total_donors: total_donors
              }, status: :created
            else
              render json: { error: 'Donation creation failed: ' + donation.errors.full_messages.join(', ') }, status: :unprocessable_entity
            end
          else
            render json: { error: 'Payment initialization failed: ' + response[:message] }, status: :unprocessable_entity
          end
        end

        def verify
          donation = Donation.find_by(transaction_reference: params[:id])
          if donation.nil?
            return render json: { error: 'We could not find the donation. Please check your transaction reference.' }, status: :not_found
          end

          paystack_service = PaystackService.new
          response = paystack_service.verify_transaction(donation.transaction_reference)

          if response[:status] == true && response[:data][:status] == 'success'
            gross_amount = response[:data][:amount] / 100.0
            net_amount = gross_amount * 0.985

            donation.update(
              status: 'successful',
              gross_amount: gross_amount,
              net_amount: net_amount,
              amount: net_amount
            )

            Balance.create(
              amount: gross_amount - net_amount,
              description: "Platform fee for donation #{donation.id}",
              status: "pending"
            )

            campaign = donation.campaign
            total_donations = campaign.donations.where(status: 'successful').order(created_at: :desc).sum(:net_amount)
            campaign.update(current_amount: total_donations)

            render json: {
              message: 'Donation successful',
              donation: donation,
              total_donations: total_donations,
              campaign: campaign
            }, status: :ok
          else
            donation.update(status: 'failed')
            render json: { error: 'Donation verification failed. Please try again later.' }, status: :unprocessable_entity
          end
        end

        private

        def donation_params
          params.require(:donation).permit(:amount, :transaction_reference, :email, :full_name, :phone, metadata: {})
        end
      end
    end
  end
end