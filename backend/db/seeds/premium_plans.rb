# db/seeds/premium_plans.rb
# run  this file with `bin/rails db:seed:premium_plans`
puts "Creating premium plans..."

# Delete existing plans to avoid duplicates
PremiumPlan.destroy_all

plans = [
  {
    name: 'Starter',
    price: 99.99,
    currency: 'GHS',
    interval: 'monthly',
    description: 'Perfect for individual fundraisers',
    features: {
      'Communication Channels': 'Email only',
      'Response Time': '1 day',
      'Support Agents': 'General staff',
      'Marketing & Analytics Toolkit': true,
      'Influencer Marketing': false,
      'Campaign Strategy Review': false,
      'Priority Support': false
    }
  },
  {
    name: 'Growth',
    price: 199.99,
    currency: 'GHS',
    interval: 'monthly',
    description: 'Ideal for growing organizations',
    features: {
      'Communication Channels': 'Email & Google Hangout',
      'Response Time': 'Within 5 hours',
      'Support Agents': 'Technical & Marketing experts',
      'Marketing & Analytics Toolkit': true,
      'Influencer Marketing': false,
      'Campaign Strategy Review': true,
      'Priority Support': false
    }
  },
  {
    name: 'Pro+',
    price: 499.99,
    currency: 'GHS',
    interval: 'monthly',
    description: 'Complete solution for professional fundraisers',
    features: {
      'Communication Channels': 'Email, Google Hangout & Customer Preferred',
      'Response Time': 'Within 30 mins',
      'Support Agents': 'Dedicated professionals',
      'Marketing & Analytics Toolkit': true,
      'Influencer Marketing': true,
      'Campaign Strategy Review': true,
      'Priority Support': true
    }
  }
]

plans.each do |plan_data|
  PremiumPlan.create!(plan_data)
  puts "Created plan: #{plan_data[:name]}"
end

puts "Created #{PremiumPlan.count} premium plans"