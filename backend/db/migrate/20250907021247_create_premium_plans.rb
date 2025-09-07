class CreatePremiumPlans < ActiveRecord::Migration[7.1]
  def change
    create_table :premium_plans do |t|
      t.string :name, null: false
      t.string :paystack_plan_code
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :currency, default: 'GHS'
      t.string :interval, null: false # monthly, quarterly, annually
      t.text :description
      t.jsonb :features, default: {}
      t.boolean :active, default: true
      t.integer :trial_period_days, default: 0

      t.timestamps
    end

    add_index :premium_plans, :paystack_plan_code, unique: true
  end
end