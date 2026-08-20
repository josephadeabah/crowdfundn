# syntax = docker/dockerfile:1

ARG RUBY_VERSION=3.3.6  # Changed from 3.3.4 to 3.3.6
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim AS base

WORKDIR /usr/src/app

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development:test"

# Install required packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    git \
    libpq-dev \
    libvips \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Gemfile and install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Copy and set entrypoint
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Environment variables
ARG DB_PASSWORD
ARG SECRET_KEY_BASE
ARG SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY
ARG SUPABASE_STORAGE_BUCKET

ENV DATABASE_PASSWORD=${DB_PASSWORD} \
    SECRET_KEY_BASE=${SECRET_KEY_BASE} \
    SUPABASE_URL=${SUPABASE_URL} \
    SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY} \
    SUPABASE_STORAGE_BUCKET=${SUPABASE_STORAGE_BUCKET} \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]