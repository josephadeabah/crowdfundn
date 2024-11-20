Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://www.bantuhive.com'

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete],
             credentials: true,
             max_age: 86400
  end
end
