module Api
  module V1
    module Admin
      class TransferLocksController < ApplicationController
        include ErrorHandler
        before_action :authenticate_request
        before_action :require_admin
        before_action :set_user, except: [:index, :completed_campaigns]
        before_action :set_campaign, only: [:reset_campaign_transfers]

        # GET /api/v1/admin/transfer_locks
        def index
          users = User.includes(:campaigns)
                     .where(transfer_locked: true)
                     .order(transfer_locked_at: :desc)
                     .page(params[:page])
                     .per(params[:per_page] || 20)

          # Add search functionality for locked users
          if params[:search].present?
            users = users.where(
              "full_name ILIKE :search OR email ILIKE :search", 
              search: "%#{params[:search]}%"
            )
          end

          render json: {
            locked_users: users.as_json(include: [:campaigns]),
            pagination: {
              current_page: users.current_page,
              total_pages: users.total_pages,
              total_count: users.total_count
            }
          }
        end

        # GET /api/v1/admin/transfer_locks/completed_campaigns
        def completed_campaigns
          campaigns = Campaign.includes(:fundraiser)
                            .completed
                            .where('transferred_amount > 0')
                            .order(end_date: :desc)
                            .page(params[:page])
                            .per(params[:per_page] || 20)

          # Add search functionality for fundraiser name or goal_amount
          if params[:search].present?
            # Search by fundraiser name
            campaigns = campaigns.joins(:fundraiser).where(
              "users.full_name ILIKE :search", 
              search: "%#{params[:search]}%"
            )
            
            # Also try to search by goal_amount if search term is numeric
            if params[:search].to_f > 0
              campaigns = campaigns.or(
                Campaign.where("goal_amount >= ?", params[:search].to_f)
              )
            end
          end

          render json: {
            campaigns: campaigns.as_json(include: [:fundraiser]),
            pagination: {
              current_page: campaigns.current_page,
              total_pages: campaigns.total_pages,
              total_count: campaigns.total_count
            }
          }
        end

        # POST /api/v1/admin/transfer_locks/:user_id/lock
        def lock
          reason = params[:reason]
          
          if @user.lock_transfers!(@current_user, reason)
            AdminActionLogger.log(
              user: @current_user,
              action: 'lock_transfers',
              target_user: @user,
              details: { reason: reason }
            )

            render json: {
              success: true,
              message: "Transfers locked for user #{@user.full_name}",
              user: @user.as_json(include: [:campaigns])
            }
          else
            render json: { 
              success: false, 
              error: "Failed to lock transfers for user #{@user.full_name}" 
            }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/admin/transfer_locks/:user_id/unlock
        def unlock
          if @user.unlock_transfers!
            AdminActionLogger.log(
              user: @current_user,
              action: 'unlock_transfers',
              target_user: @user,
              details: {}
            )

            render json: {
              success: true,
              message: "Transfers unlocked for user #{@user.full_name}",
              user: @user.as_json(include: [:campaigns])
            }
          else
            render json: { 
              success: false, 
              error: "Failed to unlock transfers for user #{@user.full_name}" 
            }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/admin/transfer_locks/:user_id/reset_campaign_transfers
        def reset_campaign_transfers
          reason = params[:reason]
          
          begin
            # Use the campaign_id from params
            campaign = Campaign.find(params[:campaign_id])
            
            # Verify the campaign belongs to the user
            unless campaign.fundraiser_id == @user.id
              render json: { 
                success: false, 
                error: "Campaign does not belong to this user" 
              }, status: :unprocessable_entity
              return
            end
            
            campaign.reset_transferred_amount!(@current_user)
            
            AdminActionLogger.log(
              user: @current_user,
              action: 'reset_transferred_amount',
              target_user: @user,
              details: { 
                campaign_id: campaign.id,
                campaign_title: campaign.title,
                amount_reset: campaign.transferred_amount_before_last_save,
                reason: reason
              }
            )

            render json: {
              success: true,
              message: "Transferred amount reset to zero for campaign: #{campaign.title}",
              campaign: campaign.as_json(include: [:fundraiser]),
              user: @user.as_json(include: [:campaigns])
            }
          rescue => e
            render json: { 
              success: false, 
              error: "Failed to reset transferred amount: #{e.message}" 
            }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/admin/transfer_locks/:user_id/status
        def status
          render json: {
            user: @user.as_json(include: [:campaigns]),
            transfer_lock_info: @user.transfer_lock_info,
            campaigns: @user.campaigns.as_json(only: [:id, :title, :transferred_amount, :goal_amount, :status])
          }
        end

        private

        def set_user
          @user = User.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: "User not found" }, status: :not_found
        end

        def set_campaign
          @campaign = @user.campaigns.find(params[:campaign_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: "Campaign not found for this user" }, status: :not_found
        end

        def require_admin
          unless @current_user.admin?
            render json: { error: "Admin access required" }, status: :forbidden
          end
        end
      end
    end
  end
end