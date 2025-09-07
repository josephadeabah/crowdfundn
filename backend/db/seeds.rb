# db/seeds.rb
# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# How to Use Your System:
# 1. Run all seeds:
# bash
# rails db:seed
# 2. Run only premium plans seed:
# bash
# rails db:seed:premium_plans
# 3. Run in production:
# bash
# RAILS_ENV=production rails db:seed:premium_plans
# 4. See all available seed tasks:
# bash
# rails -T db:seed
# db/seeds.rb
# This is the main seed file that loads all other seeds

puts "Loading seed data..."

# Load all seed files in specific order
require_relative 'seeds/premium_plans'

puts "Seed data loaded successfully!"