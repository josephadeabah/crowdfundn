# app/controllers/api/v1/kyc/kycs_controller.rb
module Api
  module V1
    module Kyc
      class KycsController < ApplicationController
        before_action :authenticate_request
        before_action :set_kyc, only: [:show, :update, :destroy, :submit, :documents, :verify, :reject, :request_info, :upload_document]
        before_action :authorize_user_access, only: [:show, :update, :destroy, :submit, :documents, :upload_document]
        before_action :authorize_admin, only: [:all_needs_review, :verify, :reject, :request_info]

        def index
          @kycs = if @current_user.admin?
            Kyc.all.order(created_at: :desc)
          else
            @current_user.kycs.order(created_at: :desc)
          end
          render json: { kycs: @kycs.map(&:to_frontend_format) }
        end

        def show
          render json: { kyc: @kyc.to_frontend_format }
        end

        def create
          # Check if user can create KYC (no pending or verified ones)
          if @current_user.kycs.where(status: ['pending', 'in_review', 'verified']).exists?
            return render json: { errors: ['You already have a KYC submission in progress or verified'] }, status: :unprocessable_entity
          end

            # Check if business_tax_id already exists (for issuers)
          if params[:kyc][:business_tax_id].present? && 
            Kyc.where(business_tax_id: params[:kyc][:business_tax_id]).exists?
            return render json: { errors: ['Business tax ID already exists'] }, status: :unprocessable_entity
          end

          # Build KYC without addresses first
          @kyc = @current_user.kycs.build(kyc_params.except(:addresses_attributes))
          
          # Manually handle addresses
          if params[:kyc][:addresses_attributes].present?
            params[:kyc][:addresses_attributes].each do |address_params|
              @kyc.kyc_addresses.build(
                address_type: address_params[:address_type],
                street: address_params[:street],
                city: address_params[:city],
                state: address_params[:state],
                postal_code: address_params[:postal_code],
                country: address_params[:country],
                is_primary: address_params[:is_primary] || false
              )
            end
          end

          if @kyc.save
            if @kyc.signature_data.present? && !@kyc.signature_image.attached?
              Rails.logger.warn "Signature data was provided but image processing may have failed"
            end
            
            render json: { kyc: @kyc.to_frontend_format }, status: :created
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          # Check if user can update (must be owner and in pending/in_review status)
          unless @kyc.pending? || @kyc.in_review?
            return render json: { errors: ['KYC cannot be updated in its current state'] }, status: :unprocessable_entity
          end
          
          # Handle addresses manually if provided
          if params[:kyc][:addresses_attributes].present?
            @kyc.kyc_addresses.destroy_all # Remove existing addresses
            params[:kyc][:addresses_attributes].each do |address_params|
              @kyc.kyc_addresses.build(
                address_type: address_params[:address_type],
                street: address_params[:street],
                city: address_params[:city],
                state: address_params[:state],
                postal_code: address_params[:postal_code],
                country: address_params[:country],
                is_primary: address_params[:is_primary] || false
              )
            end
          end
          
          if @kyc.update(kyc_params.except(:addresses_attributes))
            render json: { kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          # Check if user can destroy (must be in pending/in_review status)
          unless @kyc.pending? || @kyc.in_review?
            return render json: { errors: ['KYC cannot be deleted in its current state'] }, status: :unprocessable_entity
          end

          @kyc.destroy
          head :no_content
        end

        def upload_document
          # Find the document by type or create a new one
          document = @kyc.kyc_documents.find_or_initialize_by(document_type: params[:document_type])
          
          # Attach the file
          document.file.attach(params[:file])
          
          if document.save
            render json: { 
              message: 'Document uploaded successfully', 
              document: document.to_frontend_format 
            }
          else
            render json: { errors: document.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def submit
          # Check if user can submit (must be in pending status)
          unless @kyc.pending?
            return render json: { errors: ['KYC cannot be submitted in its current state'] }, status: :unprocessable_entity
          end

          if @kyc.update(status: 'in_review')
            render json: { message: 'KYC submitted for review', kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def documents
          @documents = @kyc.kyc_documents
          render json: { documents: @documents.map(&:to_frontend_format) }
        end

        def all_needs_review
          @kycs = Kyc.needs_review.order(created_at: :desc)
          render json: { kycs: @kycs.map(&:to_frontend_format) }
        end

        def show_documents
          render json: { 
            kyc: @kyc.to_frontend_format,
            documents: @kyc.kyc_documents.map(&:to_frontend_format)
          }
        end

        def verify
          unless @kyc.pending? || @kyc.in_review?
            return render json: { errors: ['KYC cannot be verified in its current state'] }, status: :unprocessable_entity
          end

          if @kyc.verify!(@current_user, params[:review_notes])
            render json: { message: 'KYC verified successfully', kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def reject
          unless @kyc.pending? || @kyc.in_review?
            return render json: { errors: ['KYC cannot be rejected in its current state'] }, status: :unprocessable_entity
          end

          if @kyc.reject!(params[:rejection_reason])
            render json: { message: 'KYC rejected', kyc: @kyc.to_frontend_format }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def request_info
          # Implement info request logic
          render json: { message: 'Information requested from user' }
        end

        private

        def set_kyc
          @kyc = Kyc.find(params[:id])
        end

        def authorize_user_access
          # Use your existing authorize_user! method
          authorize_user!(@kyc)
        end

        def kyc_params
          params.require(:kyc).permit(
            :kyc_type, :verification_type, :id_number, :id_expiry_date,
            :date_of_birth, :nationality, :occupation, :source_of_funds,
            :business_name, :business_registration_number, :business_tax_id,
            :business_industry, :business_established_date,
            :signature_data, :investor_signature_data, :issuer_accepted_terms,
            kyc_documents_attributes: [:id, :document_type, :file, :file_name, :_destroy]
          )
        end
      end
    end
  end
end