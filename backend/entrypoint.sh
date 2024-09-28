#!/bin/bash

set -e

# Go to the app directory
cd /usr/src/app

# Clean up old logs and pids
> log/production.log
rm -f tmp/pids/server.pid

# Ensure the database is created and migrated
RAILS_ENV=production bundle exec rake db:migrate

# Start Puma server
exec bundle exec puma -C config/puma.rb
