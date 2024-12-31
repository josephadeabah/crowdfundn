class Api::V1::Fundraisers::CommentsController < ApplicationController
  before_action :authenticate_request, except: [:index, :show]
  before_action :set_comment, only: %i[show update destroy]
  before_action :set_campaign, only: %i[index create]

  # GET /api/v1/fundraisers/campaigns/:campaign_id/comments
  def index
    # Fetch all comments for the campaign
    @comments = @campaign.comments.order(created_at: :desc)
    render json: @comments, status: :ok
  end

  # GET /api/v1/fundraisers/campaigns/:campaign_id/comments/:id
  def show
    render json: @comment, status: :ok
  end

  # POST /api/v1/fundraisers/campaigns/:campaign_id/comments
  def create
    if @current_user
      unless user_has_successfully_donated?(@campaign, @current_user)
        return render json: { error: 'You must have made a successful donation to comment.' }, status: :unauthorized
      end

      @comment = @campaign.comments.build(comment_params.merge({
        user: @current_user,
        full_name: @current_user.full_name,
        email: @current_user.email
      }))
    else
      # For anonymous users, check for a valid donation using anonymous_token
      anonymous_token = cookies[:anonymous_token]
      unless anonymous_token && anonymous_user_has_successfully_donated?(@campaign, anonymous_token)
        return render json: { error: 'You must make a successful donation to comment.' }, status: :unauthorized
      end

      @comment = @campaign.comments.build(comment_params.merge({
        anonymous_token: anonymous_token
      }))
    end

    if @comment.save
      render json: @comment, status: :created
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/fundraisers/campaigns/:campaign_id/comments/:id
  def update
    if @comment.update(comment_params)
      render json: @comment, status: :ok
    else
      render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/fundraisers/campaigns/:campaign_id/comments/:id
  def destroy
    if @comment.destroy
      head :no_content
    else
      render json: { error: 'Unable to delete comment' }, status: :unprocessable_entity
    end
  end

  private

  def set_campaign
    @campaign = Campaign.find(params[:campaign_id])
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'Campaign not found' }, status: :not_found
  end

  def set_comment
    @comment = Comment.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { message: 'Comment not found' }, status: :not_found
  end

  def comment_params
    params.require(:comment).permit(:content)
  end

  # Helper method to check if the authenticated user has made a successful donation
  def user_has_successfully_donated?(campaign, user)
    Donation.exists?(campaign_id: campaign.id, user_id: user.id, status: 'successful')
  end

  # Helper method to check if the anonymous user has made a successful donation
  def anonymous_user_has_successfully_donated?(campaign, anonymous_token)
    Donation.exists?(campaign_id: campaign.id, metadata: { anonymous_token: anonymous_token }, status: 'successful')
  end
end
