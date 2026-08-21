# This configuration file will be evaluated by Puma.
# The top-level methods invoked here are part of Puma's configuration DSL.

# Thread settings
max_threads_count = ENV.fetch("RAILS_MAX_THREADS", 5).to_i
min_threads_count = ENV.fetch("RAILS_MIN_THREADS", max_threads_count).to_i

threads min_threads_count, max_threads_count

# Single-mode Puma:
# Do NOT configure `workers`.
# Do NOT use `preload_app!`.
# Do NOT use worker lifecycle hooks.

# Port
port ENV.fetch("PORT", 3000).to_i

# Environment
environment ENV.fetch("RAILS_ENV", "development")

# PID file
pidfile ENV.fetch("PIDFILE", "tmp/pids/server.pid")

# Allow hot restarts
plugin :tmp_restart

# Connection / request settings
persistent_timeout 20
wait_for_less_busy_worker 0.01