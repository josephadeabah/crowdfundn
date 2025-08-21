# app/controllers/api/v1/kyc/kycs_controller.rb
module Api
  module V1
    module Kyc
      class KycsController < ApplicationController
        include Authenticable
        before_action :authenticate_request
        before_action :set_kyc, only: [:show, :update, :destroy, :submit, :documents, :verify, :reject, :request_info]

        def index
          authorize Kyc
          @kycs = policy_scope(Kyc).order(created_at: :desc)
          render json: { kycs: @kycs.map(&:to_frontend_format) }
        end

        def show
          authorize @kyc
          render json: { kyc: @kyc.to_frontend_format }
        end

        def create
          authorize Kyc
          @kyc = current_user.kycs.build(kyc_params)
          
          if @kyc.save
            render json: { kyc: @kyc.to_frontend_format }, status: :created
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          authorize @kyc
          
          if @kyc.update(kyc_params)
            render json: { kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          authorize @kyc
          @kyc.destroy
          head :no_content
        end

        def submit
          authorize @kyc
          
          if @kyc.update(status: 'in_review')
            render json: { message: 'KYC submitted for review', kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def documents
          authorize @kyc
          @documents = @kyc.kyc_documents
          render json: { documents: @documents.map(&:to_frontend_format) }
        end

        def all_needs_review
          authorize Kyc, :admin_review?
          @kycs = Kyc.needs_review.order(created_at: :desc)
          render json: { kycs: @kycs.map(&:to_frontend_format) }
        end

        def show_documents
          authorize @kyc
          render json: { 
            kyc: @kyc.to_frontend_format,
            documents: @kyc.kyc_documents.map(&:to_frontend_format)
          }
        end

        def verify
          authorize @kyc, :admin_verify?
          if @kyc.verify!(current_user, params[:review_notes])
            render json: { message: 'KYC verified successfully', kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def reject
          authorize @kyc, :admin_reject?
          if @kyc.reject!(params[:rejection_reason])
            render json: { message: 'KYC rejected', kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def request_info
          authorize @kyc, :admin_review?
          # Implement info request logic
          render json: { message: 'Information requested from user' }
        end

        private

        def set_kyc
          @kyc = Kyc.find(params[:id])
        end

        def kyc_params
          params.require(:kyc).permit(
            :kyc_type, :verification_type, :id_number, :id_expiry_date,
            :date_of_birth, :nationality, :occupation, :source_of_funds,
            :business_name, :business_registration_number, :business_tax_id,
            :business_industry, :business_established_date,
            :signature_data, :investor_signature_data, :issuer_accepted_terms,
            addresses_attributes: [:id, :address_type, :street, :city, :state, :postal_code, :country, :is_primary, :_destroy],
            kyc_documents_attributes: [:id, :document_type, :file, :file_name, :_destroy]
          )
        end
      end
    end
  end
end