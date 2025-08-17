module Api
  module V1
    module Fundraisers
      module Documents
        class InvestmentCertificatesController < ApplicationController
          before_action :authenticate_request
          before_action :set_investment, only: [:generate, :download]

          def generate
            if @investment.certificate.attached?
              render json: { 
                success: true, 
                message: 'Certificate already exists',
                certificate_url: certificate_download_url
              }, status: :ok
              return
            end

            if InvestmentCertificateService.generate_certificate(@investment)
              render json: { 
                success: true, 
                message: 'Certificate generated successfully',
                certificate_url: certificate_download_url
              }, status: :created
            else
              render json: { 
                success: false, 
                error: 'Failed to generate certificate'
              }, status: :unprocessable_entity
            end
          end

          def download
            unless @investment.certificate.attached?
              render json: { 
                success: false, 
                error: 'Certificate not found' 
              }, status: :not_found
              return
            end

            redirect_to rails_blob_url(@investment.certificate, disposition: 'attachment')
          end

          private

          def set_investment
            @investment = current_user.equity_investments.find(params[:investment_id])
          rescue ActiveRecord::RecordNotFound
            render json: { 
              success: false, 
              error: 'Investment not found or not authorized' 
            }, status: :not_found
          end

          def certificate_download_url
            api_v1_fundraisers_documents_investment_certificates_download_url(
              investment_id: @investment.id,
              host: Rails.application.config.action_mailer.default_url_options[:host]
            )
          end
        end
      end
    end
  end
end