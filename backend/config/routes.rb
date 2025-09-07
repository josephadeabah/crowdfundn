Rails.application.routes.draw do
  # redirect to the detailed campaign page
  get 'campaign/:id', to: 'campaigns#show', as: 'campaign'

  namespace :api do
    namespace :v1 do
      namespace :members do
        # Premium subscription routes - UPDATED with cleaner structure
        resources :premium_plans, only: [:index]
        resources :premium_subscriptions, only: [:create] do
          collection do
            get :current, to: 'premium_subscriptions#show'  # GET /premium_subscriptions/current
            delete :cancel
          end
        end
        
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
        put 'users/:id/remove_role', to: 'users#remove_role'
        post 'users/:user_id/create_subaccount', to: 'users#create_subaccount'
        get 'users/:user_id/subaccount', to: 'users#show_subaccount'
        put 'users/:user_id/update_subaccount', to: 'users#update_subaccount'
        put 'users/:id/block', to: 'users#block_user'
        put 'users/:id/activate', to: 'users#activate_user'
        delete 'users/:id', to: 'users#destroy'
      end

      # Add KYC namespace with proper routes
      namespace :kyc do
        resources :kycs, only: [:index, :create, :show, :update, :destroy] do
          member do
            post :submit
            post :verify
            post :reject
            post :request_info
            get :documents
            post :upload_document
            get :show_documents
          end
          collection do
            get :all_needs_review
            get :stats 
            get :status
            get :upgrade_status
          end
        end
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
            get :fetch_transfers_from_paystack
            get :fetch_transfers
            get :fetch_user_transfers
            get :verify_transfer
            get :fetch_settlement_status
            post :approve_transfer
            put :update_transfer_recipient
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

        resources :donations, only: [:index] do
          collection do
            post :send_thank_you_emails 
          end
        end

        # New thank you routes for both donations and investments
        post 'send_thank_you_email', to: 'thank_you#send_thank_you_email'
        post 'send_bulk_thank_you_emails', to: 'thank_you#send_bulk_thank_you_emails'

        resources :campaigns, constraints: { id: /[0-9]+|[a-zA-Z0-9\-]+/ } do
          resources :campaign_shares, only: [:create]
          collection do
            get :favorites
          end
          member do
            patch 'cancel', to: 'campaigns#cancel_campaign'
            post :favorite
            delete :unfavorite
            post 'contact', to: 'campaigns#contact_fundraiser'
            get 'public_donations', to: 'donations#public_donations'
          end
          post 'webhook_status_update', on: :collection  # Defines a route for webhook status update
          get 'my_campaigns', on: :collection
          get 'group_by_category', on: :collection
          get 'statistics', on: :collection
          resources :updates, only: %i[create update destroy]
          resources :comments, only: %i[create index destroy]
          resources :rewards, only: %i[index show create update destroy]
          resources :donations, only: [:create]
          namespace :documents do
            resources :investor_documents, only: [:index, :show, :create, :update, :destroy]
               resources :investment_certificates, only: [] do
                member do
                  get :status
                  post :generate
                  get :download
                end
              end
          end
        end

        # Fundraiser-facing equity operations
        resources :equity_campaigns, only: [], constraints: { id: /[0-9]+|[a-zA-Z0-9\-]+/ } do
          resources :equity_investments, only: [:index, :create] do
            collection do
              get :public_investments
            end
            
            member do
              put :update
              delete :destroy
            end
          end
        end
          # Collection routes (don't need specific campaign)
        resources :equity_investments, only: [] do
          collection do
            get :portfolio
            get :my_investments
          end
        end
      end

      # Leaderboard routes
      namespace :leaderboard do
        get 'top_backers', to: 'leaderboard#top_backers'
        get 'most_active_backers', to: 'leaderboard#most_active_backers'
        get 'top_backers_with_rewards', to: 'leaderboard#top_backers_with_rewards'
        get 'top_fundraisers_stories', to: 'leaderboard#top_fundraisers_stories'
      end

      # Leaderboard Entry Routes
      namespace :leaderboard_entry do
        resources :leaderboard_entry, only: [:index] do
          collection do
            get :my_rank
            get :fundraiser_rank
          end
        end

        # Add this route to fetch the fundraiser leaderboard
        get 'fundraisers', to: 'leaderboard_entry#fundraisers'
      end

      # Points Routes
      namespace :points do
        get 'my_points', to: 'points#my_points'
      end

      # Backer Rewards Routes
      namespace :backer_rewards do
        resources :backer_rewards, only: [:index] do
          collection do
            get :my_reward
          end
        end
      end

      # Add the metrics routes
      namespace :metrics do
        get 'dashboard', to: 'metrics#dashboard'
      end

      namespace :articles do
        resources :articles, only: %i[index create]
        get 'articles/:slug_or_id', to: 'articles#show', constraints: { slug_or_id: /[^\/]+/ }
        put 'articles/:slug_or_id', to: 'articles#update', constraints: { slug_or_id: /[^\/]+/ }
        delete 'articles/:slug_or_id', to: 'articles#destroy', constraints: { slug_or_id: /[^\/]+/ }
      end
      
      namespace :pledges do
        resources :pledges, only: [:index, :destroy] # Add this line
      end

      # General equity management
      namespace :equity do
        resources :campaigns, only: [] do
          collection do
            get :pending_review 
          end
          member do
            post :submit_for_approval
            post :approve
            post :reject
            post :launch
            post :close
          end
          
          resources :campaign_team_members, only: [:index, :create, :update, :destroy] do
            member do
              post :convert_to_user # Convert team member to user
            end
          end
        end
      end
    end
  end

  # Health check route
  get '/health', to: proc { [200, {}, ['OK']] }
  get 'up' => 'rails/health#show', as: :rails_health_check
  # Catch-all route for unmatched requests (must be the last route)
  match '*unmatched', to: 'application#not_found', via: :all
end