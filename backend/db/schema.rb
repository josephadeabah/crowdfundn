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

ActiveRecord::Schema[7.1].define(version: 2024_12_10_135354) do
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
    t.index ["fundraiser_id"], name: "index_campaigns_on_fundraiser_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "campaign_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_comments_on_campaign_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "donations", force: :cascade do |t|
    t.decimal "amount"
    t.bigint "campaign_id", null: false
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
    t.index ["campaign_id"], name: "index_donations_on_campaign_id"
    t.index ["status"], name: "index_donations_on_status"
    t.index ["user_id"], name: "index_donations_on_user_id"
  end

  create_table "fundraisers", force: :cascade do |t|
    t.string "name"
    t.string "contact_information"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_fundraisers_on_user_id"
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

  create_table "rewards", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.decimal "amount"
    t.string "image"
    t.bigint "campaign_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_rewards_on_campaign_id"
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
    t.bigint "user_id", null: false
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
    t.integer "duration_in_days"
    t.string "national_id"
    t.string "currency_symbol"
    t.string "phone_code"
    t.boolean "email_confirmed", default: false
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "campaigns", "users", column: "fundraiser_id"
  add_foreign_key "comments", "campaigns"
  add_foreign_key "comments", "users"
  add_foreign_key "donations", "campaigns"
  add_foreign_key "donations", "users"
  add_foreign_key "fundraisers", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "rewards", "campaigns"
  add_foreign_key "subaccounts", "campaigns"
  add_foreign_key "subaccounts", "users"
  add_foreign_key "subscriptions", "campaigns"
  add_foreign_key "subscriptions", "users"
  add_foreign_key "transfers", "campaigns"
  add_foreign_key "transfers", "users"
  add_foreign_key "updates", "campaigns"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
end
