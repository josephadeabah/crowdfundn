# db/seeds/premium_plans.rb
puts "Creating premium plans..."

# Disable foreign key checks temporarily for additional safety
database_adapter = ActiveRecord::Base.connection.adapter_name
if database_adapter == 'PostgreSQL'
  ActiveRecord::Base.connection.execute('SET CONSTRAINTS ALL DEFERRED')
  puts "PostgreSQL constraints deferred"
elsif database_adapter == 'MySQL'
  ActiveRecord::Base.connection.execute('SET FOREIGN_KEY_CHECKS=0')
  puts "MySQL foreign key checks disabled"
else
  puts "Using #{database_adapter} - no constraint modification needed"
end

begin
  # Track what we're doing
  puts "Step 1: Clearing existing references..."
  
  # First, set all user premium_plan_id to NULL
  users_updated = User.where.not(premium_plan_id: nil).update_all(premium_plan_id: nil, updated_at: Time.current)
  puts "✓ Cleared premium_plan_id from #{users_updated} users"

  # Safely handle existing subscriptions by setting premium_plan_id to NULL
  subscriptions_updated = PremiumSubscription.where.not(premium_plan_id: nil).update_all(
    premium_plan_id: nil, 
    updated_at: Time.current
  )
  puts "✓ Cleared premium_plan_id from #{subscriptions_updated} subscriptions"

  # Delete all existing plans
  puts "Step 2: Removing old premium plans..."
  plans_deleted_count = PremiumPlan.count
  PremiumPlan.destroy_all
  puts "✓ Deleted #{plans_deleted_count} existing premium plans"

  # Create new premium plans
  puts "Step 3: Creating new premium plans..."
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
      },
      active: true,
      stripe_price_id: ENV['STRIPE_STARTER_PRICE_ID'],
      paystack_plan_code: ENV['PAYSTACK_STARTER_PLAN_CODE'],
      created_at: Time.current,
      updated_at: Time.current
    },
    {
      name: 'Growth',
      price: 299.99,
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
      },
      active: true,
      stripe_price_id: ENV['STRIPE_GROWTH_PRICE_ID'],
      paystack_plan_code: ENV['PAYSTACK_GROWTH_PLAN_CODE'],
      created_at: Time.current,
      updated_at: Time.current
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
      },
      active: true,
      stripe_price_id: ENV['STRIPE_PRO_PRICE_ID'],
      paystack_plan_code: ENV['PAYSTACK_PRO_PLAN_CODE'],
      created_at: Time.current,
      updated_at: Time.current
    }
  ]

  created_plans = []
  plans.each do |plan_data|
    plan = PremiumPlan.create!(plan_data)
    created_plans << plan
    puts "✓ Created plan: #{plan.name} (#{plan.currency} #{plan.price}/#{plan.interval})"
  end

  puts ""
  puts "🎉 Successfully created #{created_plans.size} premium plans:"
  created_plans.each do |plan|
    puts "   • #{plan.name}: #{plan.currency} #{plan.price} (#{plan.interval})"
  end

rescue ActiveRecord::RecordInvalid => e
  puts "❌ Error creating premium plans: #{e.message}"
  puts "Backtrace: #{e.backtrace.first(5).join("\n")}"
  
rescue StandardError => e
  puts "❌ Unexpected error: #{e.message}"
  puts "Backtrace: #{e.backtrace.first(5).join("\n")}"

ensure
  # Always re-enable foreign key checks
  puts "Step 4: Cleaning up..."
  if database_adapter == 'PostgreSQL'
    ActiveRecord::Base.connection.execute('SET CONSTRAINTS ALL IMMEDIATE')
    puts "✓ PostgreSQL constraints re-enabled"
  elsif database_adapter == 'MySQL'
    ActiveRecord::Base.connection.execute('SET FOREIGN_KEY_CHECKS=1')
    puts "✓ MySQL foreign key checks re-enabled"
  end
end

# Final verification
puts ""
puts "Final verification..."
current_plan_count = PremiumPlan.count
if current_plan_count == 3
  puts "✅ SUCCESS: All 3 premium plans created successfully!"
  puts "Available plans: #{PremiumPlan.pluck(:name).join(', ')}"
else
  puts "❌ WARNING: Expected 3 plans, but found #{current_plan_count}"
  puts "Available plans: #{PremiumPlan.pluck(:name).join(', ') || 'None'}"
end

puts ""
puts "Premium plans seeding completed! 🚀"