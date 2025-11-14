# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_11_14_154304) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admin_actions", force: :cascade do |t|
    t.bigint "admin_user_id", null: false
    t.bigint "target_user_id", null: false
    t.bigint "campaign_id"
    t.string "action", null: false
    t.jsonb "metadata", default: {}
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["action"], name: "index_admin_actions_on_action"
    t.index ["admin_user_id"], name: "index_admin_actions_on_admin_user_id"
    t.index ["campaign_id"], name: "index_admin_actions_on_campaign_id"
    t.index ["created_at"], name: "index_admin_actions_on_created_at"
    t.index ["target_user_id"], name: "index_admin_actions_on_target_user_id"
  end

  create_table "approved_campaigns", force: :cascade do |t|
    t.bigint "investment_club_id", null: false
    t.bigint "campaign_id", null: false
    t.bigint "club_investment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_approved_campaigns_on_campaign_id"
    t.index ["club_investment_id"], name: "index_approved_campaigns_on_club_investment_id"
    t.index ["investment_club_id", "campaign_id"], name: "index_approved_campaigns_on_investment_club_id_and_campaign_id", unique: true
    t.index ["investment_club_id"], name: "index_approved_campaigns_on_investment_club_id"
  end

  create_table "archived_campaigns", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "campaign_id", null: false
    t.datetime "archived_at"
    t.text "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["archived_at"], name: "index_archived_campaigns_on_archived_at"
    t.index ["campaign_id"], name: "index_archived_campaigns_on_campaign_id"
    t.index ["user_id", "campaign_id"], name: "index_archived_campaigns_on_user_id_and_campaign_id", unique: true
    t.index ["user_id"], name: "index_archived_campaigns_on_user_id"
  end

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.string "slug"
    t.integer "status", default: 0
    t.integer "author_id"
    t.text "meta_description"
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.index ["author_id"], name: "index_articles_on_author_id"
    t.index ["slug"], name: "index_articles_on_slug", unique: true
  end

  create_table "backer_rewards", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "points_required"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "level"
    t.index ["user_id"], name: "index_backer_rewards_on_user_id"
  end

  create_table "campaign_shares", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "campaign_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_campaign_shares_on_campaign_id"
    t.index ["user_id"], name: "index_campaign_shares_on_user_id"
  end

  create_table "campaign_team_members", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.bigint "user_id"
    t.string "role"
    t.decimal "equity_percentage"
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.string "name"
    t.string "email"
    t.index ["campaign_id"], name: "index_campaign_team_members_on_campaign_id"
    t.index ["user_id"], name: "index_campaign_team_members_on_user_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.decimal "goal_amount"
    t.decimal "current_amount"
    t.datetime "start_date"
    t.datetime "end_date"
    t.string "category"
    t.string "location"
    t.string "currency"
    t.string "currency_code"
    t.string "currency_symbol"
    t.integer "status"
    t.bigint "fundraiser_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "media"
    t.boolean "accept_donations"
    t.boolean "leave_words_of_support"
    t.boolean "appear_in_search_results"
    t.boolean "suggested_fundraiser_lists"
    t.boolean "receive_donation_email"
    t.boolean "receive_daily_summary"
    t.boolean "is_public"
    t.boolean "enable_promotions"
    t.boolean "schedule_promotion"
    t.string "promotion_frequency"
    t.integer "promotion_duration"
    t.decimal "transferred_amount", default: "0.0", null: false
    t.decimal "total_successful_donations", precision: 15, scale: 2, default: "0.0", null: false
    t.string "type", default: "Campaign"
    t.decimal "valuation", precision: 15, scale: 2, default: "0.0", null: false
    t.decimal "equity_offered", precision: 5, scale: 2, default: "0.0", null: false
    t.decimal "minimum_investment", precision: 15, scale: 2, default: "0.0", null: false
    t.integer "equity_status"
    t.string "company_name"
    t.text "company_description"
    t.string "company_headquarters"
    t.string "company_website"
    t.string "contract_term"
    t.decimal "maximum_investment"
    t.string "slug", null: false
    t.integer "total_shares", default: 1000000
    t.decimal "equity_issued", precision: 5, scale: 2, default: "0.0"
    t.decimal "total_equity_invested", precision: 15, scale: 2, default: "0.0"
    t.integer "lock_version", default: 0
    t.decimal "shares_available", precision: 20, scale: 4, default: "0.0"
    t.decimal "minimum_target"
    t.decimal "price_per_share"
    t.integer "min_shares"
    t.integer "max_shares"
    t.integer "shares_offered"
    t.string "stock_type"
    t.string "funding_round"
    t.string "sec_filing_url"
    t.string "offering_circular_url"
    t.string "offering_memorandum"
    t.decimal "ai_deal_score", precision: 5, scale: 2
    t.decimal "ai_risk_score", precision: 5, scale: 2
    t.string "ai_risk_category"
    t.datetime "ai_analysis_updated_at"
    t.jsonb "ai_embedding"
    t.string "ai_sentiment"
    t.string "ai_team_assessment"
    t.string "ai_market_opportunity"
    t.index ["ai_deal_score"], name: "index_campaigns_on_ai_deal_score"
    t.index ["ai_embedding"], name: "index_campaigns_on_ai_embedding", using: :gin
    t.index ["ai_market_opportunity"], name: "index_campaigns_on_ai_market_opportunity"
    t.index ["ai_risk_category"], name: "index_campaigns_on_ai_risk_category"
    t.index ["ai_risk_score"], name: "index_campaigns_on_ai_risk_score"
    t.index ["ai_sentiment"], name: "index_campaigns_on_ai_sentiment"
    t.index ["ai_team_assessment"], name: "index_campaigns_on_ai_team_assessment"
    t.index ["category", "status"], name: "index_campaigns_on_category_and_status"
    t.index ["category"], name: "index_campaigns_on_category"
    t.index ["created_at"], name: "index_campaigns_on_created_at"
    t.index ["end_date"], name: "index_campaigns_on_end_date"
    t.index ["fundraiser_id"], name: "index_campaigns_on_fundraiser_id"
    t.index ["slug"], name: "index_campaigns_on_slug", unique: true
    t.index ["status", "end_date"], name: "index_campaigns_on_status_and_end_date"
    t.index ["status"], name: "index_campaigns_on_status"
    t.index ["type"], name: "index_campaigns_on_type"
  end

  create_table "club_investments", force: :cascade do |t|
    t.bigint "investment_club_id", null: false
    t.bigint "campaign_id", null: false
    t.decimal "investment_amount", precision: 15, scale: 2, null: false
    t.decimal "shares_acquired", precision: 20, scale: 4
    t.decimal "percentage_acquired", precision: 10, scale: 4
    t.string "status", default: "pending"
    t.string "voting_session_id"
    t.integer "yes_votes", default: 0
    t.integer "no_votes", default: 0
    t.decimal "approval_rate", precision: 5, scale: 2
    t.boolean "approved", default: false
    t.decimal "equity_percentage", precision: 10, scale: 4
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "proposed_share_percentage", precision: 5, scale: 2
    t.integer "created_by_id"
    t.index ["campaign_id"], name: "index_club_investments_on_campaign_id"
    t.index ["created_by_id"], name: "index_club_investments_on_created_by_id"
    t.index ["investment_club_id", "campaign_id"], name: "index_club_investments_on_investment_club_id_and_campaign_id", unique: true
    t.index ["investment_club_id"], name: "index_club_investments_on_investment_club_id"
    t.index ["status"], name: "index_club_investments_on_status"
    t.index ["voting_session_id"], name: "index_club_investments_on_voting_session_id"
  end

  create_table "club_transactions", force: :cascade do |t|
    t.bigint "investment_club_id", null: false
    t.bigint "club_investment_id"
    t.decimal "amount", null: false
    t.string "transaction_type", null: false
    t.string "status", default: "pending", null: false
    t.string "reference"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["club_investment_id"], name: "index_club_transactions_on_club_investment_id"
    t.index ["investment_club_id"], name: "index_club_transactions_on_investment_club_id"
    t.index ["reference"], name: "index_club_transactions_on_reference"
    t.index ["status"], name: "index_club_transactions_on_status"
    t.index ["transaction_type"], name: "index_club_transactions_on_transaction_type"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "campaign_id", null: false
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name"
    t.string "email"
    t.index ["campaign_id"], name: "index_comments_on_campaign_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "deal_score_logs", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.text "prompt", null: false
    t.text "response", null: false
    t.jsonb "analysis_data"
    t.decimal "risk_score", precision: 5, scale: 2
    t.decimal "deal_score", precision: 5, scale: 2
    t.string "risk_category"
    t.text "key_risks", default: [], array: true
    t.text "strengths", default: [], array: true
    t.text "recommendations", default: [], array: true
    t.string "analysis_type"
    t.datetime "analyzed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "metadata", default: {}
    t.index ["campaign_id", "analyzed_at"], name: "index_deal_score_logs_on_campaign_id_and_analyzed_at"
    t.index ["campaign_id"], name: "index_deal_score_logs_on_campaign_id"
    t.index ["deal_score"], name: "index_deal_score_logs_on_deal_score"
    t.index ["metadata"], name: "index_deal_score_logs_on_metadata", using: :gin
    t.index ["risk_score"], name: "index_deal_score_logs_on_risk_score"
  end

  create_table "donations", force: :cascade do |t|
    t.decimal "amount"
    t.bigint "user_id"
    t.string "status"
    t.string "transaction_reference"
    t.json "metadata"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name"
    t.string "email", default: "noemail@example.com", null: false
    t.string "phone"
    t.decimal "gross_amount", precision: 15, scale: 2, default: "0.0", null: false
    t.decimal "net_amount", precision: 15, scale: 2, default: "0.0", null: false
    t.string "plan"
    t.string "subscription_code"
    t.decimal "platform_fee", precision: 10, scale: 2, default: "0.0"
    t.integer "reward_id"
    t.boolean "processed", default: false, null: false
    t.string "ip_address"
    t.string "country"
    t.bigint "campaign_id"
    t.boolean "anonymous"
    t.index ["status"], name: "index_donations_on_status"
    t.index ["user_id"], name: "index_donations_on_user_id"
  end

  create_table "equity_investments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "campaign_id", null: false
    t.decimal "amount", precision: 12, scale: 2
    t.decimal "shares", precision: 20, scale: 4
    t.decimal "percentage", precision: 10, scale: 8
    t.string "certificate_number"
    t.date "investment_date"
    t.string "transaction_reference"
    t.jsonb "metadata", default: {}
    t.string "status", default: "pending"
    t.string "email", default: "noemail@example.com", null: false
    t.string "full_name"
    t.string "phone"
    t.string "country"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "gross_amount", precision: 15, scale: 2, default: "0.0", null: false
    t.decimal "net_amount", precision: 15, scale: 2, default: "0.0", null: false
    t.string "plan"
    t.string "subscription_code"
    t.decimal "platform_fee", precision: 10, scale: 2, default: "0.0"
    t.boolean "processed", default: false, null: false
    t.integer "reward_id"
    t.string "subaccount_code"
    t.decimal "current_value", default: "0.0"
    t.decimal "processing_fee", precision: 15, scale: 2, default: "0.0", null: false
    t.datetime "committed_at"
    t.datetime "cancel_window_expires_at"
    t.text "cancellation_reason"
    t.datetime "cancelled_at"
    t.index ["campaign_id", "id"], name: "index_equity_investments_on_campaign_id_and_id", where: "((status)::text = 'successful'::text)"
    t.index ["campaign_id", "status"], name: "index_equity_investments_on_campaign_and_successful", where: "((status)::text = 'successful'::text)"
    t.index ["campaign_id"], name: "index_equity_investments_on_campaign_id"
    t.index ["status"], name: "index_equity_investments_on_status"
    t.index ["subaccount_code"], name: "index_equity_investments_on_subaccount_code"
    t.index ["subscription_code"], name: "index_equity_investments_on_subscription_code", unique: true
    t.index ["user_id"], name: "index_equity_investments_on_user_id"
  end

  create_table "event_processeds", force: :cascade do |t|
    t.string "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_processeds_on_event_id", unique: true
  end

  create_table "failed_donation_attempts", force: :cascade do |t|
    t.string "transaction_reference", null: false
    t.json "payload"
    t.json "metadata"
    t.json "error_messages"
    t.string "status"
    t.boolean "resolved", default: false
    t.datetime "resolved_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resolved"], name: "index_failed_donation_attempts_on_resolved"
    t.index ["status"], name: "index_failed_donation_attempts_on_status"
    t.index ["transaction_reference"], name: "index_failed_donation_attempts_on_transaction_reference"
  end

  create_table "favorites", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "campaign_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_favorites_on_campaign_id"
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "fundraiser_leaderboard_entries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.decimal "total_raised"
    t.integer "ranking"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_fundraiser_leaderboard_entries_on_user_id"
  end

  create_table "fundraisers", force: :cascade do |t|
    t.string "name"
    t.string "contact_information"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_fundraisers_on_user_id"
  end

  create_table "investment_club_contributions", force: :cascade do |t|
    t.bigint "investment_club_id", null: false
    t.bigint "user_id", null: false
    t.decimal "amount", precision: 15, scale: 2, null: false
    t.string "currency", default: "USD"
    t.string "status", default: "pending"
    t.string "transaction_reference"
    t.string "payment_method"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "paystack_fee", precision: 10, scale: 2, default: "0.0"
    t.decimal "amount_settled", precision: 10, scale: 2
    t.datetime "processed_at"
    t.index ["investment_club_id"], name: "index_investment_club_contributions_on_investment_club_id"
    t.index ["status"], name: "index_investment_club_contributions_on_status"
    t.index ["transaction_reference"], name: "index_investment_club_contributions_on_transaction_reference", unique: true
    t.index ["user_id"], name: "index_investment_club_contributions_on_user_id"
  end

  create_table "investment_club_memberships", force: :cascade do |t|
    t.bigint "investment_club_id", null: false
    t.bigint "user_id", null: false
    t.string "role", default: "member"
    t.string "status", default: "pending"
    t.decimal "total_contributed", precision: 15, scale: 2, default: "0.0"
    t.decimal "contributed_share", precision: 10, scale: 4, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["investment_club_id", "user_id"], name: "index_club_memberships_on_club_and_user", unique: true
    t.index ["investment_club_id"], name: "index_investment_club_memberships_on_investment_club_id"
    t.index ["user_id"], name: "index_investment_club_memberships_on_user_id"
  end

  create_table "investment_clubs", force: :cascade do |t|
    t.string "name", null: false
    t.text "mission"
    t.decimal "minimum_monthly_contribution", precision: 15, scale: 2, default: "0.0", null: false
    t.string "investment_focus"
    t.integer "max_members", default: 50, null: false
    t.string "access_type", default: "private"
    t.string "status", default: "active"
    t.bigint "creator_id", null: false
    t.string "slug", null: false
    t.decimal "total_contributions", precision: 15, scale: 2, default: "0.0"
    t.decimal "total_invested", precision: 15, scale: 2, default: "0.0"
    t.decimal "current_balance", precision: 15, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "constitution_data"
    t.integer "current_members_count", default: 0, null: false
    t.string "currency", default: "GHS"
    t.index ["creator_id"], name: "index_investment_clubs_on_creator_id"
    t.index ["slug"], name: "index_investment_clubs_on_slug", unique: true
    t.index ["status"], name: "index_investment_clubs_on_status"
  end

  create_table "investor_documents", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "document_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "campaign_id", null: false
    t.index ["campaign_id"], name: "index_investor_documents_on_campaign_id"
    t.index ["user_id", "campaign_id", "document_type"], name: "index_investor_docs_on_user_campaign_and_type"
    t.index ["user_id"], name: "index_investor_documents_on_user_id"
  end

  create_table "kyc_addresses", force: :cascade do |t|
    t.bigint "kyc_id", null: false
    t.string "address_type", null: false
    t.string "street"
    t.string "city"
    t.string "state"
    t.string "postal_code"
    t.string "country"
    t.boolean "is_primary", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kyc_id", "address_type"], name: "index_kyc_addresses_on_kyc_id_and_address_type", unique: true
    t.index ["kyc_id"], name: "index_kyc_addresses_on_kyc_id"
  end

  create_table "kyc_documents", force: :cascade do |t|
    t.bigint "kyc_id", null: false
    t.string "document_type", null: false
    t.string "file_name"
    t.string "verification_status", default: "pending"
    t.text "rejection_reason"
    t.datetime "verified_at"
    t.bigint "verified_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["document_type"], name: "index_kyc_documents_on_document_type"
    t.index ["kyc_id", "document_type"], name: "index_kyc_documents_on_kyc_id_and_document_type", unique: true
    t.index ["kyc_id"], name: "index_kyc_documents_on_kyc_id"
  end

  create_table "kycs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "verified_by_id"
    t.string "reference"
    t.string "kyc_type", default: "investor", null: false
    t.string "status", default: "pending", null: false
    t.string "verification_type", null: false
    t.string "id_number", null: false
    t.date "id_expiry_date", null: false
    t.text "rejection_reason"
    t.datetime "verified_at"
    t.json "signature_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "investor_signature_data"
    t.boolean "issuer_accepted_terms", default: false
    t.datetime "signature_completed_at"
    t.datetime "issuer_signature_completed_at"
    t.date "date_of_birth"
    t.string "nationality"
    t.string "occupation"
    t.string "source_of_funds"
    t.integer "risk_level", default: 0
    t.string "business_name"
    t.string "business_registration_number"
    t.string "business_tax_id"
    t.string "business_industry"
    t.date "business_established_date"
    t.date "next_review_date"
    t.text "review_notes"
    t.json "issuer_signature_data"
    t.datetime "superseded_at"
    t.string "superseded_by_type"
    t.string "upgraded_from_type"
    t.boolean "is_upgrade", default: false
    t.boolean "accredited_investor"
    t.boolean "nominee_agreement_accepted"
    t.boolean "risk_acknowledgment"
    t.boolean "terms_accepted"
    t.boolean "data_consent"
    t.index ["business_name"], name: "index_kycs_on_business_name"
    t.index ["business_registration_number"], name: "index_kycs_on_business_registration_number"
    t.index ["business_tax_id"], name: "index_kycs_on_business_tax_id"
    t.index ["created_at"], name: "index_kycs_on_created_at"
    t.index ["id_number"], name: "index_kycs_on_id_number", unique: true
    t.index ["kyc_type"], name: "index_kycs_on_kyc_type"
    t.index ["reference"], name: "index_kycs_on_reference", unique: true
    t.index ["status", "kyc_type"], name: "index_kycs_on_status_and_kyc_type"
    t.index ["status"], name: "index_kycs_on_status"
    t.index ["user_id", "status"], name: "index_kycs_on_user_id_and_status"
    t.index ["user_id"], name: "index_kycs_on_user_id"
    t.index ["verified_by_id"], name: "index_kycs_on_verified_by_id"
  end

  create_table "leaderboard_entries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "points"
    t.integer "ranking"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_leaderboard_entries_on_user_id"
  end

  create_table "member_investment_shares", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "club_investment_id", null: false
    t.decimal "share_percentage", precision: 10, scale: 4, default: "0.0"
    t.decimal "effective_shares", precision: 15, scale: 6, default: "0.0"
    t.decimal "investment_value", precision: 15, scale: 2, default: "0.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["club_investment_id"], name: "index_member_investment_shares_on_club_investment_id"
    t.index ["user_id", "club_investment_id"], name: "index_member_shares_on_user_and_investment", unique: true
    t.index ["user_id"], name: "index_member_investment_shares_on_user_id"
  end

  create_table "member_share_changes", force: :cascade do |t|
    t.bigint "investment_club_membership_id", null: false
    t.bigint "investment_club_contribution_id"
    t.decimal "previous_share", precision: 8, scale: 4, null: false
    t.decimal "new_share", precision: 8, scale: 4, null: false
    t.decimal "change_amount", precision: 8, scale: 4, null: false
    t.decimal "total_contributions_at_time", precision: 12, scale: 2
    t.string "change_reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_member_share_changes_on_created_at"
    t.index ["investment_club_contribution_id"], name: "index_member_share_changes_on_investment_club_contribution_id"
    t.index ["investment_club_membership_id", "created_at"], name: "index_share_changes_on_membership_and_created_at"
    t.index ["investment_club_membership_id"], name: "index_member_share_changes_on_investment_club_membership_id"
  end

  create_table "pledges", force: :cascade do |t|
    t.bigint "donation_id"
    t.bigint "reward_id", null: false
    t.decimal "amount", default: "0.0", null: false
    t.string "status", default: "pending", null: false
    t.string "shipping_status", default: "not_shipped", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "shipping_data", default: {}
    t.jsonb "selected_rewards", default: []
    t.string "delivery_option"
    t.integer "user_id"
    t.bigint "equity_investment_id"
    t.string "campaign_type"
    t.bigint "campaign_id"
    t.index ["donation_id"], name: "index_pledges_on_donation_id"
    t.index ["equity_investment_id"], name: "index_pledges_on_equity_investment_id"
    t.index ["reward_id"], name: "index_pledges_on_reward_id"
  end

  create_table "points", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "donation_id"
    t.integer "amount"
    t.string "reason"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "equity_investment_id"
    t.index ["donation_id"], name: "index_points_on_donation_id"
    t.index ["equity_investment_id"], name: "index_points_on_equity_investment_id"
    t.index ["user_id"], name: "index_points_on_user_id"
  end

  create_table "premium_plans", force: :cascade do |t|
    t.string "name", null: false
    t.string "paystack_plan_code"
    t.decimal "price", precision: 10, scale: 2, null: false
    t.string "currency", default: "GHS"
    t.string "interval", null: false
    t.text "description"
    t.jsonb "features", default: {}
    t.boolean "active", default: true
    t.integer "trial_period_days", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["paystack_plan_code"], name: "index_premium_plans_on_paystack_plan_code", unique: true
  end

  create_table "premium_subscriptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.string "transaction_reference", null: false
    t.string "plan_name"
    t.datetime "expires_at"
    t.string "status", default: "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "premium_plan_id"
    t.string "paystack_subscription_code"
    t.datetime "start_date"
    t.datetime "end_date"
    t.datetime "next_payment_date"
    t.boolean "auto_renew", default: true
    t.string "payment_method"
    t.string "currency", default: "GHS"
    t.string "paystack_email_token"
    t.string "interval"
    t.index ["paystack_subscription_code"], name: "index_premium_subscriptions_on_paystack_subscription_code", unique: true
    t.index ["premium_plan_id"], name: "index_premium_subscriptions_on_premium_plan_id"
    t.index ["status"], name: "index_premium_subscriptions_on_status"
    t.index ["transaction_reference"], name: "index_premium_subscriptions_on_transaction_reference", unique: true
    t.index ["user_id"], name: "index_premium_subscriptions_on_user_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name"
    t.text "description"
    t.decimal "funding_goal"
    t.decimal "amount_raised"
    t.date "end_date"
    t.string "category"
    t.string "location"
    t.string "avatar"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "reports", force: :cascade do |t|
    t.integer "report_type", null: false
    t.text "description", null: false
    t.integer "status", default: 0
    t.integer "priority", default: 0
    t.bigint "campaign_id"
    t.bigint "reported_user_id"
    t.bigint "reporter_id", null: false
    t.bigint "assigned_admin_id"
    t.text "action_taken"
    t.text "resolution_notes"
    t.datetime "resolved_at"
    t.json "evidence_links"
    t.string "contact_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_admin_id"], name: "index_reports_on_assigned_admin_id"
    t.index ["campaign_id", "status"], name: "index_reports_on_campaign_id_and_status"
    t.index ["campaign_id"], name: "index_reports_on_campaign_id"
    t.index ["created_at"], name: "index_reports_on_created_at"
    t.index ["priority"], name: "index_reports_on_priority"
    t.index ["report_type"], name: "index_reports_on_report_type"
    t.index ["reported_user_id", "status"], name: "index_reports_on_reported_user_id_and_status"
    t.index ["reported_user_id"], name: "index_reports_on_reported_user_id"
    t.index ["reporter_id"], name: "index_reports_on_reporter_id"
    t.index ["status"], name: "index_reports_on_status"
  end

  create_table "rewards", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.decimal "amount"
    t.string "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "invoice_data"
    t.jsonb "shipping_info"
    t.string "campaign_type"
    t.bigint "campaign_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "subaccounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "subaccount_code"
    t.string "subaccount_bank_code"
    t.string "business_name"
    t.string "bank_code"
    t.string "account_number"
    t.decimal "percentage_charge"
    t.string "description"
    t.jsonb "metadata", default: {}
    t.string "settlement_bank"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "authorization_code"
    t.string "card_type"
    t.string "last4"
    t.string "exp_month"
    t.string "exp_year"
    t.string "bank"
    t.string "brand"
    t.boolean "reusable"
    t.string "subaccount_type"
    t.string "recipient_code"
    t.string "transfer_code"
    t.integer "amount"
    t.string "status", default: "pending"
    t.string "failure_reason"
    t.datetime "completed_at"
    t.datetime "reversed_at"
    t.bigint "campaign_id"
    t.string "reference"
    t.index ["campaign_id"], name: "index_subaccounts_on_campaign_id"
    t.index ["user_id"], name: "index_subaccounts_on_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "campaign_id", null: false
    t.string "subscription_code"
    t.string "email_token"
    t.string "status", default: "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "interval"
    t.string "card_type"
    t.string "last4"
    t.datetime "next_payment_date"
    t.string "plan_code"
    t.string "email"
    t.decimal "amount"
    t.string "subscriber_name"
    t.index ["campaign_id"], name: "index_subscriptions_on_campaign_id"
    t.index ["subscription_code"], name: "index_subscriptions_on_subscription_code", unique: true
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "transfers", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "campaign_id"
    t.string "bank_name"
    t.string "account_number"
    t.decimal "amount"
    t.string "transfer_code"
    t.string "failure_reason"
    t.datetime "completed_at"
    t.datetime "reversed_at"
    t.string "reference"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "recipient_code"
    t.string "status", default: "pending", null: false
    t.string "reason"
    t.string "currency"
    t.string "email"
    t.string "user_name"
    t.index ["campaign_id"], name: "index_transfers_on_campaign_id"
    t.index ["status"], name: "index_transfers_on_status"
    t.index ["user_id"], name: "index_transfers_on_user_id"
  end

  create_table "updates", force: :cascade do |t|
    t.text "content"
    t.bigint "campaign_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_updates_on_campaign_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.boolean "admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name"
    t.string "phone_number"
    t.string "country"
    t.string "payment_method"
    t.string "mobile_money_provider"
    t.string "currency"
    t.date "birth_date"
    t.string "category"
    t.decimal "target_amount"
    t.string "currency_symbol"
    t.string "phone_code"
    t.boolean "email_confirmed", default: false
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "subaccount_id"
    t.integer "sign_in_count", default: 0
    t.datetime "last_sign_in_at"
    t.string "status", default: "active"
    t.decimal "net_worth", precision: 15, scale: 2, default: "0.0"
    t.decimal "annual_income", precision: 15, scale: 2, default: "0.0"
    t.string "tax_id"
    t.boolean "premium_access", default: false
    t.datetime "premium_expires_at"
    t.string "user_type", default: "individual"
    t.bigint "premium_plan_id"
    t.string "premium_subscription_id"
    t.boolean "premium_auto_renew", default: true
    t.boolean "transfer_locked", default: false
    t.text "transfer_locked_reason"
    t.datetime "transfer_locked_at"
    t.bigint "transfer_locked_by"
    t.datetime "last_transfer_reset_at"
    t.decimal "total_transferred_amount", precision: 15, scale: 2, default: "0.0"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["premium_plan_id"], name: "index_users_on_premium_plan_id"
    t.index ["subaccount_id"], name: "index_users_on_subaccount_id"
  end

  create_table "votes", force: :cascade do |t|
    t.string "votable_type", null: false
    t.bigint "votable_id", null: false
    t.bigint "user_id", null: false
    t.string "vote_type", null: false
    t.text "reason"
    t.string "voting_session_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_votes_on_user_id"
    t.index ["votable_type", "votable_id", "user_id", "voting_session_id"], name: "index_votes_on_votable_and_user_and_session", unique: true
    t.index ["votable_type", "votable_id"], name: "index_votes_on_votable"
    t.index ["voting_session_id"], name: "index_votes_on_voting_session_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "admin_actions", "campaigns"
  add_foreign_key "admin_actions", "users", column: "admin_user_id"
  add_foreign_key "admin_actions", "users", column: "target_user_id"
  add_foreign_key "approved_campaigns", "campaigns"
  add_foreign_key "approved_campaigns", "club_investments"
  add_foreign_key "approved_campaigns", "investment_clubs"
  add_foreign_key "archived_campaigns", "campaigns"
  add_foreign_key "archived_campaigns", "users"
  add_foreign_key "backer_rewards", "users"
  add_foreign_key "campaign_shares", "campaigns"
  add_foreign_key "campaign_shares", "users"
  add_foreign_key "campaign_team_members", "campaigns"
  add_foreign_key "campaign_team_members", "users"
  add_foreign_key "campaigns", "users", column: "fundraiser_id"
  add_foreign_key "club_investments", "users", column: "created_by_id"
  add_foreign_key "club_transactions", "club_investments"
  add_foreign_key "club_transactions", "investment_clubs"
  add_foreign_key "comments", "campaigns"
  add_foreign_key "comments", "users"
  add_foreign_key "deal_score_logs", "campaigns"
  add_foreign_key "donations", "campaigns"
  add_foreign_key "donations", "users"
  add_foreign_key "equity_investments", "campaigns"
  add_foreign_key "equity_investments", "users"
  add_foreign_key "favorites", "campaigns"
  add_foreign_key "favorites", "users"
  add_foreign_key "fundraiser_leaderboard_entries", "users"
  add_foreign_key "fundraisers", "users"
  add_foreign_key "investment_clubs", "users", column: "creator_id"
  add_foreign_key "investor_documents", "campaigns"
  add_foreign_key "investor_documents", "users"
  add_foreign_key "kyc_addresses", "kycs"
  add_foreign_key "kyc_documents", "kycs"
  add_foreign_key "kycs", "users"
  add_foreign_key "kycs", "users", column: "verified_by_id"
  add_foreign_key "leaderboard_entries", "users"
  add_foreign_key "member_investment_shares", "club_investments"
  add_foreign_key "member_investment_shares", "users"
  add_foreign_key "member_share_changes", "investment_club_contributions"
  add_foreign_key "member_share_changes", "investment_club_memberships"
  add_foreign_key "pledges", "donations"
  add_foreign_key "pledges", "rewards"
  add_foreign_key "points", "donations"
  add_foreign_key "points", "equity_investments"
  add_foreign_key "points", "users"
  add_foreign_key "premium_subscriptions", "premium_plans"
  add_foreign_key "premium_subscriptions", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "reports", "campaigns"
  add_foreign_key "reports", "users", column: "assigned_admin_id"
  add_foreign_key "reports", "users", column: "reported_user_id"
  add_foreign_key "reports", "users", column: "reporter_id"
  add_foreign_key "subaccounts", "campaigns"
  add_foreign_key "subaccounts", "users"
  add_foreign_key "subscriptions", "campaigns"
  add_foreign_key "subscriptions", "users"
  add_foreign_key "transfers", "campaigns"
  add_foreign_key "transfers", "users"
  add_foreign_key "updates", "campaigns"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
  add_foreign_key "users", "premium_plans"
  add_foreign_key "users", "users", column: "transfer_locked_by"
end
