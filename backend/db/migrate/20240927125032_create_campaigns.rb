class CreateCampaigns < ActiveRecord::Migration[7.1]
  def change
    create_table :campaigns do |t|
      t.string :title
      t.text :description
      t.decimal :goal_amount
      t.decimal :current_amount
      t.datetime :start_date
      t.datetime :end_date
      t.string :category
      t.string :location
      t.string :currency
      t.string :currency_code
      t.string :currency_symbol
      t.integer :status
      t.references :fundraiser, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
