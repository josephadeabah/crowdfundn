# app/controllers/api/v1/kyc/kycs_controller.rb
require 'csv'

module Api
  module V1
    module Kyc
      class KycsController < ApplicationController
        before_action :authenticate_request
        before_action :set_kyc, only: [:show, :update, :destroy, :submit, :documents, :verify, :reject, :request_info, :upload_document]
        before_action :authorize_user_access, only: [:update, :destroy, :submit, :documents]
        before_action -> { authorize_admin_or_owner(@kyc) }, only: [:show]
        before_action :authorize_admin, only: [:all_needs_review, :stats, :verify, :reject, :request_info]

        # Set default pagination values
        DEFAULT_PER_PAGE = 25
        MAX_PER_PAGE = 100

        def index
          @kycs = if @current_user.admin?
            # Use ::Kyc instead of just Kyc to avoid namespace conflicts
            ::Kyc.includes(:user, :kyc_documents, :kyc_addresses, user: [:profile, :campaigns]).all.order(created_at: :desc)
          else
            @current_user.kycs.includes(:kyc_documents, :kyc_addresses).order(created_at: :desc)
          end
          
          # Apply pagination
          @kycs = paginate_collection(@kycs)
          
          render json: { 
            kycs: @kycs.map { |kyc| KycFrontendService.format_for_frontend(kyc) },
            pagination: pagination_meta(@kycs)
          }
        end

        def show
          render json: { kyc: KycFrontendService.format_for_frontend(@kyc) }
        end

        def create
          # Allow upgrades from single type to both type while maintaining security
          existing_active_kyc = @current_user.kycs.where(status: ['pending', 'in_review', 'verified']).first
          
          if existing_active_kyc
            requested_type = params.dig(:kyc, :kyc_type)
            
            # Check if upgrade is allowed and valid
            upgrade_validation = validate_kyc_upgrade(existing_active_kyc, requested_type)
            
            unless upgrade_validation[:allowed]
              return render_kyc_error(upgrade_validation[:message])
            end
            
            # Handle the upgrade scenario - mark existing as superseded
            if existing_active_kyc.pending? || existing_active_kyc.in_review?
              existing_active_kyc.mark_as_superseded!(requested_type)
            end
          end

          # Use ALL permitted parameters (including signature data and declaration data)
          @kyc = @current_user.kycs.build(kyc_params)

          # Set declaration fields
          if params[:declaration_data].present?
            @kyc.accredited_investor = params[:declaration_data][:accredited_investor] || false
            @kyc.nominee_agreement_accepted = params[:declaration_data][:nominee_agreement] || false
            @kyc.risk_acknowledgment = params[:declaration_data][:risk_acknowledgment] || false
            @kyc.terms_accepted = params[:declaration_data][:terms_acceptance] || false
            @kyc.data_consent = params[:declaration_data][:data_consent] || false
          end

          # Set upgrade fields if this is an upgrade
          if existing_active_kyc && requested_type == 'both'
            @kyc.upgraded_from_type = existing_active_kyc.kyc_type
            @kyc.is_upgrade = true
          end

          if @kyc.save
            # Process signature immediately after save
            begin
              @kyc.process_signature
            rescue => e
              Rails.logger.error "Signature processing failed: #{e.message}"
            end
            
            render json: { kyc: KycFrontendService.format_for_frontend(@kyc) }, status: :created
          else
            render_kyc_errors(@kyc.errors)
          end
        end

        def update
          # Check if user can update (must be owner and in pending/in_review status)
          unless @kyc.pending? || @kyc.in_review?
            return render_kyc_error('KYC cannot be updated in its current state')
          end
          
          # Update declaration fields if provided
          if params[:declaration_data].present?
            @kyc.accredited_investor = params[:declaration_data][:accredited_investor] if params[:declaration_data].key?(:accredited_investor)
            @kyc.nominee_agreement_accepted = params[:declaration_data][:nominee_agreement] if params[:declaration_data].key?(:nominee_agreement)
            @kyc.risk_acknowledgment = params[:declaration_data][:risk_acknowledgment] if params[:declaration_data].key?(:risk_acknowledgment)
            @kyc.terms_accepted = params[:declaration_data][:terms_acceptance] if params[:declaration_data].key?(:terms_acceptance)
            @kyc.data_consent = params[:declaration_data][:data_consent] if params[:declaration_data].key?(:data_consent)
          end
          
          # Use ALL permitted parameters (including signature data)
          if @kyc.update(kyc_params)
            render json: { kyc: KycFrontendService.format_for_frontend(@kyc) }
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
          # Bust cache after deletion
          bust_kyc_stats_cache
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
              
              # Reload the KYC to include updated documents
              @kyc.reload
              
              render json: { 
                message: 'Document uploaded successfully', 
                document: KycFrontendService.format_document(document),
                kyc: KycFrontendService.format_for_frontend(@kyc)
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
            # Bust the cache after status change
            bust_kyc_stats_cache
            
            # Send submission confirmation email
            send_submission_email(@kyc)
            
            render json: { message: 'KYC submitted for review', kyc: KycFrontendService.format_for_frontend(@kyc) }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def documents
          @documents = @kyc.kyc_documents
          render json: { documents: @documents.map { |doc| KycFrontendService.format_document(doc) } }
        end

        def all_needs_review
          @kycs = ::Kyc.includes(:user, :kyc_documents, :kyc_addresses, user: [:profile, :campaigns])
                      .needs_review
                      .order(created_at: :desc)
          
          # Apply filters
          @kycs = @kycs.where(status: params[:status]) if params[:status].present?
          @kycs = @kycs.where(kyc_type: params[:kyc_type]) if params[:kyc_type].present?
          
          # Apply pagination
          @kycs = paginate_collection(@kycs)
          
          render json: { 
            kycs: @kycs.map { |kyc| KycFrontendService.format_for_frontend(kyc) },
            pagination: pagination_meta(@kycs)
          }
        end

        def show_documents
          render json: { 
            kyc: KycFrontendService.format_for_frontend(@kyc),
            documents: @kyc.kyc_documents.map { |doc| KycFrontendService.format_document(doc) }
          }
        end

        def verify
          unless @kyc.pending? || @kyc.in_review?
            return render json: { errors: ['KYC cannot be verified in its current state'] }, status: :unprocessable_entity
          end

          if @kyc.verify!(@current_user, params[:review_notes])
            # Bust the cache after status change (already handled in model, but double-check)
            bust_kyc_stats_cache
            
            # Send approval email
            send_approval_email(@kyc, @current_user)
            
            render json: { message: 'KYC verified successfully', kyc: KycFrontendService.format_for_frontend(@kyc) }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def reject
          unless @kyc.pending? || @kyc.in_review?
            return render json: { errors: ['KYC cannot be rejected in its current state'] }, status: :unprocessable_entity
          end

          rejection_reason = params[:rejection_reason]
          unless rejection_reason.present?
            return render json: { errors: ['Rejection reason is required'] }, status: :unprocessable_entity
          end

          if @kyc.reject!(rejection_reason)
            # Bust the cache after status change (already handled in model, but double-check)
            bust_kyc_stats_cache
            
            # Send rejection email
            send_rejection_email(@kyc, @current_user, rejection_reason)
            
            render json: { message: 'KYC rejected', kyc: KycFrontendService.format_for_frontend(@kyc) }
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def request_info
          # Implement info request logic
          # some logic to notify user for more info   
          render json: { message: 'Information requested from user' }
        end

        def status
          # Return the current user's KYC status
          kyc_info = @current_user.kyc_status_info
          render json: kyc_info
        end

        def upgrade_status
          # Check if user can upgrade to both
          can_upgrade = @current_user.can_upgrade_to_both?
          current_type = @current_user.latest_kyc&.kyc_type
          
          render json: {
            can_upgrade: can_upgrade,
            current_type: current_type,
            upgrade_type: 'both',
            message: can_upgrade ? 
              "You can upgrade from #{current_type} to full platform access" :
              "You already have full platform access or cannot upgrade"
          }
        end

        def stats
          # Get the latest KYC update timestamp for cache versioning
          latest_update = ::Kyc.maximum(:updated_at) || Time.current
          cache_key = "kyc_stats_v#{latest_update.to_i}"

          stats = Rails.cache.fetch(cache_key, expires_in: 1.hour) do
            {
              total: ::Kyc.count,
              pending: ::Kyc.where(status: 'pending').count,
              in_review: ::Kyc.where(status: 'in_review').count,
              verified: ::Kyc.where(status: 'verified').count,
              rejected: ::Kyc.where(status: 'rejected').count,
              expired: ::Kyc.where(status: 'expired').count,
              superseded: ::Kyc.where(status: 'superseded').count
            }
          end

          render json: { stats: stats }
        rescue => e
          Rails.logger.error "KYC stats failed: #{e.message}"
          render json: { error: 'Could not fetch KYC stats' }, status: :internal_server_error
        end

        def export
          unless @current_user.admin?
            return render json: { error: 'Unauthorized' }, status: :forbidden
          end

          # Use ::Kyc to explicitly reference the model, not the module
          @kycs = ::Kyc.includes(:user, :kyc_documents, :kyc_addresses)
                      .order(created_at: :desc)

          # Apply filters
          @kycs = @kycs.where(status: params[:status]) if params[:status].present?
          @kycs = @kycs.where(kyc_type: params[:kyc_type]) if params[:kyc_type].present?
          
          if params[:search].present?
            search_term = "%#{params[:search].downcase}%"
            @kycs = @kycs.joins(:user).where(
              "kycs.reference ILIKE :search OR 
              kycs.id_number ILIKE :search OR 
              users.email ILIKE :search OR 
              users.full_name ILIKE :search",
              search: search_term
            )
          end

          csv_data = generate_kyc_csv(@kycs)

          send_data csv_data,
                    type: 'text/csv; charset=utf-8; header=present',
                    disposition: "attachment; filename=kycs-export-#{Date.today}.csv"
        end

        private

        def generate_kyc_csv(kycs)
          CSV.generate(headers: true) do |csv|
            csv << [
              'Reference',
              'User ID',
              'User Email',
              'User Name',
              'KYC Type',
              'Status',
              'Verification Type',
              'ID Number',
              'Nationality',
              'Date of Birth',
              'Created At',
              'Updated At',
              'Verified At',
              'Rejection Reason',
              'Accredited Investor',
              'Nominee Agreement Accepted',
              'Risk Acknowledgment',
              'Terms Accepted',
              'Data Consent'
            ]

            kycs.each do |kyc|
              csv << [
                kyc.reference,
                kyc.user.id,
                kyc.user.email,
                kyc.user.full_name,
                kyc.kyc_type,
                kyc.status,
                kyc.verification_type,
                kyc.id_number,
                kyc.nationality,
                kyc.date_of_birth,
                kyc.created_at,
                kyc.updated_at,
                kyc.verified_at,
                kyc.rejection_reason,
                kyc.accredited_investor,
                kyc.nominee_agreement_accepted,
                kyc.risk_acknowledgment,
                kyc.terms_accepted,
                kyc.data_consent
              ]
            end
          end
        end

        def set_kyc
          @kyc = ::Kyc.includes(:user, :kyc_documents, :kyc_addresses, user: [:profile, :campaigns]).find(params[:id])
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
            :issuer_accepted_terms, :accredited_investor, :nominee_agreement_accepted,
            :risk_acknowledgment, :terms_accepted, :data_consent,
            :upgraded_from_type, :is_upgrade,
            signature_data: [:x, :y],
            investor_signature_data: [:x, :y],
            issuer_signature_data: [:x, :y],
            kyc_addresses_attributes: [:id, :address_type, :street, :city, :state, :postal_code, :country, :is_primary, :_destroy],
            mentor_application_attributes: [
              :professional_title,
              :years_of_experience,
              :previous_mentoring,
              :linkedin_profile,
              :resume_url,
              :mentorship_approach,
              :availability,
              industry_expertise: []
            ]
          )
        end

        def validate_kyc_upgrade(existing_kyc, requested_type)
          # Cannot upgrade if already has both access
          if existing_kyc.kyc_type == 'both'
            return { 
              allowed: false, 
              message: 'You already have full platform access. No upgrade needed.' 
            }
          end
          
          # Mentor verifications are separate and cannot be upgraded
          if existing_kyc.kyc_type == 'mentor' || requested_type == 'mentor'
            return { 
              allowed: false, 
              message: 'Mentor verification is separate and cannot be combined with other types.' 
            }
          end
          
          # Only allow upgrade to 'both' type
          if requested_type != 'both'
            return { 
              allowed: false, 
              message: 'You can only upgrade to Full Platform Access (both capabilities).' 
            }
          end
          
          { allowed: true, message: 'Upgrade allowed' }
        end

        def render_kyc_errors(errors)
          # Simplified error formatting - no need to handle business uniqueness separately
          formatted_errors = errors.full_messages.map do |message|
            {
              message: message,
              type: 'validation'
            }
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

        # Email sending methods
        def send_submission_email(kyc)
          recipient_email = kyc.user.email
          recipient_name = kyc.user.full_name || kyc.user.email

          begin
            KycEmailService.send_submission_received_email(
              kyc: kyc,
              recipient_email: recipient_email,
              recipient_name: recipient_name
            )
            Rails.logger.info "KYC submission email sent to #{recipient_email}"
          rescue => e
            Rails.logger.error "Failed to send KYC submission email: #{e.message}"
          end
        end

        def send_approval_email(kyc, verified_by_user)
          recipient_email = kyc.user.email
          recipient_name = kyc.user.full_name || kyc.user.email
          verified_by_name = verified_by_user.full_name || verified_by_user.email

          begin
            KycEmailService.send_verification_approved_email(
              kyc: kyc,
              recipient_email: recipient_email,
              recipient_name: recipient_name,
              verified_by_name: verified_by_name
            )
            Rails.logger.info "KYC approval email sent to #{recipient_email}"
            bust_kyc_stats_cache
          rescue => e
            Rails.logger.error "Failed to send KYC approval email: #{e.message}"
          end
        end

        def send_rejection_email(kyc, rejected_by_user, rejection_reason)
          recipient_email = kyc.user.email
          recipient_name = kyc.user.full_name || kyc.user.email
          rejected_by_name = rejected_by_user.full_name || rejected_by_user.email

          begin
            KycEmailService.send_verification_rejected_email(
              kyc: kyc,
              recipient_email: recipient_email,
              recipient_name: recipient_name,
              rejected_by_name: rejected_by_name,
              rejection_reason: rejection_reason
            )
            Rails.logger.info "KYC rejection email sent to #{recipient_email}"
            bust_kyc_stats_cache
          rescue => e
            Rails.logger.error "Failed to send KYC rejection email: #{e.message}"
          end
        end

        # Cache busting method
        def bust_kyc_stats_cache
          # Bust all possible KYC stats cache keys
          Rails.cache.delete_matched("kyc_stats_*")
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