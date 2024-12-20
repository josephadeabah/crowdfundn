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
    # Ensure the user has donated successfully to comment
    unless user_has_successfully_donated?(@campaign, @current_user)
      return render json: { error: 'You must have made a successful donation to comment.' }, status: :unauthorized
    end
  
    @comment = @campaign.comments.build(comment_params)
  
    if @current_user
      @comment.user = @current_user
      @comment.full_name = @current_user.full_name
      @comment.email = @current_user.email
    else
      @comment.user_id = nil
      @comment.full_name = nil
      @comment.email = nil
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

  # Helper method to check if the user has made a successful donation to the campaign
  # Helper method to check if the user has made a successful donation to the campaign
  def user_has_successfully_donated?(campaign, user)

    # Check for authenticated users by fetching donation record
    if user
      @donation = Donation.find_by(campaign_id: campaign.id, user_id: user.id, status: 'successful')
      return @donation.present?
    end

    # Check for anonymous users using the session token from donations metadata
    session_token = request.session.id  # Directly use the Rails session ID
    # Ensure session_token is present and match it with donation metadata
    if session_token.present?
      @donation = Donation.find_by(
        campaign_id: campaign.id,
        user_id: nil,
        status: 'successful',
        "metadata ->> 'session_token' = ?" => session_token
      )
      return @donation.present?
    end

    false
  end     
end
