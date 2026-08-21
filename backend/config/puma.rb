# config/puma.rb
# This configuration file will be evaluated by Puma.
# The top-level methods that are invoked here are part of Puma's configuration DSL.

# Thread settings - adjust based on your database connection pool
max_threads_count = ENV.fetch('RAILS_MAX_THREADS', 5).to_i
min_threads_count = ENV.fetch('RAILS_MIN_THREADS', max_threads_count).to_i

threads min_threads_count, max_threads_count

# Worker configuration - set to 0 for single mode
worker_count = ENV.fetch('WEB_CONCURRENCY', 0).to_i
workers worker_count

# Only preload and configure workers if we have workers
if worker_count > 0
  preload_app!
  
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

# For better performance with reverse proxies
persistent_timeout 20