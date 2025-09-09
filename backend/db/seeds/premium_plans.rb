# db/seeds/premium_plans.rb
puts "Creating premium plans..."

begin
  ActiveRecord::Base.transaction do
    puts "Step 1: Clearing existing references..."

    users_updated = User.where.not(premium_plan_id: nil).update_all(
      premium_plan_id: nil,
      updated_at: Time.current
    )
    puts "✓ Cleared premium_plan_id from #{users_updated} users"

    subscriptions_updated = PremiumSubscription.where.not(premium_plan_id: nil).update_all(
      premium_plan_id: nil,
      updated_at: Time.current
    )
    puts "✓ Cleared premium_plan_id from #{subscriptions_updated} subscriptions"

    puts "Step 2: Removing old premium plans..."
    plans_deleted_count = PremiumPlan.count
    PremiumPlan.destroy_all
    puts "✓ Deleted #{plans_deleted_count} existing premium plans"

    puts "Step 3: Creating new premium plans..."
    plans = [
      {
        name: 'Starter',
        price: 99.99,
        currency: 'GHS',
        interval: 'monthly',
        description: 'Perfect for individual fundraisers',
        paystack_plan_code: 'PLN_qwcovvd895bdp4f', # 👈 replace with your actual Paystack plan code
        features: {
          'Communication Channels': 'Email only',
          'Response Time': '1 day',
          'Support Agents': 'General staff',
          'Marketing & Analytics Toolkit': true,
          'Influencer Marketing': false,
          'Campaign Strategy Review': false,
          'Priority Support': false
        },
        active: true
      },
      {
        name: 'Growth',
        price: 299.99,
        currency: 'GHS',
        interval: 'monthly',
        description: 'Ideal for growing organizations',
        paystack_plan_code: 'PLN_4toraho9iiimof0', # 👈 replace
        features: {
          'Communication Channels': 'Email & Google Hangout',
          'Response Time': 'Within 5 hours',
          'Support Agents': 'Technical & Marketing experts',
          'Marketing & Analytics Toolkit': true,
          'Influencer Marketing': false,
          'Campaign Strategy Review': true,
          'Priority Support': false
        },
        active: true
      },
      {
        name: 'Pro+',
        price: 499.99,
        currency: 'GHS',
        interval: 'monthly',
        description: 'Complete solution for professional fundraisers',
        paystack_plan_code: 'PLN_9v6y9n2qhyz3uxl', # 👈 replace
        features: {
          'Communication Channels': 'Email, Google Hangout & Customer Preferred',
          'Response Time': 'Within 30 mins',
          'Support Agents': 'Dedicated professionals',
          'Marketing & Analytics Toolkit': true,
          'Influencer Marketing': true,
          'Campaign Strategy Review': true,
          'Priority Support': true
        },
        active: true
      }
    ]

    created_plans = plans.map do |plan_data|
      PremiumPlan.create!(plan_data.merge(created_at: Time.current, updated_at: Time.current)).tap do |plan|
        puts "✓ Created plan: #{plan.name} (#{plan.currency} #{plan.price}/#{plan.interval})"
      end
    end

    puts "\n🎉 Successfully created #{created_plans.size} premium plans:"
    created_plans.each do |plan|
      puts "   • #{plan.name}: #{plan.currency} #{plan.price} (#{plan.interval}) | Code: #{plan.paystack_plan_code}"
    end
  end

rescue ActiveRecord::RecordInvalid => e
  puts "❌ Error creating premium plans: #{e.message}"
  puts "Backtrace: #{e.backtrace.first(5).join("\n")}"
rescue StandardError => e
  puts "❌ Unexpected error: #{e.message}"
  puts "Backtrace: #{e.backtrace.first(5).join("\n")}"
end

puts "\nFinal verification..."
current_plan_count = PremiumPlan.count
if current_plan_count == 3
  puts "✅ SUCCESS: All 3 premium plans created successfully!"
  puts "Available plans: #{PremiumPlan.pluck(:name, :paystack_plan_code).map { |n, c| "#{n} (#{c})" }.join(', ')}"
else
  puts "❌ WARNING: Expected 3 plans, but found #{current_plan_count}"
  puts "Available plans: #{PremiumPlan.pluck(:name, :paystack_plan_code).map { |n, c| "#{n} (#{c})" }.join(', ')}"
end

puts "\nPremium plans seeding completed! 🚀"
