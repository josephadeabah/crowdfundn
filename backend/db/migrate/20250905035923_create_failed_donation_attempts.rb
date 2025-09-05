# db/migrate/20240101_create_failed_donation_attempts.rb
class CreateFailedDonationAttempts < ActiveRecord::Migration[7.1]
  def change
    create_table :failed_donation_attempts do |t|
      t.string :transaction_reference, null: false
      t.json :payload
      t.json :metadata
      t.json :error_messages
      t.string :status
      t.boolean :resolved, default: false
      t.datetime :resolved_at

      t.timestamps
    end

    add_index :failed_donation_attempts, :transaction_reference
    add_index :failed_donation_attempts, :status
    add_index :failed_donation_attempts, :resolved
  end
end