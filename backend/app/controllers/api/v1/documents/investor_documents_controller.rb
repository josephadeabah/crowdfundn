# app/controllers/api/v1/documents/investor_documents_controller.rb
module Api
  module V1
    module Documents
      class InvestorDocumentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign
        before_action :authorize_fundraiser!, except: [:index, :show]
        before_action :set_document, only: [:show, :update, :destroy]

        # GET /api/v1/campaigns/:campaign_id/investor_documents
        def index
          @documents = @campaign.investor_documents
          render json: {
            documents: @documents.map(&:as_json) # Changed to use model's as_json
          }, status: :ok
        end

        # GET /api/v1/campaigns/:campaign_id/investor_documents/:id
        def show
          render json: @document.as_json, status: :ok # Changed to use model's as_json
        end

        # POST /api/v1/campaigns/:campaign_id/investor_documents
        def create
          @document = @campaign.investor_documents.new(
            user: @current_user,
            document_type: params[:document_type]
          )

          if params[:files].present?
            params[:files].each_with_index do |file, index|
              filename = "#{params[:document_type]}_#{Time.now.to_i}_#{index}.pdf"
              @document.files.attach(
                io: file,
                filename: filename,
                content_type: 'application/pdf'
              )
            end
          end

          if @document.save
            render json: {
              message: 'Documents uploaded successfully',
              document: @document.as_json # Changed to use model's as_json
            }, status: :created
          else
            render json: { 
              errors: @document.errors.full_messages 
            }, status: :unprocessable_entity
          end
        end

        # PATCH/PUT /api/v1/campaigns/:campaign_id/investor_documents/:id
        def update
          if params[:files].present?
            @document.files.purge if @document.files.attached?
            
            params[:files].each_with_index do |file, index|
              filename = "#{params[:document_type]}_#{Time.now.to_i}_#{index}.pdf"
              @document.files.attach(
                io: file,
                filename: filename,
                content_type: 'application/pdf'
              )
            end
          end

          if @document.update(document_params)
            render json: {
              message: 'Documents updated successfully',
              document: @document.as_json # Changed to use model's as_json
            }, status: :ok
          else
            render json: { 
              errors: @document.errors.full_messages 
            }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/campaigns/:campaign_id/investor_documents/:id
        def destroy
          @document.destroy
          head :no_content
        end

        private

        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end

        def set_document
          @document = @campaign.investor_documents.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Document not found' }, status: :not_found
        end

        def authorize_fundraiser!
          unless @campaign.fundraiser == @current_user
            render json: { error: 'Unauthorized' }, status: :unauthorized
          end
        end

        def document_params
          params.permit(:document_type, files: [])
        end

      end
    end
  end
end