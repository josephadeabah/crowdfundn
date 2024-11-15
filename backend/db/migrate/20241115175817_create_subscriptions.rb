class CreateSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true
      t.string :subscription_code
      t.string :email_token
      t.string :status, default: "active" # could be active, canceled, etc.
      t.timestamps
    end
    # Add a unique index for subscription_code
    add_index :subscriptions, :subscription_code, unique: true
  end
end
