module Api
  module V1
    module Kyc
      class KycsController < ApplicationController
        before_action :authenticate_request
        before_action :set_kyc, only: [:show, :update, :verify, :reject]
        before_action :authorize_kyc, only: [:update, :verify, :reject]

        # GET /api/v1/kyc/kycs
        def index
          @kycs = policy_scope(::Kyc).includes(:user)
          render json: @kycs, include: [:user]
        end

        # GET /api/v1/kyc/kycs/:id
        def show
          render json: @kyc, include: [:user, :verified_by]
        end

        # POST /api/v1/kyc/kycs
        def create
          @kyc = current_user.kycs.new(kyc_params)
          @kyc.kyc_type = determine_kyc_type

          if @kyc.save
            attach_files(@kyc)
            process_signature(@kyc)
            
            KycEmailService.send_submission_received_email(
              kyc: @kyc,
              recipient_email: current_user.email,
              recipient_name: current_user.full_name
            )
            
            render json: @kyc, status: :created, include: [:user]
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PATCH/PUT /api/v1/kyc/kycs/:id
        def update
          if @kyc.update(kyc_update_params)
            process_signature(@kyc) if params[:kyc][:signature_data].present?
            render json: @kyc, include: [:user, :verified_by]
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/kyc/kycs/:id/verify
        def verify
          if @kyc.verify!(current_user)
            KycEmailService.send_verification_approved_email(
              kyc: @kyc,
              recipient_email: @kyc.user.email,
              recipient_name: @kyc.user.full_name,
              verified_by_name: current_user.full_name
            )
            render json: { message: 'KYC successfully verified', kyc: @kyc }, status: :ok
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/kyc/kycs/:id/reject
        def reject
          if @kyc.reject!
            KycEmailService.send_verification_rejected_email(
              kyc: @kyc,
              recipient_email: @kyc.user.email,
              recipient_name: @kyc.user.full_name,
              rejected_by_name: current_user.full_name,
              rejection_reason: params[:kyc][:rejection_reason] || "Required documents were unclear or incomplete"
            )
            render json: { message: 'KYC rejected', kyc: @kyc }, status: :ok
          else
            render json: { errors: @kyc.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def set_kyc
          @kyc = ::Kyc.find(params[:id])
        end

        def authorize_kyc
          authorize @kyc
        end

        def kyc_params
          params.require(:kyc).permit(
            :verification_type,
            :id_number,
            :id_expiry_date,
            :id_image,
            :address_proof,
            :signature_data
          )
        end

        def kyc_update_params
          params.require(:kyc).permit(
            :status,
            :rejection_reason,
            :kyc_type,
            :signature_data
          )
        end

        def determine_kyc_type
          if current_user.investor? && current_user.campaigns.any?
            :both
          elsif current_user.investor?
            :investor
          else
            :issuer
          end
        end

        def attach_files(kyc)
          kyc.id_image.attach(params[:kyc][:id_image]) if params[:kyc][:id_image]
          kyc.address_proof.attach(params[:kyc][:address_proof]) if params[:kyc][:address_proof]
        end

        def process_signature(kyc)
          return unless params[:kyc][:signature_data].present?
          
          begin
            signature_points = JSON.parse(params[:kyc][:signature_data])
            kyc.update(signature_data: signature_points)
          rescue JSON::ParserError => e
            Rails.logger.error "Failed to parse signature data: #{e.message}"
          end
        end
      end
    end
  end
end