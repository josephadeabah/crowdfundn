# Set port to match DigitalOcean's expected port (8080)
port ENV.fetch("PORT") { 8080 }

# Keep environment setting
environment ENV.fetch("RAILS_ENV") { "production" }

# Configure thread pool size
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# Worker configuration for production
if ENV["RAILS_ENV"] == "production"
  # Reduce worker count for 1GB instances
  worker_count = ENV.fetch("WEB_CONCURRENCY") { 2 } # Reduced from 8
  workers worker_count
  
  # Increase worker timeout
  worker_timeout 120 # 2 minutes timeout
  
  # Use phased restarts
  restart_command 'bin/puma'
  
  # Preload app to reduce memory usage
  preload_app!
  
  # Reduce memory usage
  prune_bundler
end

# Other settings
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }
plugin :tmp_restart