# app/controllers/api/v1/equity/equity_campaigns_controller.rb
module Api
  module V1
    module Equity
      class CampaignsController < ApplicationController
        before_action :authenticate_request, only: %i[index create update destroy launch close my_campaigns]
        before_action :set_campaign, only: %i[show update destroy launch close]
        before_action :authorize_campaign_user!, only: %i[update destroy launch close]

        def index
          page = params[:page] || 1
          page_size = params[:pageSize] || 20
          sort_by = params[:sortBy] || 'created_at'
          sort_order = params[:sortOrder] || 'desc'

          valid_sort_columns = %w[created_at title valuation location]
          sort_by = 'created_at' unless valid_sort_columns.include?(sort_by)

          @campaigns = EquityCampaign.live

          # Apply filters
          if params[:dateRange] && params[:dateRange] != 'all_time'
            start_date = calculate_date_range(params[:dateRange])
            @campaigns = @campaigns.where('created_at >= ?', start_date) if start_date
          end

          if params[:valuationRange] && params[:valuationRange] != 'all'
            min_val, max_val = params[:valuationRange].split('-').map(&:to_i)
            @campaigns = @campaigns.where(valuation: min_val..max_val)
          end

          @campaigns = @campaigns.where(location: params[:location]) if params[:location] && params[:location] != 'all'
          @campaigns = @campaigns.where('lower(title) LIKE ?', "%#{params[:title].downcase}%") if params[:title].present?

          # Sorting and pagination
          @campaigns = @campaigns.order(sort_by => sort_order).page(page).per(page_size)

          render json: {
            campaigns: @campaigns.map { |c| campaign_json(c) },
            current_page: @campaigns.current_page,
            total_pages: @campaigns.total_pages,
            total_count: @campaigns.total_count
          }, status: :ok
        end

        # app/controllers/api/v1/equity/equity_campaigns_controller.rb
        def show
          render json: {
            campaign: @campaign.as_json(include: [
              :rewards, 
              :updates, 
              :comments,
              { fundraiser: { include: :profile } },
              { campaign_team_members: { include: { user: { include: :profile } } }}
            ]),
            shares_available: @campaign.shares_available,
            percentage_raised: @campaign.percentage_raised
          }
        end

        def my_campaigns
          @campaigns = @current_user.campaigns.order(created_at: :desc)
                                    .page(params[:page]).per(params[:pageSize] || 12)

          render json: {
            campaigns: @campaigns.map { |c| campaign_json(c) },
            current_page: @campaigns.current_page,
            total_pages: @campaigns.total_pages,
            total_count: @campaigns.total_count
          }, status: :ok
        end

        def create
          @campaign = @current_user.campaigns.new(campaign_params)
          @campaign.media.attach(params[:media]) if params[:media].present?

          if @campaign.save
            render json: {
              message: 'Equity campaign created successfully',
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

        def launch
          if @campaign.may_launch? && @campaign.launch!
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { error: "Cannot launch campaign" }, status: :unprocessable_entity
          end
        end

        def close
          if @campaign.may_close? && @campaign.close!
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { error: "Cannot close campaign" }, status: :unprocessable_entity
          end
        end

        private

        def set_campaign
          @campaign = EquityCampaign.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end

        def authorize_campaign_user!
          render json: { error: 'Unauthorized' }, status: :unauthorized unless @campaign.fundraiser == @current_user
        end

        def campaign_params
          params.require(:equity_campaign).permit(
            :title, :description, :goal_amount, :current_amount, :start_date, :end_date, :category, 
            :location, :currency, :valuation, :equity_offered, :minimum_investment,
            :media
          )
        end

        def campaign_json(campaign)
          campaign.as_json(
            include: [:rewards, :updates, :comments, fundraiser: :profile]
          ).merge(
            media: campaign.media_url,
            shares_available: campaign.shares_available,
            percentage_raised: campaign.percentage_raised,
            total_investors: campaign.equity_investments.count
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
      end
    end
  end
end