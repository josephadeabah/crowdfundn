Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :members do
        resources :profiles, only: [:update]
        resources :roles, only: [:create]
        post 'auth/signup', to: 'auth#signup'
        post 'auth/login', to: 'auth#login'
        post 'auth/password/reset', to: 'auth#password_reset'
        put 'auth/password/reset', to: 'auth#reset_password'
        
        # User management routes
        get 'users', to: 'users#index'                   # Route to get all users
        get 'users/me', to: 'users#show'                 # Route for the current authenticated user
        put 'users/me', to: 'users#update'
        put 'users/me/password', to: 'users#change_password'
        get 'users/:id', to: 'users#show_by_id'          # Route to get user by ID
        put 'users/:id/make_admin', to: 'users#make_admin' # Route to make user an admin
        put 'users/:id/assign_role', to: 'users#assign_role' # Added route for assign_role
      end

      namespace :fundraisers do
        post 'paystack_webhook/receive'
        resources :donations, only: [:index]
        resources :campaigns do
          get 'my_campaigns', on: :collection
          get 'group_by_category', on: :collection
          resources :updates, only: %i[create update destroy]
          resources :comments, only: %i[create index destroy]
          resources :rewards, only: %i[index show create update destroy]
          resources :donations, only: [:create] do
          end
        end
      end
    end
  end

  # Health check route
  get 'up' => 'rails/health#show', as: :rails_health_check
end
