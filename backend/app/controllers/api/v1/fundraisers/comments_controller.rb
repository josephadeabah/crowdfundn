class Api::V1::Fundraisers::CommentsController < ApplicationController
  before_action :authenticate_request
  before_action :set_comment, only: [:show, :update, :destroy]
  before_action :set_campaign, only: [:index, :create]

  # GET /api/v1/fundraisers/campaigns/:campaign_id/comments
  def index
    @comments = @campaign.comments
    render json: @comments, status: :ok
  end

  # GET /api/v1/fundraisers/campaigns/:campaign_id/comments/:id
  def show
    render json: @comment, status: :ok
  end

  # POST /api/v1/fundraisers/campaigns/:campaign_id/comments
  def create
    @comment = @campaign.comments.build(comment_params)
    @comment.user = @current_user  # Associate the comment with the current user

    if @comment.save
      render json: @comment, status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end


  def update
    if @comment.update(comment_params)
      render json: @comment, status: :ok
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/fundraisers/campaigns/:campaign_id/comments/:id
  def destroy
    @comment.destroy
    render json: { message: 'Comment deleted successfully' }, status: :ok
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'Comment not found' }, status: :not_found
  end

  def set_campaign
    @campaign = Campaign.find(params[:campaign_id])
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'Campaign not found' }, status: :not_found
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
