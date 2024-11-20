Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', 'https://bantuhive.com', 'https://www.bantuhive.com', 'https://bantuhive-api-dicht.ondigitalocean.app'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true,
             expose: ['Authorization']
  end
end
