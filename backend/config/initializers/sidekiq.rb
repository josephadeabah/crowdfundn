Sidekiq.configure_server do |config|
    config.redis = {
      url: ENV.fetch("UPSTASH_REDIS_REST_URL"),
      password: ENV.fetch("UPSTASH_REDIS_REST_TOKEN")
    }
  end
  
Sidekiq.configure_client do |config|
config.redis = {
    url: ENV.fetch("UPSTASH_REDIS_REST_URL"),
    password: ENV.fetch("UPSTASH_REDIS_REST_TOKEN")
}
end
  