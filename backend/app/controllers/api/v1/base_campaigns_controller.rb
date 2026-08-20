module Api
  module V1
    class BaseCampaignsController < ApplicationController
      before_action :authenticate_request,
                    only: %i[create update destroy my_campaigns statistics favorite unfavorite favorites archived_campaigns archive unarchive archive_status]
      
      before_action :set_campaign,
                    only: %i[show update destroy webhook_status_update favorite unfavorite cancel_campaign
                             contact_fundraiser archive unarchive archive_status]
      
      before_action :authorize_campaign_owner_or_admin!, 
                    only: %i[update destroy archive unarchive]

      def archived_campaigns
        archived_campaigns = @current_user.archived_campaigns_with_details
                                        .page(params[:page])
                                        .per(params[:pageSize] || 20)
        
        render json: {
          archived_campaigns: archived_campaigns.map do |archive|
            campaign_json = archive.campaign.as_json(user: @current_user)
            campaign_json.merge(
              archive_details: {
                archived_at: archive.archived_at,
                reason: archive.reason
              }
            )
          end,
          current_page: archived_campaigns.current_page,
          total_pages: archived_campaigns.total_pages,
          total_count: archived_campaigns.total_count
        }, status: :ok
      end

      def index
        page = params[:page] || 1
        page_size = params[:pageSize] || 20
        sort_by = params[:sortBy] || 'created_at'
        sort_order = params[:sortOrder] || 'desc'

        valid_sort_columns = %w[created_at title goal_amount location]
        sort_by = 'created_at' unless valid_sort_columns.include?(sort_by)

        @campaigns = campaign_scope.active

        # Include KYC association for all campaigns
        @campaigns = @campaigns.includes(fundraiser: :latest_kyc)

        # Allow filtering by equity_status if provided
        if params[:equity_status].present? && campaign_class == EquityCampaign
          @campaigns = @campaigns.where(equity_status: params[:equity_status])
        else
          # Default filter for equity campaigns
          if campaign_class == EquityCampaign
            @campaigns = @campaigns.where(equity_status: [:approved, :live])
          end
        end

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
        @campaigns = @current_user.campaigns
                                  .includes(fundraiser: [:profile, :latest_kyc, :archived_campaigns])
                                  .order(created_at: :desc)
                                  .page(params[:page])
                                  .per(params[:pageSize] || 12)

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
              campaign_json(campaign)
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

      def create
        @campaign = campaign_class.new(campaign_params)
        @campaign.fundraiser = @current_user
        @campaign.media.attach(params[:media]) if params[:media].present?

        # Ensure slug is generated from title if not provided
        @campaign.slug ||= @campaign.title.parameterize if @campaign.title.present?
        # Explicitly set type from params if present
        @campaign.type = campaign_params[:type] if campaign_params[:type]

        # Set defaults for equity campaigns
        if @campaign.is_a?(EquityCampaign)
          @campaign.equity_status ||= :draft
          @campaign.valuation ||= 0
          @campaign.equity_offered ||= 0
          @campaign.minimum_investment ||= 0
          @campaign.maximum_investment ||= 0
        end

        if @campaign.save
          render json: {
            message: "#{@campaign.class.name} campaign created successfully",
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
        # Ensure the campaign belongs to the current user OR user is admin
        if @campaign.fundraiser == @current_user || @current_user.admin?
          ActiveRecord::Base.transaction do
            if @campaign.is_a?(EquityCampaign)
              # Handle equity investments first
              @campaign.equity_investments.find_each do |investment|
                investment.points.update_all(equity_investment_id: nil) # Clear the association
                investment.destroy!
              end
            end
            @campaign.destroy!
          end
          head :no_content
        else
          render json: { error: 'You are not authorized to delete this campaign' }, status: :forbidden
        end
      rescue ActiveRecord::RecordNotDestroyed => e
        render json: { error: "Failed to delete campaign: #{e.message}" }, status: :unprocessable_entity
      end

      # Archive functionality
      def archive
        reason = params[:reason]

        if @campaign.archive!(@current_user, reason)
          render json: {
            message: 'Campaign archived successfully',
            campaign: campaign_json(@campaign)
          }, status: :ok
        else
          render json: {
            error: 'Failed to archive campaign'
          }, status: :unprocessable_entity
        end
      end

      def unarchive
        if @campaign.unarchive!(@current_user)
          render json: {
            message: 'Campaign unarchived successfully',
            campaign: campaign_json(@campaign)
          }, status: :ok
        else
          render json: {
            error: 'Failed to unarchive campaign'
          }, status: :unprocessable_entity
        end
      end

      def archive_status
        archive_info = @campaign.archive_info_for_user(@current_user)
        
        render json: {
          archived: @campaign.archived_by_user?(@current_user),
          archive_info: archive_info ? {
            archived_at: archive_info.archived_at,
            reason: archive_info.reason
          } : nil
        }, status: :ok
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
        @campaigns = @current_user.favorited_campaigns
                                  .includes(:rewards, :updates, :comments, fundraiser: [:profile, :latest_kyc])
                                  .page(params[:page])
                                  .per(params[:pageSize] || 20)

        render json: {
          campaigns: @campaigns.map { |c| campaign_json(c) },
          current_page: @campaigns.current_page,
          total_pages: @campaigns.total_pages,
          total_count: @campaigns.total_count
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
        # Ensure campaign and fundraiser exist
        unless @campaign&.fundraiser
          return render json: { error: 'Fundraiser not found for this campaign' }, status: :not_found
        end

        # Validate required parameters
        required_params = %i[full_name email message]
        missing_params = required_params.select { |p| params[p].blank? }
        if missing_params.any?
          return render json: { error: "Missing required fields: #{missing_params.join(', ')}" },
                        status: :unprocessable_entity
        end

        # Validate email format
        unless /\A[^@\s]+@[^@\s]+\z/.match?(params[:email])
          return render json: { error: 'Invalid email format' }, status: :unprocessable_entity
        end

        # Send email
        FundraiserContactEmailService.send_contact_email(
          @campaign.fundraiser.email,
          @campaign.fundraiser.full_name,
          @campaign.title,
          params[:full_name],
          params[:email],
          params[:message]
        )

        render json: { message: 'Your message has been sent to the fundraiser.' }, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      protected

      def campaign_scope
        campaign_class.includes(
          :rewards,
          :updates,
          :comments,
          :investor_documents,
          :archived_campaigns,
          fundraiser: [:profile, :latest_kyc]
        )
      end

      def campaign_class
        self.class.name.include?('Equity') ? EquityCampaign : Campaign
      end

      def campaign_type
        campaign_class.name
      end

      def campaign_json(campaign)
        # Get KYC status for the fundraiser
        kyc_status = if campaign.fundraiser.latest_kyc
                      {
                        verified: campaign.fundraiser.latest_kyc.verified?,
                        status: campaign.fundraiser.latest_kyc.status,
                        kyc_type: campaign.fundraiser.latest_kyc.kyc_type,
                        verified_at: campaign.fundraiser.latest_kyc.verified_at,
                        is_expired: campaign.fundraiser.latest_kyc.expired?,
                        investor_verified: campaign.fundraiser.investor_kyc_verified?,
                        issuer_verified: campaign.fundraiser.issuer_kyc_verified?,
                        both_verified: campaign.fundraiser.verified_both?
                      }
                    else
                      {
                        verified: false,
                        status: 'none',
                        kyc_type: nil,
                        verified_at: nil,
                        is_expired: false,
                        investor_verified: false,
                        issuer_verified: false,
                        both_verified: false
                      }
                    end

        json = campaign.as_json(
          only: %i[
            id title slug goal_amount current_amount transferred_amount start_date end_date
            category location currency currency_code currency_symbol status
            fundraiser_id created_at updated_at valuation equity_offered minimum_investment maximum_investment 
            total_shares is_public appear_in_search_results
          ],
          methods: %i[media_url media_filename total_days remaining_days archived?],
          include: {
            rewards: {},
            updates: {},
            comments: {},
            fundraiser: { include: :profile },
            investor_documents: {
              only: [:id, :document_type, :display_name, :created_at, :updated_at],
              include: {
                files_attachments: {
                  only: [:filename, :content_type, :byte_size, :created_at],
                  methods: [:url]
                }
              }
            }
          }
        ).merge(
          type: campaign.class.name,
          media: campaign.media_url,
          total_donors: campaign.total_donors,
          company_info: {
            name: campaign.company_name,
            description: campaign.company_description,
            headquarters: campaign.company_headquarters,
            website: campaign.company_website,
            contract_term: campaign.contract_term
          },
          favorited: @current_user ? @current_user.favorited_campaigns.include?(campaign) : false,
          # Add KYC verification status
          fundraiser_kyc_verified: kyc_status[:verified],
          fundraiser_kyc_status: kyc_status[:status],
          fundraiser_kyc_type: kyc_status[:kyc_type],
          fundraiser_kyc_expired: kyc_status[:is_expired],
          # Add archive information for current user
          archived_by_current_user: @current_user ? campaign.archived_by_user?(@current_user) : false,
          archive_info: @current_user ? (archive_info = campaign.archive_info_for_user(@current_user)) && {
            archived_at: archive_info.archived_at,
            reason: archive_info.reason
          } : nil
        )
        
        # Filter to only include contract documents
        if json[:investor_documents]
          json[:investor_documents] = json[:investor_documents].select do |doc|
            doc[:document_type] == 'contract'
          end
        end

        # Update fundraiser info to include KYC status
        if json[:fundraiser]
          json[:fundraiser].merge!(
            kyc_verified: kyc_status[:verified],
            kyc_status: kyc_status[:status],
            kyc_type: kyc_status[:kyc_type],
            kyc_verified_at: kyc_status[:verified_at],
            kyc_expired: kyc_status[:is_expired],
            investor_kyc_verified: kyc_status[:investor_verified],
            issuer_kyc_verified: kyc_status[:issuer_verified],
            both_kyc_verified: kyc_status[:both_verified]
          )
        end

        if campaign.is_a?(EquityCampaign)
          # Add the new equity offering details
          equity_offering_details = {
            minimum_target: campaign.minimum_target,
            price_per_share: campaign.price_per_share,
            min_shares: campaign.min_shares,
            max_shares: campaign.max_shares,
            shares_offered: campaign.shares_offered,
            stock_type: campaign.stock_type,
            stock_type_display: campaign.stock_type_display,
            funding_round: campaign.funding_round,
            funding_round_display: campaign.funding_round_display,
            sec_filing_url: campaign.sec_filing_url,
            offering_circular_url: campaign.offering_circular_url,
            offering_memorandum: campaign.offering_memorandum,
            offering_documents: {
              sec_filing: {
                present: campaign.sec_filing_url.present?,
                url: campaign.sec_filing_url
              },
              offering_circular: {
                present: campaign.offering_circular_url.present?,
                url: campaign.offering_circular_url
              },
              offering_memorandum_document: { 
                attached: campaign.offering_memorandum_document.attached?,
                url: campaign.offering_memorandum_document_url, 
                filename: campaign.offering_memorandum_document.attached? ? campaign.offering_memorandum_document.filename.to_s : nil 
              }
            }
          }

          json.merge!(
            shares_available: campaign.shares_available,
            percentage_raised: campaign.percentage_raised,
            total_investors: campaign.total_investors,
            total_equity_shares: campaign.total_shares,
            equity_status: campaign.equity_status,
            investment_range: {
              minimum: campaign.minimum_investment,
              maximum: campaign.maximum_investment
            },
            can_submit_for_approval: campaign.may_submit_for_approval?,
            can_approve: campaign.may_approve?,
            can_reject: campaign.may_reject?,
            can_launch: campaign.may_launch?,
            equity_offering_details: equity_offering_details
          )
        end
        
        json
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
        campaign_id = params[:id] || params[:campaign_id] || JSON.parse(request.body.read)['campaign_id']
        @campaign = if campaign_id.to_s.match?(/\A\d+\z/) # Convert to string before matching
                      campaign_scope.find(campaign_id)
                    else
                      campaign_scope.find_by!(slug: campaign_id)
                    end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Campaign not found' }, status: :not_found
      rescue JSON::ParserError
        render json: { error: 'Invalid JSON payload' }, status: :bad_request
      end

      def authorize_campaign_owner_or_admin!
        unless @campaign.fundraiser == @current_user || @current_user.admin?
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
    end
  end
end