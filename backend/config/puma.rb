# This configuration file will be evaluated by Puma.
# The top-level methods that are invoked here are part of Puma's configuration DSL.

# Thread settings - adjust based on your database connection pool
max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 5).to_i
min_threads_count = ENV.fetch('RAILS_MIN_THREADS', max_threads_count).to_i

threads min_threads_count, max_threads_count

# Worker configuration for cluster mode
if ENV['RAILS_ENV'] == 'production'
  # Use 1 worker by default; override with WEB_CONCURRENCY
  worker_count = ENV.fetch('WEB_CONCURRENCY', 1).to_i

  # Ensure at least 1 worker
  worker_count = 1 if worker_count < 1

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
end

# Basic settings
puma_port = ENV.fetch('PORT', 3000).to_i

port puma_port

environment ENV.fetch('RAILS_ENV', 'development')

pidfile ENV.fetch('PIDFILE', 'tmp/pids/server.pid')

# Allow for zero-downtime restarts
plugin :tmp_restart

# Bind to all interfaces
bind "tcp://0.0.0.0:#{puma_port}"

# Health check endpoint / Puma stats
before_fork do
  require 'puma/plugin/stats'
end

# For better performance with reverse proxies
persistent_timeout 20
wait_for_less_busy_worker 0.01