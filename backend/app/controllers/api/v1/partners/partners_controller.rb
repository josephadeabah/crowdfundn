# app/controllers/api/v1/partners_controller.rb
module Api
  module V1
    module Partners
     class PartnersController < ApplicationController
      before_action :authenticate_request

      def index
        partners = Partner.verified
                         .where(niche: params[:niche])
                         .order(success_rate: :desc)
                         .page(params[:page])
                         .per(params[:per_page] || 10)

        render json: {
          partners: partners.as_json(only: [:id, :company_name, :description, :website, :niche, :audience_size, :success_rate, :slug]),
          pagination: {
            current_page: partners.current_page,
            total_pages: partners.total_pages,
            per_page: partners.limit_value,
            total_count: partners.total_count
          }
        }
      end

      def create_application
        application = current_user.partner_applications.build(application_params)
        
        if application.save
          render json: { message: 'Application submitted successfully' }, status: :created
        else
          render json: { errors: application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def request_partnership
        campaign = Campaign.find(params[:campaign_id])
        partner = Partner.find(params[:partner_id])

        partnership = campaign.campaign_partnerships.build(
          partner: partner,
          commission_rate: params[:commission_rate],
          status: 'pending'
        )

        if partnership.save
          render json: { message: 'Partnership request sent' }, status: :created
        else
          render json: { errors: partnership.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def dashboard
        partner = current_user.partner
        return render json: { error: 'Not a partner' }, status: :forbidden unless partner

        partnerships = partner.campaign_partnerships
                             .includes(:campaign)
                             .order(created_at: :desc)
                             .page(params[:page])
                             .per(params[:per_page] || 10)

        render json: {
          partner: partner.as_json(only: [:company_name, :description, :website, :niche, :audience_size, :success_rate]),
          partnerships: partnerships.as_json(include: { campaign: { only: [:id, :title, :status] } }),
          total_earnings: partner.campaign_partnerships.sum(:commission_amount),
          pagination: {
            current_page: partnerships.current_page,
            total_pages: partnerships.total_pages,
            per_page: partnerships.limit_value,
            total_count: partnerships.total_count
          }
        }
      end

      private

       def application_params
         params.require(:application).permit(:audience_description, :previous_collaborations, :social_media_urls)
       end
     end
    end
  end
end
