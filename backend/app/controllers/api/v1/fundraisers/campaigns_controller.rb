module Api
  module V1
    module Fundraisers
      class CampaignsController < ApplicationController
        before_action :authenticate_request, only: %i[index create update destroy my_campaigns statistics favorite unfavorite favorites] # Ensure user is authenticated
        before_action :set_campaign, only: %i[show update destroy webhook_status_update favorite unfavorite]
        before_action :authorize_campaign_user!, only: %i[update destroy create update destroy my_campaigns statistics favorite unfavorite favorites] # Ensure user authorization for these actions

        def index
          page = params[:page] || 1
          page_size = params[:pageSize] || 20

          sort_by = params[:sortBy] || 'created_at'
          sort_order = params[:sortOrder] || 'desc'

          # Ensure sorting is safe
          valid_sort_columns = %w[created_at title goal_amount location]
          sort_by = 'created_at' unless valid_sort_columns.include?(sort_by)

          # Initialize campaigns collection
          @campaigns = Campaign.active

          # Filters
          if params[:dateRange] && params[:dateRange] != 'all_time'
            start_date = case params[:dateRange]
                         when 'today'
                           Time.zone.now.beginning_of_day # Start of the current day
                         when 'last_7_days'
                           7.days.ago
                         when 'last_30_days'
                           30.days.ago
                         when 'last_60_days'
                           60.days.ago
                         when 'last_90_days'
                           90.days.ago
                         when 'this_month'
                           Time.zone.now.beginning_of_month # Start of the current month
                         when 'last_month'
                           1.month.ago.beginning_of_month # Start of the last month
                         when 'this_year'
                           Time.zone.now.beginning_of_year # Start of the current year
                         when 'last_year'
                           1.year.ago.beginning_of_year # Start of the previous year
                         else
                           # If no valid date range is provided, you can decide to handle it as an error or fallback
                           nil
                         end
            # Only apply the filter if start_date is defined
            @campaigns = @campaigns.where('created_at >= ?', start_date) if start_date
          end

          if params[:goalRange] && params[:goalRange] != 'all'
            min_goal, max_goal = params[:goalRange].split('-').map(&:to_i)
            @campaigns = @campaigns.where(goal_amount: min_goal..max_goal)
          end

          @campaigns = @campaigns.where(location: params[:location]) if params[:location] && params[:location] != 'all'

          if params[:title].present?
            @campaigns = @campaigns.where('lower(title) LIKE ?', "%#{params[:title].downcase}%")
          end

          # Sorting and pagination
          @campaigns = @campaigns.order(sort_by => sort_order).page(page).per(page_size)

          # Prepare campaigns data
          campaigns_data = @campaigns.map do |campaign|
            campaign.as_json(user: @current_user, include: %i[rewards updates comments fundraiser: profile])
                    .merge(media: campaign.media_url, total_donors: campaign.total_donors)
          end

          # Render response
          render json: {
            campaigns: campaigns_data,
            current_page: @campaigns.current_page,
            total_pages: @campaigns.total_pages,
            total_count: @campaigns.total_count
          }, status: :ok
        end

        def show
          # Include total_donors for the single campaign
          render json: @campaign.as_json(include: %i[rewards updates comments fundraiser: profile])
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
            campaign.as_json(include: %i[rewards updates comments fundraiser: profile])
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
              campaigns: campaigns.map do |campaign|
                # Add total_donors for each campaign
                campaign.as_json(include: %i[rewards updates comments fundraiser: profile])
                        .merge(media: campaign.media_url, total_donors: campaign.total_donors)
              end,
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
          # Find the campaign by ID
          @campaign = Campaign.find(params[:id])

          if @campaign.update(campaign_params)
            # Update media if a new file is provided
            if params[:media].present?
              @campaign.media.attach(params[:media])
              set_media_content_disposition(@campaign.media)
            end
            render json: @campaign.as_json(include: %i[rewards updates comments]).merge(media: @campaign.media),
                   status: :ok
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          # Ensure the campaign belongs to the current user
          if @campaign.fundraiser == @current_user
            @campaign.destroy
            head :no_content
          else
            render json: { error: 'You are not authorized to delete this campaign' }, status: :forbidden
          end
        end        

        # GET /api/v1/fundraisers/campaigns/statistics
        def statistics
          user = @current_user
          month = params[:month]&.to_i || Time.zone.now.month
          year = params[:year]&.to_i || Time.zone.now.year

          stats = CampaignStatisticsService.calculate_for_user(user, month, year)
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

        def unfavorite
          favorite = @current_user.favorites.find_by(campaign: @campaign)
          if favorite&.destroy
            render json: { message: 'Campaign unfavorited successfully' }, status: :ok
          else
            render json: { error: 'Unable to unfavorite campaign' }, status: :unprocessable_entity
          end
        end

        # In your CampaignsController
        def favorites
          @campaigns = @current_user.favorited_campaigns.includes(:rewards, :updates, :comments, fundraiser: :profile)
          campaigns_data = @campaigns.map do |campaign|
            campaign.as_json(user: @current_user, include: %i[rewards updates comments fundraiser: profile])
                    .merge(media: campaign.media_url, total_donors: campaign.total_donors)
          end

          render json: {
            campaigns: campaigns_data
          }, status: :ok
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

            render json: { message: 'Campaign status updated' }, status: :ok
          else
            render json: { error: 'Campaign not found' }, status: :not_found
          end
        end

        # PATCH /api/v1/fundraisers/campaigns/:id/cancel
        def cancel_campaign
          campaign = Campaign.find(params[:id])
          if campaign.cancel
            render json: { message: 'Campaign successfully canceled' }, status: :ok
          else
            render json: { message: 'Failed to cancel the campaign' }, status: :unprocessable_entity
          end
        end

         # POST /api/v1/fundraisers/campaigns/:id/contact
         def contact_fundraiser
          campaign = Campaign.find(params[:id])
          fundraiser_email = campaign.fundraiser.email
          fundraiser_name = campaign.fundraiser.full_name
          campaign_name = campaign.title

          # Extract user details from the request
          user_name = params[:full_name]
          user_email = params[:email]
          message = params[:message]

          # Send the email using the FundraiserContactEmailService
          FundraiserContactEmailService.send_contact_email(
            fundraiser_email,
            fundraiser_name,
            campaign_name,
            user_name,
            user_email,
            message
          )

          render json: { message: 'Your message has been sent to the fundraiser.' }, status: :ok
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
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
          authorize_user!(@campaign) # Call the authorization method
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
