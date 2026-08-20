# config/initializers/supabase.rb
require "supabase"

# Explicitly require the custom Active Storage service
require_relative "../../lib/active_storage/service/supabase_storage_service"

# Only load if environment variables are present
if ENV["SUPABASE_URL"].present? && ENV["SUPABASE_SERVICE_ROLE_KEY"].present?
  SUPABASE_URL = ENV.fetch("SUPABASE_URL")
  SUPABASE_SERVICE_KEY = ENV.fetch("SUPABASE_SERVICE_ROLE_KEY")
  SUPABASE_STORAGE_BUCKET = ENV.fetch("SUPABASE_STORAGE_BUCKET", "bantuhive-storage")
  
  $supabase_client = Supabase.create_client(
    supabase_url: SUPABASE_URL,
    supabase_key: SUPABASE_SERVICE_KEY
  )
  
  Rails.logger.info "✅ Supabase client initialized successfully"
  Rails.logger.info "✅ Supabase Storage Service loaded"
else
  Rails.logger.warn "⚠️ Supabase environment variables not set. Client not initialized."
end