# app/controllers/api/v1/equity/campaigns_controller.rb
module Api
  module V1
    module Equity
      class CampaignsController < Api::V1::BaseCampaignsController
        before_action :set_campaign, only: [:submit_for_approval, :approve, :reject, :launch, :close]

        def pending_review
          page = params[:page] || 1
          page_size = params[:pageSize] || 20
          
          @campaigns = EquityCampaign.pending_approval
                          .includes(:fundraiser, :campaign_team_members, investor_documents: [:files_attachments])
                          .order(created_at: :desc)
                          .page(page)
                          .per(page_size)

          render json: {
            campaigns: @campaigns.map { |c| campaign_json(c) },
            current_page: @campaigns.current_page,
            total_pages: @campaigns.total_pages,
            total_count: @campaigns.total_count
          }, status: :ok
        end
        
        def submit_for_approval
          if @campaign.submit_for_approval
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot submit campaign for approval",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def approve
          if @campaign.approve
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot approve campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def reject
          if @campaign.reject
            CampaignRejectionEmailService.send_rejection_email(@campaign, params[:rejection_reason])
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot reject campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        def launch
          if @campaign.may_launch? && @campaign.launch
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot launch campaign",
              errors: @campaign.errors.full_messages,
              requirements: {
                must_be_approved: @campaign.approved?
              }
            }, status: :unprocessable_entity
          end
        end

        def close
          if @campaign.may_close? && @campaign.close
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot close campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def campaign_json(campaign)
          {
            id: campaign.id,
            title: campaign.title,
            slug: campaign.slug,
            description: campaign.description,
            goal_amount: campaign.goal_amount,
            current_amount: campaign.current_amount,
            transferred_amount: campaign.transferred_amount,
            equity_status: campaign.equity_status,
            valuation: campaign.valuation,
            equity_offered: campaign.equity_offered,
            minimum_investment: campaign.minimum_investment,
            shares_available: campaign.shares_available,
            percentage_raised: campaign.percentage_raised,
            total_investors: campaign.equity_investments.count,
            created_at: campaign.created_at,
            updated_at: campaign.updated_at,
            fundraiser: {
              id: campaign.fundraiser.id,
              name: campaign.fundraiser.full_name,
              email: campaign.fundraiser.email
            },
            team_members: campaign.campaign_team_members.map do |member|
              {
                id: member.id,
                name: member.name,
                role: member.role,
                equity_percentage: member.equity_percentage
              }
            end,
            documents: campaign.investor_documents.map do |doc|
              {
                id: doc.id,
                type: doc.document_type,
                display_name: doc.display_name,
                files: doc.files.map do |file|
                  {
                    url: file.url,
                    filename: file.filename,
                    size: file.byte_size,
                    human_size: ActiveSupport::NumberHelper.number_to_human_size(file.byte_size),
                    uploaded_at: file.created_at
                  }
                end
              }
            end
          }
        end

        def set_campaign
          @campaign = EquityCampaign.find(params[:id])
        end
      end
    end
  end
end