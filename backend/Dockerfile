# syntax = docker/dockerfile:1

ARG RUBY_VERSION=3.3.4
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim AS base

WORKDIR /usr/src/app

ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Install required packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libvips pkg-config

COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

COPY . .

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# ENV variables
# ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/config/paysight_runner.key
ARG DB_PASSWORD
ARG SECRET_KEY_BASE
ENV DATABASE_PASSWORD=${DB_PASSWORD}
ENV SECRET_KEY_BASE=${SECRET_KEY_BASE}
ENV RAILS_SERVE_STATIC_FILES=true
ENV RAILS_LOG_TO_STDOUT=true

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
