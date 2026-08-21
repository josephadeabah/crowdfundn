# This configuration file will be evaluated by Puma.
# The top-level methods that are invoked here are part of Puma's configuration DSL.

# Thread settings - adjust based on your database connection pool
max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 5).to_i
min_threads_count = ENV.fetch('RAILS_MIN_THREADS', max_threads_count).to_i

threads min_threads_count, max_threads_count

# Worker configuration for cluster mode
if ENV['RAILS_ENV'] == 'production'
  # Use single worker mode by default to avoid prepared statement conflicts
  # Override with WEB_CONCURRENCY if needed
  worker_count = ENV.fetch('WEB_CONCURRENCY', 0).to_i  # Changed default to 0
  
  # Use workers only if explicitly set
  if worker_count > 0
    workers worker_count
    
    # Preload application before forking workers
    preload_app!
    
    worker_timeout 60
    
    fork_worker do
      if defined?(ActiveRecord::Base)
        ActiveRecord::Base.connection.disconnect!
      end
    end
    
    on_worker_boot do
      if defined?(ActiveRecord::Base)
        ActiveRecord::Base.establish_connection
      end
    end
  else
    # Single mode (no workers) - avoids prepared statement conflicts
    # In single mode, we don't need to preload or handle worker lifecycle
    Rails.logger.info "Puma running in single mode (no workers)"
  end
end

# Basic settings
puma_port = ENV.fetch('PORT', 3000).to_i

port puma_port

environment ENV.fetch('RAILS_ENV', 'development')

pidfile ENV.fetch('PIDFILE', 'tmp/pids/server.pid')

# Allow for zero-downtime restarts
plugin :tmp_restart

# For better performance with reverse proxies
persistent_timeout 20
wait_for_less_busy_worker 0.01