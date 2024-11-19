Sidekiq.configure_server do |config|
    config.redis = {
      url: ENV.fetch("UPSTASH_REDIS_REST_URL").strip,
      password: ENV.fetch("UPSTASH_REDIS_REST_TOKEN").strip,
      size: 5 # Limit connection pool size
    }
  end
  
  Sidekiq.configure_client do |config|
    config.redis = {
      url: ENV.fetch("UPSTASH_REDIS_REST_URL").strip,
      password: ENV.fetch("UPSTASH_REDIS_REST_TOKEN").strip,
      size: 1 # Reduce client pool size
    }
  end
  