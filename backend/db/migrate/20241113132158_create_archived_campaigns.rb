class CreateArchivedCampaigns < ActiveRecord::Migration[7.1]
  def change
    create_table :archived_campaigns do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.decimal :goal_amount
      t.decimal :current_amount
      t.datetime :start_date
      t.datetime :end_date
      t.integer :status
      t.string :category
      t.string :location
      t.string :currency
      t.string :currency_code
      t.string :currency_symbol
      t.string :media

      t.timestamps
    end
  end
end
