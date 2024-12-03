
Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      namespace :members do
        resources :profiles, only: [:update]
        resources :roles, only: [:create]
        post 'auth/signup', to: 'auth#signup'
        post 'auth/confirm_email', to: 'auth#confirm_email', as: :confirm_email
        post 'auth/login', to: 'auth#login'
        post 'auth/password/reset', to: 'auth#password_reset'
        post 'auth/resend_confirmation', to: 'auth#resend_confirmation'
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
        # Transfer Routes
        post 'transfers/create_transfer_recipient', to: 'transfers#create_transfer_recipient'
        post 'transfers/bulk_create_transfer_recipients', to: 'transfers#bulk_create_transfer_recipients'
        get 'transfers/list_transfer_recipients', to: 'transfers#list_transfer_recipients'
        get 'transfers/fetch_transfer_recipient', to: 'transfers#fetch_transfer_recipient'
        post 'transfers/create_subaccount', to: 'transfers#create_subaccount'
        post 'transfers/create_split', to: 'transfers#create_split'
        post 'transfers/add_subaccount_to_split', to: 'transfers#add_subaccount_to_split'
        post 'transfers/initialize_transfer', to: 'transfers#initialize_transfer'
        post 'transfers/finalize_transfer', to: 'transfers#finalize_transfer'
        post 'transfers/initiate_bulk_transfer', to: 'transfers#initiate_bulk_transfer'
        get 'transfers/fetch_transfer', to: 'transfers#fetch_transfer'
        get 'transfers/verify_transfer', to: 'transfers#verify_transfer'
        post 'paystack_webhook/receive'
        post 'transfers/approve_transfer', to: 'transfers#approve_transfer'
        resources :subscriptions, only: [] do
          collection do
            post :create_plan
            post :create_subscription
            post :cancel_subscription
            get :fetch_subscription
          end
        end
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
