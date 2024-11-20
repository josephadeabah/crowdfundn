# Rails.application.config.middleware.insert_before 0, Rack::Cors do
#   allow do
#     origins 'http://localhost:3000', 'https://www.bantuhive.com', 'https://bantuhive.com'

#     resource '*',
#              headers: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Prototype-Version', 'X-CSRF-Token', 'X-CSRF-Param', 'X-User-Email', 'X-User-Token', 'Origin'],
#              methods: %i[get post put patch delete],
#              credentials: true,
#              max_age: 86400
#   end
# end
