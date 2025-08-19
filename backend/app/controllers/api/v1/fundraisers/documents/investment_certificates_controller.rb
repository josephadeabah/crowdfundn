# app/controllers/api/v1/fundraisers/documents/investment_certificates_controller.rb
module Api
  module V1
    module Fundraisers
      module Documents
        class InvestmentCertificatesController < ApplicationController
          before_action :authenticate_request
          before_action :set_investment, only: [:generate, :download, :status]

          # GET /api/v1/fundraisers/documents/investment_certificates/:investment_id/status
          def status
            render json: {
              exists: @investment.certificate_present?,
              url: @investment.certificate_url,
              certificate_number: @investment.certificate_number
            }
          end

          # POST /api/v1/fundraisers/documents/investment_certificates/:investment_id/generate
          def generate
            # Only allow certificate generation for successful investments
            unless @investment.successful?
              render json: { 
                success: false, 
                error: 'Certificate can only be generated for successful investments' 
              }, status: :unprocessable_entity
              return
            end

            # Check if certificate already exists
            if @investment.certificate_present?
              render json: { 
                success: true, 
                message: 'Certificate already exists',
                certificate_url: certificate_download_url
              }, status: :ok
              return
            end

            # Generate certificate
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

          # GET /api/v1/fundraisers/documents/investment_certificates/:investment_id/download
          def download
            unless @investment.certificate_present?
              render json: { 
                success: false, 
                error: 'Certificate not found' 
              }, status: :not_found
              return
            end

            send_data @investment.certificate.download,
                      filename: "investment_certificate_#{@investment.certificate_number}.pdf",
                      type: 'application/pdf',
                      disposition: 'attachment'
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
            api_v1_fundraisers_documents_investment_certificate_download_url(
              investment_id: @investment.id,
              host: Rails.application.config.action_mailer.default_url_options[:host]
            )
          end
        end
      end
    end
  end
end