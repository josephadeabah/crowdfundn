# app/controllers/api/v1/base_campaigns_controller.rb
module Api
  module V1
    class BaseCampaignsController < ApplicationController
      before_action :authenticate_request, only: %i[index create update destroy my_campaigns statistics favorite unfavorite favorites]
      before_action :set_campaign, only: %i[show update destroy webhook_status_update favorite unfavorite cancel_campaign]
      before_action :authorize_campaign_user!, only: %i[update destroy]

      def index
        page = params[:page] || 1
        page_size = params[:pageSize] || 20
        sort_by = params[:sortBy] || 'created_at'
        sort_order = params[:sortOrder] || 'desc'

        valid_sort_columns = %w[created_at title goal_amount location]
        sort_by = 'created_at' unless valid_sort_columns.include?(sort_by)

        @campaigns = campaign_scope.active

        if params[:dateRange] && params[:dateRange] != 'all_time'
          start_date = calculate_date_range(params[:dateRange])
          @campaigns = @campaigns.where('created_at >= ?', start_date) if start_date
        end

        if params[:goalRange] && params[:goalRange] != 'all'
          min_goal, max_goal = params[:goalRange].split('-').map(&:to_i)
          @campaigns = @campaigns.where(goal_amount: min_goal..max_goal)
        end

        @campaigns = @campaigns.where(location: params[:location]) if params[:location] && params[:location] != 'all'
        @campaigns = @campaigns.where('lower(title) LIKE ?', "%#{params[:title].downcase}%") if params[:title].present?

        @campaigns = @campaigns.order(sort_by => sort_order).page(page).per(page_size)

        render json: {
          campaigns: @campaigns.map { |c| campaign_json(c) },
          current_page: @campaigns.current_page,
          total_pages: @campaigns.total_pages,
          total_count: @campaigns.total_count
        }, status: :ok
      end

      def show
        render json: campaign_json(@campaign), status: :ok
      end

      def my_campaigns
        @campaigns = @current_user.campaigns.where(type: campaign_type)
                                 .order(created_at: :desc)
                                 .page(params[:page]).per(params[:pageSize] || 12)

        render json: {
          campaigns: @campaigns.map { |c| campaign_json(c) },
          current_page: @campaigns.current_page,
          total_pages: @campaigns.total_pages,
          total_count: @campaigns.total_count
        }, status: :ok
      end

      def group_by_category
        page = params[:page] || 1
        page_size = params[:page_size] || 12
        
        grouped_campaigns = campaign_scope.active.order(created_at: :desc).group_by do |campaign|
          campaign.category.downcase.gsub(/\s+/, '-')
        end
        
        grouped_paginated_campaigns = grouped_campaigns.transform_values do |campaigns|
          Kaminari.paginate_array(campaigns).page(page).per(page_size)
        end
        
        response_data = grouped_paginated_campaigns.each_with_object({}) do |(category, campaigns), result|
          result[category] = {
            campaigns: campaigns.map { |c| campaign_json(c) },
            current_page: campaigns.current_page,
            total_pages: campaigns.total_pages,
            total_count: campaigns.total_count
          }
        end
        
        render json: {
          grouped_campaigns: response_data
        }, status: :ok
      end

      def create
        @campaign = campaign_class.new(campaign_params)
        @campaign.fundraiser = @current_user
        @campaign.media.attach(params[:media]) if params[:media].present?

        if @campaign.save
          render json: {
            message: "#{campaign_type} campaign created successfully",
            campaign: campaign_json(@campaign)
          }, status: :created
        else
          render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @campaign.update(campaign_params)
          @campaign.media.attach(params[:media]) if params[:media].present?
          render json: campaign_json(@campaign), status: :ok
        else
          render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @campaign.destroy
        head :no_content
      end

      def statistics
        user = @current_user
        month = params[:month]&.to_i || Time.zone.now.month
        year = params[:year]&.to_i || Time.zone.now.year

        stats = CampaignStatisticsService.calculate_for_user(user, month, year)
        render json: stats, status: :ok
      end

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

      def favorites
        @campaigns = @current_user.favorited_campaigns.includes(:rewards, :updates, :comments, fundraiser: :profile)
        render json: {
          campaigns: @campaigns.map { |c| campaign_json(c) }
        }, status: :ok
      end

      def webhook_status_update
        if request.headers['X-Self-Triggered']
          Rails.logger.info("Ignoring self-triggered webhook for campaign #{request.body.read['campaign_id']}")
          return
        end

        data = JSON.parse(request.body.read)
        unless data['campaign_id'] && data['status']
          render json: { error: 'Invalid data' }, status: :unprocessable_entity
          return
        end

        if @campaign.update(status: data['status'])
          render json: { message: 'Campaign status updated' }, status: :ok
        else
          render json: { error: 'Failed to update campaign status' }, status: :unprocessable_entity
        end
      end

      def cancel_campaign
        if @campaign.cancel
          render json: { message: 'Campaign successfully canceled' }, status: :ok
        else
          render json: { message: 'Failed to cancel the campaign' }, status: :unprocessable_entity
        end
      end

      def contact_fundraiser
        fundraiser_email = @campaign.fundraiser.email
        fundraiser_name = @campaign.fundraiser.full_name
        campaign_name = @campaign.title

        user_name = params[:full_name]
        user_email = params[:email]
        message = params[:message]

        FundraiserContactEmailService.send_contact_email(
          fundraiser_email,
          fundraiser_name,
          campaign_name,
          user_name,
          user_email,
          message
        )

        render json: { message: 'Your message has been sent to the fundraiser.' }, status: :ok
      rescue => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      protected

      def campaign_scope
        campaign_class.all
      end

      def campaign_class
        self.class.name.include?('Equity') ? EquityCampaign : Campaign
      end

      def campaign_type
        campaign_class.name
      end

      def campaign_json(campaign)
        campaign.as_json(
          include: [:rewards, :updates, :comments, fundraiser: :profile]
        ).merge(
          type: campaign.class.name,
          media: campaign.media_url,
          total_donors: campaign.total_donors
        )
      end

      def calculate_date_range(range)
        case range
        when 'today' then Time.zone.now.beginning_of_day
        when 'last_7_days' then 7.days.ago
        when 'last_30_days' then 30.days.ago
        when 'last_60_days' then 60.days.ago
        when 'last_90_days' then 90.days.ago
        when 'this_month' then Time.zone.now.beginning_of_month
        when 'last_month' then 1.month.ago.beginning_of_month
        when 'this_year' then Time.zone.now.beginning_of_year
        when 'last_year' then 1.year.ago.beginning_of_year
        end
      end

      private

      def set_campaign
        campaign_id = params[:id] || JSON.parse(request.body.read)['campaign_id']
        @campaign = campaign_scope.includes(:rewards, :updates, :comments, fundraiser: :profile).find(campaign_id)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Campaign not found' }, status: :not_found
      end

      def authorize_campaign_user!
        render json: { error: 'Unauthorized' }, status: :unauthorized unless @campaign.fundraiser == @current_user
      end

      def set_media_content_disposition(media)
        s3 = Aws::S3::Resource.new
        object = s3.bucket(Rails.application.credentials.dig(:digitalocean, :bucket)).object(media.key)
        object.copy_from(object.bucket.name + '/' + object.key, {
                           metadata_directive: 'REPLACE',
                           content_disposition: 'inline',
                           acl: 'public-read'
                         })
      end
    end
  end
end