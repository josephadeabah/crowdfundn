# config/puma.rb
# The optimal configuration for production cluster mode

# Thread settings - adjust based on your database connection pool
max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 5).to_i
min_threads_count = ENV.fetch('RAILS_MIN_THREADS', max_threads_count).to_i
threads min_threads_count, max_threads_count

# Worker configuration for cluster mode
if ENV['RAILS_ENV'] == 'production'
  # Use all available CPU cores by default
  worker_count = ENV.fetch('WEB_CONCURRENCY') { Concurrent.physical_processor_count }.to_i
  
  # Ensure at least 1 worker if physical processor count returns 0
  worker_count = 1 if worker_count < 1
  
  workers worker_count
  
  # Important cluster mode settings
  preload_app!  # Preload the application before forking workers
  worker_timeout 60  # Default is 30, increase if you have long-running requests
  
  # Recommended for deployments with zero-downtime restarts
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
end

# Basic settings
port ENV.fetch('PORT', 3000)
environment ENV.fetch('RAILS_ENV', 'development')
pidfile ENV.fetch('PIDFILE', 'tmp/pids/server.pid')

# Allow for zero-downtime restarts
plugin :tmp_restart

# Optimize for Kubernetes/container environments
bind 'tcp://0.0.0.0:3000'

# For better performance with reverse proxies
persistent_timeout 20  # Default is 20 seconds
wait_for_less_busy_worker 0.01  # Helps balance load between workers



