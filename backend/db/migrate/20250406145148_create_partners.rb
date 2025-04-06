class CreatePartners < ActiveRecord::Migration[7.1]
  def change
    create_table :partners do |t|
      t.references :user, null: false, foreign_key: true
      t.string :company_name
      t.text :description
      t.string :website
      t.string :niche
      t.integer :audience_size
      t.decimal :success_rate
      t.string :verification_status
      t.text :verification_notes
      t.datetime :verified_at
      t.integer :verified_by_id
      t.string :referral_token
      t.string :slug
      t.jsonb :metadata

      t.timestamps
    end
  end
end
