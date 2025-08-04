Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://bantuhive.com'

    resource '*',
      headers: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
