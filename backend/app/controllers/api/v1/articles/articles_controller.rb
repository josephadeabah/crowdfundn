# app/controllers/api/v1/articles/articles_controller.rb
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

        # GET /api/v1/articles/articles/:slug
        def show
          render json: @article, include: [:description, :featured_image]
        end

        # POST /api/v1/articles/articles
        def create
          @article = Article.new(article_params)
          @article.author = @current_user # Use the authenticated user

          if @article.save
            render json: @article, status: :created
          else
            render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/articles/articles/:slug
        def update
          authorize_user!(@article) # Ensure the user is authorized to update the article

          if @article.update(article_params)
            render json: @article
          else
            render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/articles/articles/:slug
        def destroy
          authorize_user!(@article) # Ensure the user is authorized to delete the article

          @article.destroy
          head :no_content
        end

        private

        def set_article
          @article = Article.find_by!(slug: params[:slug])
        end

        def article_params
          params.require(:article).permit(
            :title, :slug, :description, :status, :meta_description, :published_at, :featured_image
          )
        end
      end
    end
  end
end