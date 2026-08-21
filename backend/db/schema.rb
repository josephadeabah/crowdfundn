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

ActiveRecord::Schema[7.1].define(version: 2026_08_21_101446) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

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
    t.string "level"
    t.integer "points_required"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_backer_rewards_on_user_id"
  end

  create_table "campaign_kpis", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.string "kpi_type", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "unit"
    t.decimal "target_value", precision: 20, scale: 4
    t.string "target_period"
    t.boolean "is_primary", default: false
    t.boolean "is_public", default: false
    t.integer "display_order", default: 0
    t.jsonb "calculation_config", default: {}
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id", "kpi_type"], name: "index_campaign_kpis_on_campaign_id_and_kpi_type"
    t.index ["campaign_id", "slug"], name: "index_campaign_kpis_on_campaign_id_and_slug", unique: true
    t.index ["campaign_id"], name: "index_campaign_kpis_on_campaign_id"
    t.index ["is_primary"], name: "index_campaign_kpis_on_is_primary"
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
    t.string "seo_title"
    t.string "seo_description"
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
    t.string "reference"
    t.decimal "shares", precision: 20, scale: 4
    t.decimal "percentage", precision: 10, scale: 6
    t.date "investment_date"
    t.string "certificate_number"
    t.string "transaction_reference"
    t.integer "equity_investment_id"
    t.decimal "current_value", precision: 15, scale: 2
    t.text "notes"
    t.datetime "committed_at"
    t.datetime "cancel_window_expires_at"
    t.text "cancellation_reason"
    t.datetime "canceled_at"
    t.datetime "finalized_at"
    t.index ["campaign_id"], name: "index_club_investments_on_campaign_id"
    t.index ["cancel_window_expires_at"], name: "index_club_investments_on_cancel_window_expires_at"
    t.index ["canceled_at"], name: "index_club_investments_on_canceled_at"
    t.index ["certificate_number"], name: "index_club_investments_on_certificate_number", unique: true
    t.index ["committed_at"], name: "index_club_investments_on_committed_at"
    t.index ["created_by_id"], name: "index_club_investments_on_created_by_id"
    t.index ["equity_investment_id"], name: "index_club_investments_on_equity_investment_id"
    t.index ["finalized_at"], name: "index_club_investments_on_finalized_at"
    t.index ["investment_club_id", "campaign_id"], name: "index_club_investments_on_investment_club_id_and_campaign_id"
    t.index ["investment_club_id"], name: "index_club_investments_on_investment_club_id"
    t.index ["reference"], name: "index_club_investments_on_reference", unique: true
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

  create_table "club_transfers", force: :cascade do |t|
    t.bigint "investment_club_id", null: false
    t.bigint "user_id", null: false
    t.decimal "amount", precision: 15, scale: 2, null: false
    t.string "currency", default: "GHS", null: false
    t.string "status", default: "pending", null: false
    t.text "reason"
    t.string "failure_reason"
    t.string "transfer_code"
    t.string "reference"
    t.string "recipient_code"
    t.string "account_name"
    t.string "account_number"
    t.string "bank_name"
    t.datetime "completed_at"
    t.datetime "reversed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_club_transfers_on_created_at"
    t.index ["investment_club_id", "created_at"], name: "index_club_transfers_on_investment_club_id_and_created_at"
    t.index ["investment_club_id"], name: "index_club_transfers_on_investment_club_id"
    t.index ["reference"], name: "index_club_transfers_on_reference", unique: true
    t.index ["status"], name: "index_club_transfers_on_status"
    t.index ["transfer_code"], name: "index_club_transfers_on_transfer_code", unique: true
    t.index ["user_id"], name: "index_club_transfers_on_user_id"
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

  create_table "deal_room_conversations", force: :cascade do |t|
    t.bigint "deal_room_id", null: false
    t.bigint "user_id", null: false
    t.string "title"
    t.boolean "private"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_id"], name: "index_deal_room_conversations_on_deal_room_id"
    t.index ["private"], name: "index_deal_room_conversations_on_private"
    t.index ["user_id"], name: "index_deal_room_conversations_on_user_id"
  end

  create_table "deal_room_documents", force: :cascade do |t|
    t.bigint "deal_room_id", null: false
    t.bigint "user_id", null: false
    t.string "title"
    t.string "document_type"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_id"], name: "index_deal_room_documents_on_deal_room_id"
    t.index ["document_type"], name: "index_deal_room_documents_on_document_type"
    t.index ["user_id"], name: "index_deal_room_documents_on_user_id"
  end

  create_table "deal_room_meeting_participants", force: :cascade do |t|
    t.bigint "deal_room_meeting_id", null: false
    t.bigint "user_id", null: false
    t.string "role"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_meeting_id", "user_id"], name: "index_meeting_participants_on_meeting_and_user", unique: true
    t.index ["deal_room_meeting_id"], name: "index_deal_room_meeting_participants_on_deal_room_meeting_id"
    t.index ["role"], name: "index_deal_room_meeting_participants_on_role"
    t.index ["status"], name: "index_deal_room_meeting_participants_on_status"
    t.index ["user_id"], name: "index_deal_room_meeting_participants_on_user_id"
  end

  create_table "deal_room_meetings", force: :cascade do |t|
    t.bigint "deal_room_id", null: false
    t.bigint "organizer_id", null: false
    t.string "title"
    t.text "description"
    t.string "meeting_type"
    t.string "status"
    t.datetime "start_time"
    t.datetime "end_time"
    t.string "meeting_link"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_id"], name: "index_deal_room_meetings_on_deal_room_id"
    t.index ["meeting_type"], name: "index_deal_room_meetings_on_meeting_type"
    t.index ["organizer_id"], name: "index_deal_room_meetings_on_organizer_id"
    t.index ["start_time"], name: "index_deal_room_meetings_on_start_time"
    t.index ["status"], name: "index_deal_room_meetings_on_status"
  end

  create_table "deal_room_memberships", force: :cascade do |t|
    t.bigint "deal_room_id", null: false
    t.bigint "user_id", null: false
    t.string "role"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_id", "user_id"], name: "index_deal_room_memberships_on_deal_room_id_and_user_id", unique: true
    t.index ["deal_room_id"], name: "index_deal_room_memberships_on_deal_room_id"
    t.index ["role"], name: "index_deal_room_memberships_on_role"
    t.index ["status"], name: "index_deal_room_memberships_on_status"
    t.index ["user_id"], name: "index_deal_room_memberships_on_user_id"
  end

  create_table "deal_room_message_reads", force: :cascade do |t|
    t.bigint "deal_room_message_id", null: false
    t.bigint "user_id", null: false
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_message_id", "user_id"], name: "index_message_reads_on_message_and_user", unique: true
    t.index ["deal_room_message_id"], name: "index_deal_room_message_reads_on_deal_room_message_id"
    t.index ["user_id"], name: "index_deal_room_message_reads_on_user_id"
  end

  create_table "deal_room_messages", force: :cascade do |t|
    t.bigint "deal_room_conversation_id", null: false
    t.bigint "user_id", null: false
    t.text "content"
    t.string "message_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_deal_room_messages_on_created_at"
    t.index ["deal_room_conversation_id"], name: "index_deal_room_messages_on_deal_room_conversation_id"
    t.index ["message_type"], name: "index_deal_room_messages_on_message_type"
    t.index ["user_id"], name: "index_deal_room_messages_on_user_id"
  end

  create_table "deal_rooms", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.bigint "user_id", null: false
    t.string "name"
    t.text "description"
    t.string "room_type"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_deal_rooms_on_campaign_id"
    t.index ["room_type"], name: "index_deal_rooms_on_room_type"
    t.index ["status"], name: "index_deal_rooms_on_status"
    t.index ["user_id"], name: "index_deal_rooms_on_user_id"
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
    t.string "email", default: "", null: false
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
    t.bigint "user_id"
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
    t.bigint "club_investment_id"
    t.index ["campaign_id", "id"], name: "index_equity_investments_on_campaign_id_and_id", where: "((status)::text = 'successful'::text)"
    t.index ["campaign_id", "status"], name: "index_equity_investments_on_campaign_and_successful", where: "((status)::text = 'successful'::text)"
    t.index ["campaign_id"], name: "index_equity_investments_on_campaign_id"
    t.index ["club_investment_id"], name: "index_equity_investments_on_club_investment_id"
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

  create_table "expertise_tags", force: :cascade do |t|
    t.string "name", null: false
    t.string "category"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_expertise_tags_on_category"
    t.index ["name"], name: "index_expertise_tags_on_name", unique: true
  end

  create_table "external_meeting_invitations", force: :cascade do |t|
    t.bigint "deal_room_meeting_id", null: false
    t.string "email", null: false
    t.string "token", null: false
    t.string "status", default: "pending"
    t.datetime "accepted_at"
    t.datetime "declined_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_room_meeting_id", "email"], name: "index_external_invites_on_meeting_and_email", unique: true
    t.index ["deal_room_meeting_id"], name: "index_external_meeting_invitations_on_deal_room_meeting_id"
    t.index ["token"], name: "index_external_meeting_invitations_on_token", unique: true
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

  create_table "financial_statements", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.string "period_type", null: false
    t.date "period_start", null: false
    t.date "period_end", null: false
    t.decimal "revenue", precision: 20, scale: 2, default: "0.0"
    t.decimal "expenses", precision: 20, scale: 2, default: "0.0"
    t.decimal "gross_profit", precision: 20, scale: 2, default: "0.0"
    t.decimal "net_income", precision: 20, scale: 2, default: "0.0"
    t.decimal "cash_flow", precision: 20, scale: 2, default: "0.0"
    t.decimal "assets", precision: 20, scale: 2, default: "0.0"
    t.decimal "liabilities", precision: 20, scale: 2, default: "0.0"
    t.decimal "equity", precision: 20, scale: 2, default: "0.0"
    t.decimal "burn_rate", precision: 20, scale: 2, default: "0.0"
    t.decimal "runway_months", precision: 5, scale: 2, default: "0.0"
    t.decimal "mrr", precision: 20, scale: 2, default: "0.0"
    t.decimal "arr", precision: 20, scale: 2, default: "0.0"
    t.decimal "customer_acquisition_cost", precision: 10, scale: 2, default: "0.0"
    t.decimal "lifetime_value", precision: 10, scale: 2, default: "0.0"
    t.decimal "churn_rate", precision: 5, scale: 4, default: "0.0"
    t.decimal "gmv", precision: 20, scale: 2, default: "0.0"
    t.integer "active_customers"
    t.decimal "average_order_value", precision: 10, scale: 2, default: "0.0"
    t.string "status", default: "draft"
    t.boolean "is_public", default: false
    t.datetime "published_at"
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "published_by_id"
    t.integer "download_count", default: 0, null: false
    t.index ["campaign_id", "period_type", "period_start"], name: "idx_financial_statements_campaign_period", unique: true
    t.index ["campaign_id"], name: "index_financial_statements_on_campaign_id"
    t.index ["download_count"], name: "index_financial_statements_on_download_count"
    t.index ["published_at"], name: "index_financial_statements_on_published_at"
    t.index ["published_by_id"], name: "index_financial_statements_on_published_by_id"
    t.index ["status"], name: "index_financial_statements_on_status"
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

  create_table "investor_portfolio_metrics", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "campaign_id"
    t.bigint "equity_investment_id"
    t.decimal "total_invested", precision: 20, scale: 2, default: "0.0"
    t.decimal "current_value", precision: 20, scale: 2, default: "0.0"
    t.decimal "total_returns", precision: 20, scale: 2, default: "0.0"
    t.decimal "roi", precision: 10, scale: 2, default: "0.0"
    t.decimal "moic", precision: 10, scale: 2, default: "0.0"
    t.decimal "irr", precision: 10, scale: 2, default: "0.0"
    t.decimal "portfolio_concentration", precision: 5, scale: 4, default: "0.0"
    t.decimal "volatility", precision: 5, scale: 4, default: "0.0"
    t.decimal "sharpe_ratio", precision: 5, scale: 4, default: "0.0"
    t.string "risk_category"
    t.date "calculation_date", null: false
    t.string "period"
    t.jsonb "breakdown", default: {}
    t.jsonb "trend_data", default: {}
    t.jsonb "benchmarks", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["calculation_date"], name: "index_investor_portfolio_metrics_on_calculation_date"
    t.index ["campaign_id"], name: "index_investor_portfolio_metrics_on_campaign_id"
    t.index ["equity_investment_id"], name: "index_investor_portfolio_metrics_on_equity_investment_id"
    t.index ["user_id", "calculation_date", "campaign_id"], name: "idx_investor_metrics_user_date_campaign", unique: true
    t.index ["user_id", "period"], name: "index_investor_portfolio_metrics_on_user_id_and_period"
    t.index ["user_id"], name: "index_investor_portfolio_metrics_on_user_id"
  end

  create_table "investor_report_documents", force: :cascade do |t|
    t.bigint "investor_report_id", null: false
    t.string "document_type", null: false
    t.string "title"
    t.text "description"
    t.string "file_format"
    t.integer "file_size"
    t.string "language", default: "en"
    t.boolean "is_public", default: false
    t.integer "download_count", default: 0
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["investor_report_id", "document_type"], name: "idx_report_documents_report_type", unique: true
    t.index ["investor_report_id"], name: "index_investor_report_documents_on_investor_report_id"
  end

