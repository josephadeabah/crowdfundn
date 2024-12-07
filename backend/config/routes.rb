
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
        get 'users', to: 'users#index'
        get 'users/me', to: 'users#show'
        put 'users/me', to: 'users#update'
        put 'users/me/password', to: 'users#change_password'
        get 'users/:id', to: 'users#show_by_id'
        put 'users/:id/make_admin', to: 'users#make_admin'
        put 'users/:id/assign_role', to: 'users#assign_role'
        post 'users/:user_id/create_subaccount', to: 'users#create_subaccount'
        get 'users/:user_id/subaccount', to: 'users#show_subaccount'
      end

      namespace :fundraisers do
        resources :transfers, only: [] do
          collection do
            post :create_transfer_recipient
            post :bulk_create_transfer_recipients
            get :get_bank_list
            get :list_transfer_recipients
            get :fetch_transfer_recipient
            get :resolve_account_details
            post :add_subaccount_to_split
            post :initialize_transfer
            post :finalize_transfer
            post :initiate_bulk_transfer
            get :fetch_transfers
            get :fetch_user_transfers
            get :verify_transfer
            post :approve_transfer
          end
        end

        post 'paystack_webhook/receive'

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
          resources :donations, only: [:create]
        end
      end
    end
  end

  # Health check route
  get 'up' => 'rails/health#show', as: :rails_health_check
  # Catch-all route for unmatched requests (must be the last route)
  match '*unmatched', to: 'application#not_found', via: :all
end
