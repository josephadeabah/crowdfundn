# app/controllers/api/v1/admin/transfer_locks_controller.rb
module Api
  module V1
    module Admin
      class TransferLocksController < ApplicationController
        include ErrorHandler
        before_action :authenticate_request
        before_action :require_admin
        before_action :set_user, except: [:index]

        # GET /api/v1/admin/transfer_locks
        def index
          users = User.includes(:campaigns)
                     .where(transfer_locked: true)
                     .order(transfer_locked_at: :desc)
                     .page(params[:page])
                     .per(params[:per_page] || 20)

          render json: {
            locked_users: users.as_json(include: [:campaigns]),
            pagination: {
              current_page: users.current_page,
              total_pages: users.total_pages,
              total_count: users.total_count
            }
          }
        end

        # POST /api/v1/admin/transfer_locks/:user_id/lock
        def lock
          reason = params[:reason]
          
          if @user.lock_transfers!(@current_user, reason)
            # Log the action
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
              error: "Failed to lock transfers" 
            }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/admin/transfer_locks/:user_id/unlock
        def unlock
          if @user.unlock_transfers!
            # Log the action
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
              error: "Failed to unlock transfers" 
            }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/admin/transfer_locks/:user_id/reset_transfers
        def reset_transfers
          begin
            @user.reset_transferred_amount!
            
            # Log the action
            AdminActionLogger.log(
              user: @current_user,
              action: 'reset_transferred_amount',
              target_user: @user,
              details: { 
                previous_total: @user.total_transferred_amount,
                reset_at: Time.current 
              }
            )

            render json: {
              success: true,
              message: "Transferred amounts reset to zero for user #{@user.full_name}",
              user: @user.as_json(include: [:campaigns])
            }
          rescue => e
            render json: { 
              success: false, 
              error: "Failed to reset transferred amounts: #{e.message}" 
            }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/admin/transfer_locks/:user_id/status
        def status
          render json: {
            user: @user.as_json(include: [:campaigns]),
            transfer_lock_info: @user.transfer_lock_info,
            campaigns: @user.campaigns.as_json(only: [:id, :title, :transferred_amount, :goal_amount])
          }
        end

        private

        def set_user
          @user = User.find(params[:user_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: "User not found" }, status: :not_found
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