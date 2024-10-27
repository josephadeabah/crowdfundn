Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 'https://crowdfundn.vercel.app', 'https://bantuhive-api-dicht.ondigitalocean.app'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             expose: ['Authorization'],
             credentials: true
  end
end
