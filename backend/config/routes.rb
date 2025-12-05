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
            post :verify, to: 'premium_subscriptions#verify'
            delete :cancel
          end
        end
        
        # Premium Users Admin Routes
        resources :premium_users, only: [:index, :show] do
          collection do
            get 'stats'
          end
          member do
            post 'manually_extend'
            post 'revoke_premium'
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
            get :export
          end
        end
      end

      namespace :admin do
        resources :transfer_locks, only: [] do
          collection do
            get :index
            get :completed_campaigns  # NEW: Get completed campaigns with funds
          end
          member do
            post :lock
            post :unlock
            post :reset_campaign_transfers  # NEW: Reset specific campaign
            get :status
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
            get :archived_campaigns
          end
          member do
            patch 'cancel', to: 'campaigns#cancel_campaign'
            post :favorite
            delete :unfavorite
            post 'contact', to: 'campaigns#contact_fundraiser'
            get 'public_donations', to: 'donations#public_donations'
            post :archive
            delete :archive, to: 'campaigns#unarchive' # This points to BaseCampaignsController#unarchive
            get :archive_status
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
          member do
            post :cancel, to: 'investment_cancellations#create'
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

      # Dedicated reports namespace (not nested under members or admin)
      namespace :reports do
        resources :reports, only: [:index, :show, :create, :update] do
          collection do
            get 'my_reports'  # GET /api/v1/reports/reports/my_reports
            get 'stats'       # GET /api/v1/reports/reports/stats
          end
          member do
            patch :assign     # PATCH /api/v1/reports/reports/:id/assign
            patch :resolve    # PATCH /api/v1/reports/reports/:id/resolve
            patch :dismiss    # PATCH /api/v1/reports/reports/:id/dismiss
          end
        end
      end

      # Add AI routes
      namespace :ai_scoring do
        resources :deal_scoring, only: [] do
          collection do
            post :analyze
            get :analysis_history
            get :similar_deals
            get :dashboard_metrics
          end
        end
      end

      # Investment Clubs
      resources :investment_clubs, only: [:index, :create, :show, :update, :destroy], constraints: { id: /[a-zA-Z0-9\-]+/ } do
        # Membership management
        resources :memberships, only: [:index, :create, :update, :destroy], controller: 'club_memberships' do
          member do
            post :approve
            post :reject
            post :leave
          end
          collection do
            get :pending
            get :my_membership
            get :verification
          end
        end

        # Add share changes routes
        resources :share_changes, only: [:index], controller: 'member_share_changes' do
          # This endpoint can be removed as it's no longer needed
          collection do
            get :my_changes
          end
        end

        # Club operations
        resources :contributions, only: [:index, :create], controller: 'club_contributions' do
          collection do
            post :verify
          end
        end

        # Add club transfers routes
        resources :transfers, only: [], controller: 'club_transfers' do
          collection do
            post :create_transfer_recipient
            post :bulk_create_transfer_recipients
            get :get_bank_list
            get :list_transfer_recipients
            get :fetch_transfer_recipient
            get :resolve_account_details
            post :initialize_transfer
            post :finalize_transfer
            post :initiate_bulk_transfer
            get :fetch_transfers_from_paystack
            get :fetch_transfers
            get :fetch_club_transfers
            get :verify_transfer
            get :fetch_settlement_status
            post :approve_transfer
            put :update_transfer_recipient
          end
        end
        
        resources :investments, only: [:index, :create], controller: 'club_investments' do
          member do
            post :vote
            post :cancel
            get :ai_recommendation
            get :voting_insights
            post :start_voting
            # club investment certificate routes
            get :certificate_status
            post :generate_certificate
            get :download_certificate
          end
          collection do
            get :ai_recommendations # Add this line
            post :generate_proposals
          end
        end

        # UPDATED: Add delete action to approved campaigns routes
        resources :approved_campaigns, only: [:index, :show, :destroy], controller: 'approved_campaigns'
        
        member do
          get :portfolio
          get :analytics
          get :member_portfolio
          get :portfolio_insights
          get :financial_health
          get :predictive_analytics
          get :comprehensive_analytics
          post :join
          post :leave
          post :create_wallet
          get :my_membership_status
          post :transfer_ownership
          post :refresh
        end

        collection do
          get :my_clubs
          get :discover
        end
      end
    
      # Reusable voting system
      post 'votes/:votable_type/:votable_id', to: 'votes#create'
      get 'votes/:votable_type/:votable_id', to: 'votes#index'
      delete 'votes/:votable_type/:votable_id', to: 'votes#destroy'
    end
  end

  # Health check route
  get '/health', to: proc { [200, {}, ['OK']] }
  get 'up' => 'rails/health#show', as: :rails_health_check
  # Catch-all route for unmatched requests (must be the last route)
  match '*unmatched', to: 'application#not_found', via: :all
end