module Api
  module V1
    module Articles
      class ArticlesController < ApplicationController
        before_action :authenticate_request, only: %i[create update destroy]
        before_action :set_article, only: %i[show update destroy]

        # GET /api/v1/articles/articles
        def index
          page = params[:page] || 1
          page_size = params[:page_size] || 10

          @articles = Article.published.recent.page(page).per(page_size)
          render json: {
            articles: @articles,
            current_page: @articles.current_page,
            total_pages: @articles.total_pages,
            total_count: @articles.total_count
          }
        end

        # GET /api/v1/articles/articles/:slug_or_id
        def show
          render json: @article, include: [:description, :featured_image]
        end

        # POST /api/v1/articles/articles
        def create
          @article = Article.new(article_params)
          @article.author = @current_user # Use the authenticated user

          if params[:featured_image].present?
            @article.featured_image.attach(params[:featured_image])
            set_featured_image_content_disposition(@article.featured_image)
          end

          if @article.save
            render json: @article, status: :created
          else
            render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/articles/articles/:slug_or_id
        def update
          authorize_user!(@article) # Ensure the user is authorized to update the article

          if @article.update(article_params)
            if params[:featured_image].present?
              @article.featured_image.attach(params[:featured_image])
              set_featured_image_content_disposition(@article.featured_image)
            end
            render json: @article
          else
            render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/articles/articles/:slug_or_id
        def destroy
          authorize_user!(@article) # Ensure the user is authorized to delete the article

          if @article.destroy
            render json: { message: 'Article deleted successfully' }
          else
            render json: { error: 'Failed to delete article' }, status: :unprocessable_entity
          end
        end

        private

        def set_article
          # Find article by slug or ID
          @article = if params[:slug].present?
                      Article.find_by!(slug: params[:slug])
                    elsif params[:id].present?
                      Article.find_by!(id: params[:id])
                    else
                      raise ActiveRecord::RecordNotFound, 'Article not found'
                    end
        end

        def article_params
          params.require(:article).permit(
            :title, :slug, :description, :status, :meta_description, :published_at, :featured_image
          )
        end

        def set_featured_image_content_disposition(featured_image)
          s3 = Aws::S3::Resource.new
          object = s3.bucket(Rails.application.credentials.dig(:digitalocean, :bucket)).object(featured_image.key)
          object.copy_from(object.bucket.name + '/' + object.key, {
                             metadata_directive: 'REPLACE',
                             content_disposition: 'inline',
                             acl: 'public-read'
                           })
        end
      end
    end
  end
end