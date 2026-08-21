# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Production origins
    origins 'https://bantuhive.com',
            'https://www.bantuhive.com',
            'https://api.bantuhive.com',
            'https://crowdfundn.vercel.app',
            # Vercel preview deployments (dynamic)
            -> { ENV.fetch('FRONTEND_URLS', '').split(',') },
            # Local development
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Disposition', 'X-CSRF-Token'],
      max_age: 3600
  end
end