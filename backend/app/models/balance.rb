# app/models/balance.rb
class Balance < ApplicationRecord
    # Possible statuses for balance records
    enum status: { pending: "pending", transferred: "transferred" }
end
  