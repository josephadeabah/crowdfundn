module Api
  module V1
    module Fundraisers
      class CampaignsController < ApplicationController
        before_action :authenticate_request, only: %i[create update destroy my_campaigns statistics]  # Ensure user is authenticated
        before_action :set_campaign, only: %i[show update destroy webhook_status_update]
        before_action :authorize_campaign_user!, only: %i[update destroy]  # Ensure user authorization for these actions

        def index
          page = params[:page] || 1
          page_size = params[:pageSize] || 12
          
          sort_by = params[:sortBy] || 'created_at'
          sort_order = params[:sortOrder] || 'desc'

          # Ensure sorting is safe
          valid_sort_columns = %w[created_at goal_amount location]
          sort_by = valid_sort_columns.include?(sort_by) ? sort_by : 'created_at'

          @campaigns = Campaign.active
                               .order(sort_by => sort_order)
                               .page(page)
                               .per(page_size)
        
          campaigns_data = @campaigns.map do |campaign|
            campaign.as_json(include: %i[rewards updates comments fundraiser: :profile])
                   .merge(media: campaign.media_url, total_donors: campaign.total_donors)
          end
        
          render json: {
            campaigns: campaigns_data,
            current_page: @campaigns.current_page,
            total_pages: @campaigns.total_pages,
            total_count: @campaigns.total_count
          }, status: :ok
        end

        def show
          # Include total_donors for the single campaign
          render json: @campaign.as_json(include: %i[rewards updates comments fundraiser: :profile])
                                .merge(media: @campaign.media_url, total_donors: @campaign.total_donors),
                 status: :ok
        end

        def my_campaigns
          page = params[:page] || 1
          page_size = params[:pageSize] || 12
          
          # Retrieve user's campaigns with pagination and order by most recent
          @campaigns = @current_user.campaigns.order(created_at: :desc).page(page).per(page_size)
          
          # Include total_donors for each campaign
          campaigns_data = @campaigns.map do |campaign|
            campaign.as_json(include: %i[rewards updates comments fundraiser: :profile])
                   .merge(media: campaign.media_url, total_donors: campaign.total_donors)
          end

          render json: {
            campaigns: campaigns_data,
            current_page: @campaigns.current_page,
            total_pages: @campaigns.total_pages,
            total_count: @campaigns.total_count
          }, status: :ok
        end

        def group_by_category
          page = params[:page] || 1
          page_size = params[:page_size] || 12
        
          # Group only active campaigns by category
          grouped_campaigns = Campaign.active.order(created_at: :desc).group_by do |campaign|
            campaign.category.downcase.gsub(/\s+/, '-')
          end
        
          grouped_paginated_campaigns = grouped_campaigns.transform_values do |campaigns|
            Kaminari.paginate_array(campaigns).page(page).per(page_size)
          end
        
          response_data = grouped_paginated_campaigns.each_with_object({}) do |(category, campaigns), result|
            result[category] = {
              campaigns: campaigns,
              current_page: campaigns.current_page,
              total_pages: campaigns.total_pages,
              total_count: campaigns.total_count
            }
          end
        
          render json: {
            grouped_campaigns: response_data
          }, status: :ok
        end

        # POST /api/v1/fundraisers/campaigns
        def create
          @campaign = @current_user.campaigns.new(campaign_params)
          if params[:media].present?
            @campaign.media.attach(params[:media])
            set_media_content_disposition(@campaign.media)
          end

          if @campaign.save
            render json: {
              message: 'Campaign created successfully',
              campaign: @campaign.as_json(include: %i[rewards updates comments]).merge(media: @campaign.media_url)
            }, status: :created
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/fundraisers/campaigns/:id
        def update
          if @campaign.update(campaign_params)
            # Update media if a new file is provided
            if params[:media].present?
              @campaign.media.attach(params[:media])
              set_media_content_disposition(@campaign.media)
            end
            render json: @campaign.as_json(include: %i[rewards updates comments]).merge(media: @campaign.media), status: :ok
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @campaign.destroy
          head :no_content
        end

        # GET /api/v1/fundraisers/campaigns/statistics
        def statistics
          stats = CampaignStatisticsService.calculate_for_user(@current_user)
          render json: stats, status: :ok
        end

      # POST /api/v1/fundraisers/campaigns/:id/favorite
      def favorite
        if @current_user.favorites.create(campaign: @campaign)
          render json: { message: 'Campaign favorited successfully' }, status: :ok
        else
          render json: { error: 'Unable to favorite campaign' }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/fundraisers/campaigns/:id/unfavorite
      def unfavorite
        favorite = @current_user.favorites.find_by(campaign: @campaign)
        if favorite&.destroy
          render json: { message: 'Campaign unfavorited successfully' }, status: :ok
        else
          render json: { error: 'Unable to unfavorite campaign' }, status: :unprocessable_entity
        end
      end
        
        # New Webhook Action
        def webhook_status_update
          # Check if this is a self-triggered request
          if request.headers['X-Self-Triggered']
            Rails.logger.info("Ignoring self-triggered webhook for campaign #{request.body.read['campaign_id']}")
            return # Ignore self-triggered webhook
          end
          # Expecting the status and campaign_id in the request
          data = JSON.parse(request.body.read)

          unless data['campaign_id'] && data['status']
            render json: { error: 'Invalid data' }, status: :unprocessable_entity
            return
          end
          # Find the campaign by ID
          @campaign = Campaign.find_by(id: data['campaign_id'])
          
          if @campaign
            # Update the campaign's status
            @campaign.update(status: data['status'])

            # Optionally, call the CampaignWebhookService or any other related services
            # CampaignWebhookService.new(@campaign).send_status_update

            render json: { message: 'Campaign status updated' }, status: :ok
          else
            render json: { error: 'Campaign not found' }, status: :not_found
          end
        end

        private

        def set_media_content_disposition(media)
          s3 = Aws::S3::Resource.new
          object = s3.bucket(Rails.application.credentials.dig(:digitalocean, :bucket)).object(media.key)
          object.copy_from(object.bucket.name + '/' + object.key, {
                             metadata_directive: 'REPLACE',
                             content_disposition: 'inline',
                             acl: 'public-read'
                           })
        end

        def set_campaign
          campaign_id = params[:id] || JSON.parse(request.body.read)['campaign_id']
          @campaign = Campaign.includes(:rewards, :updates, :comments, fundraiser: :profile).find(campaign_id)
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end

        def authorize_campaign_user!
          authorize_user!(@campaign)  # Call the authorization method
        end

        def campaign_params
          params.require(:campaign).permit(
            :title, :description, :goal_amount, :current_amount, :start_date, :end_date,
            :category, :location, :currency, :currency_code, :currency_symbol, :status, :media,
            :accept_donations, :leave_words_of_support, :appear_in_search_results,
            :suggested_fundraiser_lists, :receive_donation_email, :receive_daily_summary,
            :is_public, :enable_promotions, :schedule_promotion, :promotion_frequency,
            :promotion_duration
          )
        end
      end
    end
  end
end
