# db/migrate/20250908120000_add_paystack_email_token_to_premium_subscriptions.rb
class AddPaystackEmailTokenToPremiumSubscriptions < ActiveRecord::Migration[7.1]
  def change
    add_column :premium_subscriptions, :paystack_email_token, :string
  end
end
