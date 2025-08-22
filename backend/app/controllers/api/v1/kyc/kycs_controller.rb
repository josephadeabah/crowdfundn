# app/controllers/api/v1/kyc/kycs_controller.rb
module Api
  module V1
    module Kyc
      class KycsController < ApplicationController
        before_action :authenticate_request
        before_action :set_kyc, only: [:show, :update, :destroy, :submit, :documents, :verify, :reject, :request_info, :upload_document]
        before_action :authorize_user_access, only: [:update, :destroy, :submit, :documents]
        before_action :authorize_admin, only: [:show, :all_needs_review, :stats, :verify, :reject, :request_info]

        # Set default pagination values
        DEFAULT_PER_PAGE = 25
        MAX_PER_PAGE = 100

        def index
          @kycs = if @current_user.admin?
            Kyc.all.order(created_at: :desc)
          else
            @current_user.kycs.order(created_at: :desc)
          end
          
          # Apply pagination
          @kycs = paginate_collection(@kycs)
          
          render json: { 
            kycs: @kycs.map(&:to_frontend_format),
            pagination: pagination_meta(@kycs)
          }
        end

        def show
          render json: { kyc: @kyc.to_frontend_format }
        end

        def create
          # Check if user can create KYC (no pending or verified ones)
          if @current_user.kycs.where(status: ['pending', 'in_review', 'verified']).exists?
            return render_kyc_error('You already have a KYC submission in progress or verified')
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
            render_kyc_errors(@kyc.errors)
          end
        end

        def update
          # Check if user can update (must be owner and in pending/in_review status)
          unless @kyc.pending? || @kyc.in_review?
            return render_kyc_error('KYC cannot be updated in its current state')
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
            render_kyc_errors(@kyc.errors)
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
          begin
            # Find the document by type or create a new one
            document = @kyc.kyc_documents.find_or_initialize_by(document_type: params[:document_type])
            
            # Validate document type
            unless KycDocument::DOCUMENT_TYPES.include?(params[:document_type])
              return render json: { errors: ['Invalid document type'] }, status: :unprocessable_entity
            end

            # Validate file presence
            unless params[:file].present?
              return render json: { errors: ['No file provided'] }, status: :unprocessable_entity
            end

            # Validate file type and size
            file = params[:file]
            if file.size > 10.megabytes
              return render json: { errors: ['File size must be less than 10MB'] }, status: :unprocessable_entity
            end

            allowed_content_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
            unless allowed_content_types.include?(file.content_type)
              return render json: { errors: ['File must be PDF, JPEG, or PNG'] }, status: :unprocessable_entity
            end

            # Attach the file
            document.file.attach(file)
            
            if document.save
              # Force processing and analysis
              KycDocumentProcessingJob.perform_later(document.id)
              if document.file.attached?
                document.file.blob.analyze if document.file.blob.analyzed?
                
                # Update filename in database
                document.update_column(:file_name, document.file.filename.to_s)
              end
              
              render json: { 
                message: 'Document uploaded successfully', 
                document: document.to_frontend_format 
              }
            else
              render json: { errors: document.errors.full_messages }, status: :unprocessable_entity
            end
            
          rescue => e
            Rails.logger.error "Document upload failed: #{e.message}"
            render json: { errors: ['Failed to upload document'] }, status: :internal_server_error
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
          @kycs = ::Kyc.includes(:user, :kyc_documents, :kyc_addresses)
                      .needs_review
                      .order(created_at: :desc)
          
          # Apply filters
          @kycs = @kycs.where(status: params[:status]) if params[:status].present?
          @kycs = @kycs.where(kyc_type: params[:kyc_type]) if params[:kyc_type].present?
          
          # Apply pagination
          @kycs = paginate_collection(@kycs)
          
          render json: { 
            kycs: @kycs.map(&:to_frontend_format),
            pagination: pagination_meta(@kycs)
          }
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

        def stats
          cache_key = "kyc_stats_#{Date.today}"

          stats = Rails.cache.fetch(cache_key, expires_in: 1.hour) do
            {
              total: ::Kyc.count,
              pending: ::Kyc.where(status: 'pending').count,
              in_review: ::Kyc.where(status: 'in_review').count,
              verified: ::Kyc.where(status: 'verified').count,
              rejected: ::Kyc.where(status: 'rejected').count,
              expired: ::Kyc.where(status: 'expired').count
            }
          end

          render json: { stats: stats }
        rescue => e
          Rails.logger.error "KYC stats failed: #{e.message}"
          render json: { error: 'Could not fetch KYC stats' }, status: :internal_server_error
        end

        private

        def set_kyc
          @kyc = ::Kyc.find(params[:id])
        end

        def authorize_user_access
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

                def render_kyc_errors(errors)
          # Format errors for frontend display
          formatted_errors = errors.full_messages.map do |message|
            if message.include?('has already been taken')
              # Extract field name from error message
              field = message.split(' ').first
              {
                field: field.underscore,
                message: message,
                type: 'uniqueness'
              }
            else
              {
                message: message,
                type: 'validation'
              }
            end
          end

          render json: { 
            errors: formatted_errors,
            full_messages: errors.full_messages 
          }, status: :unprocessable_entity
        end

        def render_kyc_error(message)
          render json: { 
            errors: [{ message: message, type: 'general' }],
            full_messages: [message]
          }, status: :unprocessable_entity
        end

        # Pagination helper methods
        def paginate_collection(collection)
          per_page = params[:per_page].to_i.positive? ? [params[:per_page].to_i, MAX_PER_PAGE].min : DEFAULT_PER_PAGE
          collection.page(params[:page] || 1).per(per_page)
        end

        def pagination_meta(collection)
          {
            current_page: collection.current_page,
            next_page: collection.next_page,
            prev_page: collection.prev_page,
            total_pages: collection.total_pages,
            total_count: collection.total_count,
            per_page: collection.limit_value
          }
        end
      end
    end
  end
end