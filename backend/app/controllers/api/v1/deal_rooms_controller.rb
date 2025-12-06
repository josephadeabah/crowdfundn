# app/controllers/api/v1/deal_rooms_controller.rb
module Api
  module V1
    class DealRoomsController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room, except: [:index, :public_deals, :stats, :industries, :stages]
      
      # GET /api/v1/deal_rooms
      def index
        @deal_rooms = DealRoom.for_user(@current_user)
                              .includes(campaign: [:fundraiser, :equity_investments])
                              .page(params[:page])
                              .per(params[:per_page] || 20)
        
        render json: {
          deal_rooms: @deal_rooms.map { |dr| deal_room_json(dr) },
          current_page: @deal_rooms.current_page,
          total_pages: @deal_rooms.total_pages,
          total_count: @deal_rooms.total_count
        }, status: :ok
      end
      
      # GET /api/v1/deal_rooms/public_deals
      def public_deals
        page = params[:page] || 1
        per_page = params[:per_page] || 12
        
        @campaigns = EquityCampaign.live
                                  .includes(:fundraiser, :equity_investments, :deal_room)
                                  .where(equity_status: [:approved, :live])
                                  .page(page)
                                  .per(per_page)
        
        render json: {
          deals: @campaigns.map { |c| campaign_deal_json(c) },
          current_page: @campaigns.current_page,
          total_pages: @campaigns.total_pages,
          total_count: @campaigns.total_count
        }, status: :ok
      end
      
      # GET /api/v1/deal_rooms/stats
      def stats
        total_deals = EquityCampaign.live.count
        active_deals = EquityCampaign.live.where(equity_status: :live).count
        total_raised = EquityCampaign.live.sum(:current_amount)
        avg_deal_size = EquityCampaign.live.average(:goal_amount).to_i
        investor_count = EquityInvestment.successful.distinct.count(:user_id)
        
        render json: {
          totalDeals: total_deals,
          activeDeals: active_deals,
          totalRaised: total_raised,
          avgDealSize: avg_deal_size,
          investorCount: investor_count,
          successRate: calculate_success_rate
        }, status: :ok
      end
      
      # GET /api/v1/deal_rooms/industries
      def industries
        industries = Campaign.active.pluck(:category).uniq.compact.sort
        render json: {
          industries: ['All Industries'] + industries
        }, status: :ok
      end
      
      # GET /api/v1/deal_rooms/stages
      def stages
        stages = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth']
        render json: {
          stages: stages
        }, status: :ok
      end
      
      # GET /api/v1/deal_rooms/:id
      def show
        render json: deal_room_json(@deal_room), status: :ok
      end
      
      # GET /api/v1/deal_rooms/:id/documents
      def documents
        @documents = @deal_room.deal_room_documents
                              .includes(:user)
                              .order(created_at: :desc)
        
        render json: {
          documents: @documents.map(&:as_json)
        }, status: :ok
      end
      
      # POST /api/v1/deal_rooms/:id/documents
      def upload_document
        @document = @deal_room.deal_room_documents.new(
          user: @current_user,
          title: params[:title],
          document_type: params[:document_type],
          description: params[:description]
        )
        
        if params[:file].present?
          @document.file.attach(params[:file])
        end
        
        if @document.save
          render json: {
            message: 'Document uploaded successfully',
            document: @document.as_json
          }, status: :created
        else
          render json: {
            errors: @document.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      # GET /api/v1/deal_rooms/:id/conversations
      def conversations
        @conversations = @deal_room.deal_room_conversations
                                  .for_user(@current_user)
                                  .includes(:user, :deal_room_messages)
                                  .order(created_at: :desc)
        
        render json: {
          conversations: @conversations.map(&:as_json)
        }, status: :ok
      end
      
      # POST /api/v1/deal_rooms/:id/conversations
      def create_conversation
        @conversation = @deal_room.deal_room_conversations.new(
          user: @current_user,
          title: params[:title],
          private: params[:private] || false
        )
        
        if @conversation.save
          render json: {
            message: 'Conversation created successfully',
            conversation: @conversation.as_json
          }, status: :created
        else
          render json: {
            errors: @conversation.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      # GET /api/v1/deal_rooms/:id/meetings
      def meetings
        @meetings = @deal_room.deal_room_meetings
                             .includes(:organizer, :participants)
                             .order(start_time: :asc)
        
        render json: {
          meetings: @meetings.map(&:as_json)
        }, status: :ok
      end
      
      # POST /api/v1/deal_rooms/:id/meetings
      def create_meeting
        @meeting = @deal_room.deal_room_meetings.new(
          organizer: @current_user,
          title: params[:title],
          description: params[:description],
          meeting_type: params[:meeting_type] || 'qna',
          start_time: params[:start_time],
          end_time: params[:end_time],
          meeting_link: params[:meeting_link],
          notes: params[:notes]
        )
        
        if @meeting.save
          # Add participants if specified
          if params[:participant_ids].present?
            params[:participant_ids].each do |user_id|
              user = User.find_by(id: user_id)
              @meeting.add_participant(user) if user
            end
          end
          
          render json: {
            message: 'Meeting scheduled successfully',
            meeting: @meeting.as_json
          }, status: :created
        else
          render json: {
            errors: @meeting.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      # POST /api/v1/deal_rooms/:id/join
      def join
        if @deal_room.public? || @current_user.admin?
          membership = @deal_room.deal_room_memberships.find_or_initialize_by(user: @current_user)
          membership.status = :active
          membership.role = :member
          
          if membership.save
            render json: {
              message: "Successfully joined #{@deal_room.name}",
              membership: membership.as_json
            }, status: :ok
          else
            render json: { errors: membership.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'This deal room is private' }, status: :forbidden
        end
      end
      
      # POST /api/v1/deal_rooms/:id/show_interest
      def show_interest
        subscription = @deal_room.campaign.subscriptions.find_or_create_by(
          user: @current_user,
          status: 'interested'
        )
        
        Notification.create!(
          user: @deal_room.campaign.fundraiser,
          title: "New interest in #{@deal_room.campaign.company_name}",
          body: "#{@current_user.full_name} has shown interest in your deal",
          notification_type: 'deal_interest',
          data: {
            deal_room_id: @deal_room.id,
            campaign_id: @deal_room.campaign.id,
            user_id: @current_user.id
          }
        )
        
        render json: {
          message: "Interest noted for #{@deal_room.campaign.company_name}",
          interested: true
        }, status: :ok
      end
      
      private
      
      def set_deal_room
        @deal_room = DealRoom.find(params[:id])
        
        unless @deal_room.public? || @deal_room.members.include?(@current_user) || @current_user.admin?
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      def deal_room_json(deal_room)
        campaign = deal_room.campaign
        
        {
          id: deal_room.id,
          name: deal_room.name,
          description: deal_room.description,
          room_type: deal_room.room_type,
          status: deal_room.status,
          campaign: campaign_deal_json(campaign),
          member_count: deal_room.member_count,
          is_member: deal_room.members.include?(@current_user),
          can_join: deal_room.public? && !deal_room.members.include?(@current_user),
          created_at: deal_room.created_at,
          updated_at: deal_room.updated_at
        }
      end
      
      def campaign_deal_json(campaign)
        return nil unless campaign.is_a?(EquityCampaign)
        
        {
          id: campaign.id,
          companyName: campaign.company_name,
          logo: campaign.company_name[0..1].upcase,
          tagline: campaign.description&.to_plain_text&.truncate(100),
          industry: campaign.category,
          stage: campaign.funding_round_display || 'Seed',
          targetRaise: campaign.goal_amount,
          currentRaise: campaign.current_amount,
          minInvestment: campaign.minimum_investment,
          valuation: campaign.valuation,
          investors: campaign.total_investors,
          daysLeft: [campaign.remaining_days, 0].max,
          founderName: campaign.fundraiser.full_name,
          founderImage: campaign.fundraiser.full_name[0..1].upcase,
          founderTitle: 'Founder & CEO',
          highlights: [
            "Valuation: $#{campaign.valuation.to_i.to_s(:delimited)}",
            "Equity offered: #{campaign.equity_offered}%",
            "Minimum investment: $#{campaign.minimum_investment.to_i.to_s(:delimited)}"
          ],
          description: campaign.description&.to_plain_text,
          metrics: {
            revenue: campaign.current_amount,
            growth: campaign.percentage_raised.to_i
          },
          documents: campaign.investor_documents.map do |doc|
            {
              name: doc.display_name,
              type: doc.document_type
            }
          end,
          interested: campaign.subscriptions.count,
          meetings: campaign.deal_room&.deal_room_meetings&.count || 0,
          status: campaign_status_for_deal_room(campaign)
        }
      end
      
      def campaign_status_for_deal_room(campaign)
        if campaign.equity_status == 'funded'
          'Funded'
        elsif campaign.remaining_days <= 7 && campaign.remaining_days > 0
          'Closing Soon'
        elsif campaign.created_at > 7.days.ago
          'New'
        else
          'Active'
        end
      end
      
      def calculate_success_rate
        total_campaigns = EquityCampaign.count
        successful_campaigns = EquityCampaign.where(equity_status: [:funded, :closed]).count
        
        return 0 if total_campaigns.zero?
        
        ((successful_campaigns.to_f / total_campaigns.to_f) * 100).round(0)
      end
    end
  end
end